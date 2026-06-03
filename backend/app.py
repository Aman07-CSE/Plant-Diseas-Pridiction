"""
Plant Disease Prediction API
Flask backend that serves the PyTorch model and integrates with Google Gemini API.
"""

import os
import io
import json
import time
import torch

from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from torchvision import transforms
from dotenv import load_dotenv
from google import genai

from model import PlantDiseaseCNN, IMAGE_SIZE

# ── Load environment variables ──────────────────────────────────────────────
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# ── Configure Gemini (new google-genai package) ─────────────────────────────
gemini_client = None
if GEMINI_API_KEY and GEMINI_API_KEY != "your_api_key_here":
    gemini_client = genai.Client(api_key=GEMINI_API_KEY)
    print("[INFO] Gemini API configured successfully.")
else:
    print("[WARNING] GEMINI_API_KEY not set. Gemini features will be disabled.")

# ── Flask app ───────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ── Load PyTorch model ──────────────────────────────────────────────────────
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[INFO] Using device: {DEVICE}")

# Optimize CPU memory usage on Render Free Tier
if DEVICE.type == "cpu":
    torch.set_num_threads(1)

# Load class indices
CLASS_INDICES_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "class_indices.json")
with open(CLASS_INDICES_PATH, "r") as f:
    class_indices = json.load(f)
# Convert string keys to int keys
class_indices = {int(k): v for k, v in class_indices.items()}
NUM_CLASSES = len(class_indices)

# Instantiate and load model
model = PlantDiseaseCNN(num_classes=NUM_CLASSES).to(DEVICE)
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "plant_model.pth")
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE, weights_only=True))
model.eval()
print(f"[INFO] Model loaded successfully with {NUM_CLASSES} classes")

# ── Image preprocessing (must match training) ──────────────────────────────
inference_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
])


def format_class_name(raw_name: str) -> dict:
    """Parse class name like 'Apple___Apple_scab' into plant + condition."""
    parts = raw_name.split("___")
    plant = parts[0].replace("_", " ").replace(",", ", ")
    condition = parts[1].replace("_", " ") if len(parts) > 1 else "Unknown"
    is_healthy = condition.lower() == "healthy"
    return {
        "plant": plant,
        "condition": condition,
        "is_healthy": is_healthy,
        "raw": raw_name,
    }


def get_gemini_recommendation(prediction_info: dict) -> str:
    """Get recommendation from Gemini API based on prediction."""
    if gemini_client is None:
        return "Gemini API key not configured. Please set GEMINI_API_KEY in backend/.env"

    plant = prediction_info["plant"]
    condition = prediction_info["condition"]
    is_healthy = prediction_info["is_healthy"]

    if is_healthy:
        prompt = f"""You are a plant expert. The plant identified is: {plant} and it appears to be HEALTHY.
        
Please provide:
1. A brief congratulatory note about the plant being healthy
2. General care tips for {plant} (watering, sunlight, soil requirements)
3. Common threats to watch out for
4. Best practices to maintain plant health

Keep your response concise but informative. Use markdown formatting with headers and bullet points."""
    else:
        prompt = f"""You are a plant disease expert. A plant disease has been detected:
- Plant: {plant}
- Disease: {condition}

Please provide:
1. A brief description of this disease
2. Causes and how it spreads
3. Symptoms to look for
4. Treatment and remedies (both organic and chemical)
5. Prevention measures for the future

Keep your response concise but informative. Use markdown formatting with headers and bullet points."""

    text, _error = generate_content_with_retry(prompt)
    if text:
        return text

    # Graceful fallback so prediction endpoint remains useful during API spikes.
    if is_healthy:
        return (
            f"## {plant} looks healthy\n"
            "- Keep consistent watering and good airflow.\n"
            "- Provide adequate sunlight and avoid over-fertilizing.\n"
            "- Inspect leaves weekly for early signs of pests or spots.\n"
            "- Remove dead foliage promptly to prevent infections."
        )

    return (
        f"## {condition} detected in {plant}\n"
        "- Isolate affected leaves/plants if possible.\n"
        "- Remove heavily infected leaves and sanitize tools.\n"
        "- Avoid overhead watering and improve air circulation.\n"
        "- Apply a suitable fungicide/bactericide as per label guidance.\n"
        "- Monitor nearby plants for similar symptoms."
    )


def generate_content_with_retry(prompt: str, retries: int = 3, delay_seconds: float = 1.5):
    """Call Gemini with retries for transient failures and return (text, error)."""
    if gemini_client is None:
        return None, "Gemini API key not configured"

    last_error = None
    for attempt in range(retries):
        try:
            response = gemini_client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )
            return response.text, None
        except Exception as e:
            last_error = str(e)
            is_last_try = attempt == retries - 1
            if is_last_try:
                break
            # Retry only on common transient states.
            lower = last_error.lower()
            transient = any(token in lower for token in ["503", "unavailable", "timeout", "rate", "429"])
            if not transient:
                break
            time.sleep(delay_seconds * (attempt + 1))

    return None, last_error


# ── API Routes ──────────────────────────────────────────────────────────────

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "ok",
        "model_loaded": True,
        "gemini_configured": gemini_client is not None,
        "device": str(DEVICE),
        "num_classes": NUM_CLASSES,
    })


@app.route("/api/predict", methods=["POST"])
def predict():
    """Predict plant disease from uploaded image."""
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:
        # Read and preprocess image
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        tensor = inference_transform(image).unsqueeze(0).to(DEVICE)

        # Run inference
        with torch.no_grad():
            outputs = model(tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence, predicted_idx = torch.max(probabilities, dim=1)

        predicted_class = class_indices[predicted_idx.item()]
        confidence_percent = round(confidence.item() * 100, 2)

        # Format result
        prediction_info = format_class_name(predicted_class)
        prediction_info["confidence"] = confidence_percent

        # Get Gemini recommendation
        recommendation = get_gemini_recommendation(prediction_info)

        return jsonify({
            "success": True,
            "prediction": prediction_info,
            "recommendation": recommendation,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/chat", methods=["POST"])
def chat():
    """Chatbot endpoint using Gemini API."""
    if gemini_client is None:
        return jsonify({"error": "Gemini API key not configured"}), 503

    data = request.get_json()
    if not data or "message" not in data:
        return jsonify({"error": "No message provided"}), 400

    user_message = data["message"]
    history = data.get("history", [])

    # Build conversation context
    system_prompt = """You are PlantDoc AI, a friendly and knowledgeable plant disease expert and agricultural advisor. 
You help users with:
- Plant disease identification and treatment
- Plant care tips and best practices
- Organic and chemical treatment recommendations
- Crop management advice
- General gardening and agriculture questions

Keep responses concise, helpful, and use markdown formatting. 
If a question is not related to plants or agriculture, politely redirect the conversation back to plant-related topics.
Always be encouraging and supportive."""

    # Build full prompt with history
    full_prompt = f"{system_prompt}\n\nConversation so far:\n"
    for msg in history[-10:]:  # Last 10 messages for context
        role = msg.get("role", "user")
        content = msg.get("content", "")
        full_prompt += f"{role}: {content}\n"

    full_prompt += f"\nUser: {user_message}\n\nPlease respond helpfully:"

    text, error = generate_content_with_retry(full_prompt)
    if text:
        return jsonify({
            "success": True,
            "response": text,
        })

    lower_error = (error or "").lower()
    transient = any(token in lower_error for token in ["503", "unavailable", "timeout", "rate", "429"])

    if transient:
        fallback = (
            "Gemini is temporarily busy right now. Here are quick plant-care basics while it recovers:\n\n"
            "- Check soil moisture before watering to avoid overwatering.\n"
            "- Ensure enough sunlight based on crop type.\n"
            "- Remove visibly infected leaves and keep tools sanitized.\n"
            "- Improve airflow and avoid watering leaves late in the day.\n\n"
            "Try your message again in a minute for a full AI response."
        )
        return jsonify({
            "success": True,
            "response": fallback,
            "degraded": True,
        })

    return jsonify({"error": error or "Unknown error from Gemini API"}), 500


# ── Run ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

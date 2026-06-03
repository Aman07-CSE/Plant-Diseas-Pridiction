# Plant Disease Prediction - Detailed Project Documentation


- /api ->Live Link : "https://plant-diseas-pridiction-1.onrender.com"


## 1. Project Overview

This is a full-stack AI web application for plant disease diagnosis from leaf images.

Core capabilities:
- Upload a leaf image or capture from camera
- Predict plant disease class using a trained PyTorch model
- Return confidence score and structured prediction details
- Generate treatment guidance and chatbot answers using Google Gemini

Tech stack:
- Backend: Flask, PyTorch, torchvision, Pillow, python-dotenv, google-genai
- Frontend: React (Vite), Tailwind CSS v4, Framer Motion, Axios, React Markdown, React Webcam
- Dataset: PlantVillage (color, grayscale, segmented)

---

## 2. High-Level Architecture

1. Frontend sends requests to /api/*.
2. Vite dev server proxies /api to backend at http://localhost:5000.
3. Backend preprocesses image and runs PyTorch inference.
4. Backend maps class index to disease label using class_indices.json.
5. Backend optionally calls Gemini for recommendation/chat.
6. Backend returns JSON response to frontend.

---

## 3. ML Model Details

Primary classifier:
- File: backend/model.py
- Class: PlantDiseaseCNN
- Input size: 224x224 RGB
- Classes: 38
- Trained weights file: plant_model.pth

Architecture summary:
- Conv2d(3->32) + ReLU + MaxPool
- Conv2d(32->64) + ReLU + MaxPool
- Conv2d(64->128) + ReLU + MaxPool
- Flatten
- Linear -> 128 + ReLU + Dropout(0.3)
- Linear -> 38 classes

Inference behavior:
- Resize image to 224x224
- Convert to tensor
- Softmax probabilities
- Select max-confidence class

---

## 4. Gemini Integration

Gemini usage:
- SDK: google-genai
- Model name used: gemini-2.5-flash
- Used in:
  - /api/chat endpoint (assistant responses)
  - /api/predict endpoint (recommendation text)

Reliability behavior:
- Retry logic for transient errors (503, 429, timeout, unavailable)
- Graceful fallback response when Gemini is overloaded

Environment variable:
- GEMINI_API_KEY in backend/.env

---

## 5. Backend API Details

Backend entry:
- backend/app.py

Main endpoints:
- GET /api/health
  - Returns backend status, model loaded state, device, class count, Gemini config state
- POST /api/predict
  - multipart/form-data with image
  - Returns prediction object, confidence, and recommendation
- POST /api/chat
  - JSON with message and optional history
  - Returns chatbot response

CORS:
- Enabled for /api/*

Device:
- Uses CUDA if available, otherwise CPU

---

## 6. Frontend App Details

Frontend app root:
- frontend/src/App.jsx

Major UI sections:
- Navbar
- HeroSection
- DetectionSection
- ChatbotSection
- Footer

API client:
- frontend/src/services/api.js
- Axios baseURL: /api
- Timeout: 120000 ms

Vite proxy config:
- frontend/vite.config.js
- /api -> http://localhost:5000

Styling and UX:
- Tailwind CSS v4
- Custom theme tokens and animations in frontend/src/index.css
- Framer Motion for transitions and interactions

---

## 7. Dependencies

Backend dependencies (backend/requirements.txt):
- flask==3.1.1
- flask-cors==5.0.1
- torch==2.11.0
- torchvision==0.26.0
- Pillow==12.2.0
- google-genai==1.52.0
- python-dotenv==1.1.0

Frontend dependencies (frontend/package.json):
- react, react-dom
- vite, @vitejs/plugin-react
- tailwindcss, @tailwindcss/vite
- axios
- framer-motion
- lucide-react
- react-markdown
- react-webcam
- eslint and related lint tooling

---

## 8. Project File Structure (Detailed)

```text
Plant Diseas Pridiction/
├── .venv/                             # Python virtual environment (workspace level)
├── backend/
│   ├── .env                           # Environment variables (GEMINI_API_KEY)
│   ├── app.py                         # Flask API, model loading, Gemini integration
│   ├── model.py                       # PlantDiseaseCNN architecture
│   ├── requirements.txt               # Backend dependencies
│   ├── venv/                          # Additional/old virtual env folder
│   └── __pycache__/
├── frontend/
│   ├── .gitignore
│   ├── dist/                          # Frontend production build output
│   ├── eslint.config.js
│   ├── index.html
│   ├── node_modules/                  # Frontend installed packages
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md                      # Run guide
│   ├── vite.config.js                 # Vite config + backend proxy
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── assets/
│       │   ├── hero.png
│       │   ├── react.svg
│       │   └── vite.svg
│       ├── components/
│       │   ├── ChatbotSection.jsx
│       │   ├── DetectionSection.jsx
│       │   ├── HeroSection.jsx
│       │   └── Navbar.jsx
│       └── services/
│           └── api.js
├── class_indices.json                 # Class index -> class name mapping (38 classes)
├── detailed.md                        # This document
├── Plant_Model_End_To_End.ipynb       # Training/experimentation notebook
├── PlantModelEndtoEnd.md              # Exported notebook markdown
├── PlantModelEndtoEnd_files/
│   ├── PlantModelEndtoEnd_15_0.png
│   └── PlantModelEndtoEnd_15_1.png
├── plant_model.pth                    # Trained PyTorch weights
├── plantvillage dataset/
│   ├── color/
│   ├── grayscale/
│   └── segmented/
└── temp_image.jpg                     # Temporary image file
```

---

## 9. PlantVillage Dataset Class Structure

Each dataset split folder contains the same 38 class directories:
- color/
- grayscale/
- segmented/

Class directories:
1. Apple___Apple_scab
2. Apple___Black_rot
3. Apple___Cedar_apple_rust
4. Apple___healthy
5. Blueberry___healthy
6. Cherry_(including_sour)___healthy
7. Cherry_(including_sour)___Powdery_mildew
8. Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot
9. Corn_(maize)___Common_rust_
10. Corn_(maize)___healthy
11. Corn_(maize)___Northern_Leaf_Blight
12. Grape___Black_rot
13. Grape___Esca_(Black_Measles)
14. Grape___healthy
15. Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
16. Orange___Haunglongbing_(Citrus_greening)
17. Peach___Bacterial_spot
18. Peach___healthy
19. Pepper,_bell___Bacterial_spot
20. Pepper,_bell___healthy
21. Potato___Early_blight
22. Potato___healthy
23. Potato___Late_blight
24. Raspberry___healthy
25. Soybean___healthy
26. Squash___Powdery_mildew
27. Strawberry___healthy
28. Strawberry___Leaf_scorch
29. Tomato___Bacterial_spot
30. Tomato___Early_blight
31. Tomato___healthy
32. Tomato___Late_blight
33. Tomato___Leaf_Mold
34. Tomato___Septoria_leaf_spot
35. Tomato___Spider_mites Two-spotted_spider_mite
36. Tomato___Target_Spot
37. Tomato___Tomato_mosaic_virus
38. Tomato___Tomato_Yellow_Leaf_Curl_Virus

---

## 10. Class Index Mapping File

File:
- class_indices.json

Purpose:
- Maps output neuron index from model to readable class labels.
- Total classes: 38.

---

## 11. Run Flow Summary

Backend:
1. Load environment variables
2. Initialize Gemini client if key exists
3. Load class_indices.json
4. Load plant_model.pth into PlantDiseaseCNN
5. Start Flask on port 5000

Frontend:
1. Start Vite dev server (port 5173 by default)
2. Call /api via Axios
3. Vite proxy forwards /api to backend

---

## 12. Current Known Operational Notes

- Gemini may occasionally return 503 (high demand). Backend now retries and returns graceful fallback when needed.
- Backend and frontend should be run in separate terminals.
- There are both .venv and backend/venv folders; current working setup uses .venv at project root.

---

## 13. Important Files Quick Reference

Backend:
- backend/app.py
- backend/model.py
- backend/requirements.txt
- backend/.env

Frontend:
- frontend/src/App.jsx
- frontend/src/components/DetectionSection.jsx
- frontend/src/components/ChatbotSection.jsx
- frontend/src/components/HeroSection.jsx
- frontend/src/components/Navbar.jsx
- frontend/src/services/api.js
- frontend/vite.config.js
- frontend/src/index.css

Data/Model:
- plant_model.pth
- class_indices.json
- plantvillage dataset/

Notebook/Docs:
- Plant_Model_End_To_End.ipynb
- PlantModelEndtoEnd.md
- frontend/README.md

from pathlib import Path
from typing import List, Tuple

import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent
OUT_DIR = ROOT / "report_figures"
DATASET_DIR = ROOT / "plantvillage dataset" / "color"


def ensure_out_dir() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)


def save_fig(fig: plt.Figure, filename: str) -> None:
    fig.tight_layout()
    fig.savefig(OUT_DIR / filename, dpi=240, bbox_inches="tight")
    plt.close(fig)


def add_box(ax, x, y, w, h, text, fc="#E8F5E9", ec="#2E7D32", fs=9):
    rect = patches.FancyBboxPatch(
        (x, y),
        w,
        h,
        boxstyle="round,pad=0.01,rounding_size=0.015",
        linewidth=1.4,
        edgecolor=ec,
        facecolor=fc,
    )
    ax.add_patch(rect)
    ax.text(x + w / 2, y + h / 2, text, ha="center", va="center", fontsize=fs, wrap=True)


def add_arrow(ax, x1, y1, x2, y2, text="", color="#37474F", fs=8):
    ax.annotate(
        "",
        xy=(x2, y2),
        xytext=(x1, y1),
        arrowprops=dict(arrowstyle="->", linewidth=1.3, color=color),
    )
    if text:
        mx = (x1 + x2) / 2
        my = (y1 + y2) / 2
        ax.text(mx, my + 0.015, text, ha="center", va="bottom", fontsize=fs, color=color)


def figure_2_1_dataset_samples() -> None:
    class_dirs = [d for d in sorted(DATASET_DIR.iterdir()) if d.is_dir()]
    sample_paths: List[Path] = []

    for class_dir in class_dirs:
        candidates = sorted(
            [p for p in class_dir.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png"}]
        )
        if candidates:
            sample_paths.append(candidates[0])
        if len(sample_paths) == 9:
            break

    if len(sample_paths) < 9:
        raise RuntimeError("Could not find at least 9 sample images in dataset.")

    fig, axes = plt.subplots(3, 3, figsize=(12, 10))
    fig.suptitle("Figure 2.1 - PlantVillage Dataset Sample Images", fontsize=15, fontweight="bold")

    for ax, img_path in zip(axes.flat, sample_paths):
        with Image.open(img_path) as img:
            arr = np.array(img.convert("RGB"))
        ax.imshow(arr)
        class_name = img_path.parent.name.replace("___", " - ").replace("_", " ")
        ax.set_title(class_name, fontsize=8)
        ax.axis("off")

    save_fig(fig, "Figure_2_1_PlantVillage_Dataset_Sample_Images.png")


def figure_3_1_high_level_architecture() -> None:
    fig, ax = plt.subplots(figsize=(13, 7))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")
    ax.set_title("Figure 3.1 - System High-Level Architecture", fontsize=15, fontweight="bold")

    add_box(ax, 0.05, 0.40, 0.16, 0.20, "User\n(Web / Mobile)", fc="#FFF3E0", ec="#EF6C00")
    add_box(ax, 0.29, 0.36, 0.20, 0.28, "Frontend\nReact + Vite\nDetection UI + Chat UI", fc="#E3F2FD", ec="#1565C0")
    add_box(ax, 0.55, 0.36, 0.20, 0.28, "Backend API\nFlask\n/api/predict\n/api/chat", fc="#E8F5E9", ec="#2E7D32")
    add_box(ax, 0.80, 0.55, 0.16, 0.20, "PyTorch CNN\nplant_model.pth", fc="#F3E5F5", ec="#6A1B9A")
    add_box(ax, 0.80, 0.25, 0.16, 0.20, "Google Gemini API\nRecommendations\nChat", fc="#FBE9E7", ec="#D84315")

    add_arrow(ax, 0.21, 0.50, 0.29, 0.50, "Uploads image / sends message")
    add_arrow(ax, 0.49, 0.50, 0.55, 0.50, "HTTP requests")
    add_arrow(ax, 0.75, 0.60, 0.80, 0.65, "Tensor input")
    add_arrow(ax, 0.80, 0.58, 0.75, 0.58, "Prediction logits")
    add_arrow(ax, 0.75, 0.40, 0.80, 0.35, "Prompt")
    add_arrow(ax, 0.80, 0.33, 0.75, 0.33, "Advice text")
    add_arrow(ax, 0.55, 0.44, 0.49, 0.44, "JSON response")
    add_arrow(ax, 0.29, 0.44, 0.21, 0.44, "Result + recommendation")

    save_fig(fig, "Figure_3_1_System_High_Level_Architecture.png")


def figure_3_2_dfd_level0() -> None:
    fig, ax = plt.subplots(figsize=(12, 7))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")
    ax.set_title("Figure 3.2 - Data Flow Diagram (DFD Level 0)", fontsize=15, fontweight="bold")

    add_box(ax, 0.05, 0.42, 0.16, 0.16, "External Entity\nUser", fc="#FFF8E1", ec="#F9A825")
    add_box(ax, 0.33, 0.32, 0.34, 0.36, "Process 0\nPlant Disease Prediction System", fc="#E8EAF6", ec="#3949AB", fs=11)
    add_box(ax, 0.77, 0.62, 0.18, 0.16, "Data Store\nModel Weights\nplant_model.pth", fc="#F1F8E9", ec="#558B2F")
    add_box(ax, 0.77, 0.22, 0.18, 0.16, "External Service\nGemini API", fc="#FCE4EC", ec="#AD1457")

    add_arrow(ax, 0.21, 0.54, 0.33, 0.56, "Leaf image / chat query")
    add_arrow(ax, 0.33, 0.44, 0.21, 0.44, "Prediction result / response")
    add_arrow(ax, 0.67, 0.62, 0.77, 0.70, "Load CNN model")
    add_arrow(ax, 0.67, 0.34, 0.77, 0.30, "Recommendation prompt")
    add_arrow(ax, 0.77, 0.24, 0.67, 0.28, "Generated advice")

    save_fig(fig, "Figure_3_2_DFD_Level_0.png")


def figure_3_3_dfd_level1() -> None:
    fig, ax = plt.subplots(figsize=(14, 8))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")
    ax.set_title("Figure 3.3 - Data Flow Diagram (DFD Level 1)", fontsize=15, fontweight="bold")

    add_box(ax, 0.03, 0.45, 0.13, 0.16, "User", fc="#FFF8E1", ec="#F9A825")

    add_box(ax, 0.20, 0.62, 0.20, 0.14, "1.0 Upload &\nValidate Input", fc="#E3F2FD", ec="#1565C0")
    add_box(ax, 0.44, 0.62, 0.20, 0.14, "2.0 Preprocess\n& Predict", fc="#E8F5E9", ec="#2E7D32")
    add_box(ax, 0.68, 0.62, 0.20, 0.14, "3.0 Generate\nRecommendation", fc="#F3E5F5", ec="#6A1B9A")

    add_box(ax, 0.20, 0.28, 0.20, 0.14, "4.0 Build\nResult JSON", fc="#FFF3E0", ec="#EF6C00")
    add_box(ax, 0.44, 0.28, 0.20, 0.14, "5.0 Chat\nResponse Flow", fc="#E0F7FA", ec="#00838F")

    add_box(ax, 0.88, 0.72, 0.10, 0.12, "D1\nCNN\nModel", fc="#F1F8E9", ec="#558B2F", fs=8)
    add_box(ax, 0.88, 0.54, 0.10, 0.12, "D2\nClass\nIndices", fc="#F1F8E9", ec="#558B2F", fs=8)
    add_box(ax, 0.88, 0.28, 0.10, 0.12, "E1\nGemini\nAPI", fc="#FCE4EC", ec="#AD1457", fs=8)

    add_arrow(ax, 0.16, 0.53, 0.20, 0.69, "Image / text")
    add_arrow(ax, 0.40, 0.69, 0.44, 0.69, "Tensor")
    add_arrow(ax, 0.64, 0.69, 0.68, 0.69, "Class + confidence")
    add_arrow(ax, 0.78, 0.62, 0.64, 0.35, "Advice text")
    add_arrow(ax, 0.40, 0.35, 0.16, 0.49, "Prediction response")

    add_arrow(ax, 0.54, 0.62, 0.88, 0.78, "Load")
    add_arrow(ax, 0.54, 0.62, 0.88, 0.60, "Lookup")
    add_arrow(ax, 0.78, 0.69, 0.88, 0.34, "Prompt")

    add_arrow(ax, 0.16, 0.49, 0.44, 0.35, "Chat query")
    add_arrow(ax, 0.64, 0.35, 0.16, 0.45, "Chat reply")
    add_arrow(ax, 0.64, 0.35, 0.88, 0.34, "LLM request")

    save_fig(fig, "Figure_3_3_DFD_Level_1.png")


def figure_3_4_erd() -> None:
    fig, ax = plt.subplots(figsize=(13, 8))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")
    ax.set_title("Figure 3.4 - Entity Relationship Diagram", fontsize=15, fontweight="bold")

    add_box(
        ax,
        0.07,
        0.62,
        0.24,
        0.26,
        "UserSession\n- session_id (PK)\n- started_at\n- client_type",
        fc="#E3F2FD",
        ec="#1565C0",
    )
    add_box(
        ax,
        0.38,
        0.62,
        0.24,
        0.26,
        "PredictionRequest\n- request_id (PK)\n- session_id (FK)\n- image_name\n- created_at",
        fc="#E8F5E9",
        ec="#2E7D32",
    )
    add_box(
        ax,
        0.69,
        0.62,
        0.24,
        0.26,
        "PredictionResult\n- result_id (PK)\n- request_id (FK)\n- class_name\n- confidence",
        fc="#FFF3E0",
        ec="#EF6C00",
    )
    add_box(
        ax,
        0.24,
        0.20,
        0.24,
        0.26,
        "ChatMessage\n- message_id (PK)\n- session_id (FK)\n- role\n- content",
        fc="#F3E5F5",
        ec="#6A1B9A",
    )
    add_box(
        ax,
        0.56,
        0.20,
        0.24,
        0.26,
        "Recommendation\n- rec_id (PK)\n- result_id (FK)\n- source (gemini/fallback)\n- text",
        fc="#E0F7FA",
        ec="#00838F",
    )

    add_arrow(ax, 0.31, 0.75, 0.38, 0.75, "1 to many")
    add_arrow(ax, 0.62, 0.75, 0.69, 0.75, "1 to 1")
    add_arrow(ax, 0.19, 0.62, 0.30, 0.46, "1 to many")
    add_arrow(ax, 0.81, 0.62, 0.68, 0.46, "1 to 1")

    save_fig(fig, "Figure_3_4_Entity_Relationship_Diagram.png")


def figure_3_5_use_case() -> None:
    fig, ax = plt.subplots(figsize=(13, 8))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")
    ax.set_title("Figure 3.5 - Use Case Diagram", fontsize=15, fontweight="bold")

    actor = patches.Circle((0.12, 0.52), 0.05, facecolor="#FFF8E1", edgecolor="#F9A825", linewidth=1.6)
    ax.add_patch(actor)
    ax.text(0.12, 0.42, "User", ha="center", fontsize=10, fontweight="bold")

    system = patches.FancyBboxPatch(
        (0.28, 0.15),
        0.66,
        0.70,
        boxstyle="round,pad=0.02,rounding_size=0.02",
        facecolor="#FAFAFA",
        edgecolor="#9E9E9E",
        linewidth=1.2,
    )
    ax.add_patch(system)
    ax.text(0.61, 0.82, "Plant Disease Prediction System", ha="center", fontsize=11, fontweight="bold")

    use_cases: List[Tuple[float, float, str]] = [
        (0.42, 0.70, "Upload Leaf Image"),
        (0.66, 0.70, "Capture Photo"),
        (0.42, 0.56, "Get Disease Prediction"),
        (0.66, 0.56, "View Confidence Score"),
        (0.42, 0.42, "Get Treatment\nRecommendation"),
        (0.66, 0.42, "Ask Chatbot"),
        (0.54, 0.28, "Receive Plant-Care Advice"),
    ]

    for x, y, label in use_cases:
        ellipse = patches.Ellipse((x, y), 0.24, 0.10, facecolor="#E3F2FD", edgecolor="#1565C0", linewidth=1.3)
        ax.add_patch(ellipse)
        ax.text(x, y, label, ha="center", va="center", fontsize=9)
        ax.plot([0.17, x - 0.12], [0.52, y], color="#455A64", linewidth=1.0)

    save_fig(fig, "Figure_3_5_Use_Case_Diagram.png")


def sequence_diagram(title: str, participants: List[str], messages: List[Tuple[str, str, str]], filename: str) -> None:
    fig, ax = plt.subplots(figsize=(15, 9))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")
    ax.set_title(title, fontsize=15, fontweight="bold")

    xs = np.linspace(0.12, 0.88, len(participants))
    pos = {name: x for name, x in zip(participants, xs)}

    for name, x in pos.items():
        add_box(ax, x - 0.08, 0.90, 0.16, 0.06, name, fc="#ECEFF1", ec="#455A64", fs=9)
        ax.plot([x, x], [0.12, 0.90], linestyle="--", color="#90A4AE", linewidth=1.0)

    y = 0.84
    step = 0.065
    for src, dst, label in messages:
        x1 = pos[src]
        x2 = pos[dst]
        ax.annotate(
            "",
            xy=(x2, y),
            xytext=(x1, y),
            arrowprops=dict(arrowstyle="->", linewidth=1.2, color="#263238"),
        )
        ax.text((x1 + x2) / 2, y + 0.012, label, ha="center", va="bottom", fontsize=8)
        y -= step

    save_fig(fig, filename)


def figure_3_6_sequence_prediction() -> None:
    participants = ["User", "Frontend", "Backend API", "CNN Model", "Gemini API"]
    messages = [
        ("User", "Frontend", "1. Upload image"),
        ("Frontend", "Backend API", "2. POST /api/predict (multipart)"),
        ("Backend API", "CNN Model", "3. preprocess + inference"),
        ("CNN Model", "Backend API", "4. class + confidence"),
        ("Backend API", "Gemini API", "5. generate recommendation"),
        ("Gemini API", "Backend API", "6. treatment text"),
        ("Backend API", "Frontend", "7. JSON prediction + advice"),
        ("Frontend", "User", "8. render result"),
    ]
    sequence_diagram(
        "Figure 3.6 - Sequence Diagram: Prediction Flow",
        participants,
        messages,
        "Figure_3_6_Sequence_Diagram_Prediction_Flow.png",
    )


def figure_3_7_sequence_chatbot() -> None:
    participants = ["User", "Frontend", "Backend API", "Gemini API"]
    messages = [
        ("User", "Frontend", "1. Type message"),
        ("Frontend", "Backend API", "2. POST /api/chat"),
        ("Backend API", "Gemini API", "3. send prompt + history"),
        ("Gemini API", "Backend API", "4. assistant response"),
        ("Backend API", "Frontend", "5. JSON {response}"),
        ("Frontend", "User", "6. show chatbot answer"),
    ]
    sequence_diagram(
        "Figure 3.7 - Sequence Diagram: Chatbot Flow",
        participants,
        messages,
        "Figure_3_7_Sequence_Diagram_Chatbot_Flow.png",
    )


def figure_4_1_cnn_architecture() -> None:
    fig, ax = plt.subplots(figsize=(15, 7))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")
    ax.set_title("Figure 4.1 - PlantDiseaseCNN Architecture", fontsize=15, fontweight="bold")

    blocks = [
        (0.03, "Input\n3 x 224 x 224", "#E3F2FD", "#1565C0"),
        (0.16, "Conv2d\n3->32, k=3\nReLU + MaxPool2d", "#E8F5E9", "#2E7D32"),
        (0.31, "Conv2d\n32->64, k=3\nReLU + MaxPool2d", "#E8F5E9", "#2E7D32"),
        (0.46, "Conv2d\n64->128, k=3\nReLU + MaxPool2d", "#E8F5E9", "#2E7D32"),
        (0.61, "Flatten\n128 x 28 x 28", "#FFF3E0", "#EF6C00"),
        (0.74, "Linear\n100352->128\nReLU + Dropout(0.3)", "#F3E5F5", "#6A1B9A"),
        (0.88, "Output\nLinear 128->38\nClass logits", "#FCE4EC", "#AD1457"),
    ]

    y = 0.40
    w = 0.11
    h = 0.22
    for i, (x, label, fc, ec) in enumerate(blocks):
        add_box(ax, x, y, w, h, label, fc=fc, ec=ec, fs=8)
        if i < len(blocks) - 1:
            add_arrow(ax, x + w, y + h / 2, blocks[i + 1][0], y + h / 2)

    ax.text(0.50, 0.26, "Feature extractor", ha="center", fontsize=10, color="#2E7D32", fontweight="bold")
    ax.text(0.75, 0.26, "Classifier", ha="center", fontsize=10, color="#6A1B9A", fontweight="bold")

    save_fig(fig, "Figure_4_1_PlantDiseaseCNN_Architecture.png")


def main() -> None:
    ensure_out_dir()
    figure_2_1_dataset_samples()
    figure_3_1_high_level_architecture()
    figure_3_2_dfd_level0()
    figure_3_3_dfd_level1()
    figure_3_4_erd()
    figure_3_5_use_case()
    figure_3_6_sequence_prediction()
    figure_3_7_sequence_chatbot()
    figure_4_1_cnn_architecture()
    print(f"Generated 9 figures in: {OUT_DIR}")


if __name__ == "__main__":
    main()

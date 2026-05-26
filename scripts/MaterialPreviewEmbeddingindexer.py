# ============================================
# Material Preview Embedding Indexer
# ============================================
#
# 기능:
# - materials 폴더 스캔
# - preview 이미지 자동 탐색
# - CLIP embedding 생성
# - auto tag prediction
# - material.json 자동 업데이트
#
# 설치:
# pip install torch torchvision transformers pillow
#
# 실행:
# python material_indexer.py
#
# ============================================

import json
from pathlib import Path

import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel


# ============================================
# CONFIG
# ============================================

MATERIALS_DIR = Path(
    r"C:\Users\ggabu\graphics-lab-v2\public\materials"
)

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

TOP_K_TAGS = 5


# ============================================
# LOAD MODEL
# ============================================

print("Loading CLIP model...")

model = CLIPModel.from_pretrained(
    "openai/clip-vit-base-patch32"
).to(DEVICE)

processor = CLIPProcessor.from_pretrained(
    "openai/clip-vit-base-patch32"
)

print(f"Using device: {DEVICE}")


# ============================================
# TAG CANDIDATES
# ============================================

TAG_CANDIDATES = [
    "rock material",
    "stone material",
    "granite material",
    "sand material",
    "desert sand material",
    "concrete material",
    "cement material",
    "metal material",
    "rusty metal material",
    "steel material",
    "gold material",
    "wood material",
    "oak wood material",
    "fabric material",
    "cloth material",
    "plastic material",
    "rubber material",
    "glass material",
    "marble material",
    "brick material",
    "mud material",
    "snow material",
    "ice material",
    "lava material",
    "volcanic rock material",
    "wet rock material",
    "rough material",
    "smooth material",
    "shiny material",
    "dark material",
    "gray material",
    "brown material",
    "white material",
]


# ============================================
# FIND PREVIEW IMAGE
# ============================================

def find_preview_image(material_dir: Path):

    image_extensions = [".png", ".jpg", ".jpeg", ".webp"]

    for file in material_dir.iterdir():

        if not file.is_file():
            continue

        filename = file.name.lower()

        if "preview" not in filename:
            continue

        if file.suffix.lower() not in image_extensions:
            continue

        return file

    return None


# ============================================
# GENERATE EMBEDDING
# ============================================

@torch.no_grad()
def generate_embedding(image_path: Path):

    image = Image.open(image_path).convert("RGB")

    inputs = processor(
        images=image,
        return_tensors="pt"
    ).to(DEVICE)

    outputs = model.vision_model(
        pixel_values=inputs["pixel_values"]
    )

    image_features = outputs.pooler_output

    # normalize embedding
    image_features = image_features / torch.norm(
        image_features,
        dim=-1,
        keepdim=True
    )

    embedding = image_features[0].cpu().tolist()

    return embedding


# ============================================
# PREDICT TAGS
# ============================================

@torch.no_grad()
def predict_tags(image_path: Path):

    image = Image.open(image_path).convert("RGB")

    inputs = processor(
        text=TAG_CANDIDATES,
        images=image,
        return_tensors="pt",
        padding=True
    ).to(DEVICE)

    outputs = model(**inputs)

    logits = outputs.logits_per_image
    probs = logits.softmax(dim=1)[0]

    top_indices = probs.topk(TOP_K_TAGS).indices.tolist()

    tags = []

    for idx in top_indices:

        label = TAG_CANDIDATES[idx]

        label = label.replace(" material", "")

        tags.append(label)

    return tags


# ============================================
# UPDATE material.json
# ============================================

def update_material_json(
    material_dir: Path,
    embedding,
    tags,
    preview_file: str
):

    material_json_path = material_dir / "material.json"

    data = {}

    if material_json_path.exists():

        try:

            with open(
                material_json_path,
                "r",
                encoding="utf-8"
            ) as f:

                data = json.load(f)

        except Exception as e:

            print("JSON READ ERROR:", e)

            data = {}

    data["previewImage"] = preview_file
    data["aiTags"] = tags
    data["embedding"] = embedding

    with open(
        material_json_path,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            data,
            f,
            indent=2,
            ensure_ascii=False
        )


# ============================================
# MAIN
# ============================================

def main():

    material_dirs = [
        d for d in MATERIALS_DIR.iterdir()
        if d.is_dir() and not d.name.startswith(".")
    ]

    print(f"Found {len(material_dirs)} material folders")
    print()

    for material_dir in material_dirs:

        print("=" * 50)
        print(f"Processing: {material_dir.name}")

        preview_image = find_preview_image(material_dir)

        if not preview_image:

            print("No preview image found")
            continue

        print(f"Preview: {preview_image.name}")

        try:

            print("Generating embedding...")

            embedding = generate_embedding(
                preview_image
            )

            print("Predicting tags...")

            tags = predict_tags(
                preview_image
            )

            print("Updating material.json...")

            update_material_json(
                material_dir,
                embedding,
                tags,
                preview_image.name
            )

            print()
            print("Tags:", tags)

            print(
                f"Embedding dimension: {len(embedding)}"
            )

            print("material.json updated")

        except Exception as e:

            import traceback

            traceback.print_exc()

    print()
    print("DONE")


# ============================================
# ENTRY
# ============================================

if __name__ == "__main__":
    main()
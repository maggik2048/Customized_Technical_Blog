import bpy

# =========================================================
# SVG CURVE → EXTRUDE → MESH AUTOMATION
# =========================================================
#
# 대상:
# 씬 안에 존재하는 모든 SVG Curve Object
#
# 기능:
# - SVG curve 탐색
# - 2D fill 활성화
# - extrude 적용
# - bevel 제거
# - mesh 변환
#
# Blender:
# Scripting 탭 → New
# → paste
# → Run Script
#
# =========================================================

# =========================
# SETTINGS
# =========================

EXTRUDE_AMOUNT = 2.0
CONVERT_TO_MESH = True

# =========================
# PROCESS ALL OBJECTS
# =========================

processed = 0

for obj in bpy.data.objects:

    # =====================================
    # ONLY CURVES
    # =====================================

    if obj.type != 'CURVE':
        continue

    print(f"Processing Curve: {obj.name}")

    curve = obj.data

    # =====================================
    # FORCE 2D
    # =====================================

    curve.dimensions = '2D'

    # =====================================
    # FILL
    # =====================================

    curve.fill_mode = 'BOTH'

    # =====================================
    # REMOVE BEVEL
    # =====================================

    curve.bevel_depth = 0

    # =====================================
    # EXTRUDE
    # =====================================

    curve.extrude = EXTRUDE_AMOUNT

    # =====================================
    # OPTIONAL:
    # CONVERT TO MESH
    # =====================================

    if CONVERT_TO_MESH:

        bpy.ops.object.select_all(
            action='DESELECT'
        )

        obj.select_set(True)

        bpy.context.view_layer.objects.active = obj

        bpy.ops.object.convert(
            target='MESH'
        )

    processed += 1

# =========================
# DONE
# =========================

print(
    f"DONE: Processed {processed} SVG objects"
)
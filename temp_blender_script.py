
import bpy

print("START BLENDER SCRIPT")

# =========================
# CREATE OBJECT
# =========================

if bpy.context.active_object is None:

    bpy.ops.mesh.primitive_uv_sphere_add()

    obj = bpy.context.active_object

else:

    obj = bpy.context.active_object

# =========================
# CREATE MATERIAL
# =========================

mat = bpy.data.materials.new(
    name="AutoMaterial"
)

mat.use_nodes = True

nodes = mat.node_tree.nodes

links = mat.node_tree.links

# =========================
# CLEAN DEFAULT NODES
# =========================

for node in list(nodes):

    if node.type != 'OUTPUT_MATERIAL':

        nodes.remove(node)

output = None

for n in nodes:

    if n.type == 'OUTPUT_MATERIAL':

        output = n

        break

# =========================
# BSDF
# =========================

bsdf = nodes.new(
    "ShaderNodeBsdfPrincipled"
)

bsdf.location = (0, 0)

links.new(
    bsdf.outputs["BSDF"],
    output.inputs["Surface"]
)

# =========================
# HELPERS
# =========================

def create_tex(
    path,
    x,
    y,
    non_color=False
):

    tex = nodes.new(
        "ShaderNodeTexImage"
    )

    tex.image =
        bpy.data.images.load(path)

    tex.location = (x, y)

    if non_color:

        tex.image
            .colorspace_settings
            .name = 'Non-Color'

    return tex

# =========================
# BASE COLOR
# =========================


base = create_tex(
    r"C:\Users\ggabu\graphics-lab-v2\public\materials\material_1779797914565\leaking012c_albedo.jpg",
    -800,
    300
)

links.new(
    base.outputs["Color"],
    bsdf.inputs["Base Color"]
)


# =========================
# ROUGHNESS
# =========================


rough = create_tex(
    r"C:\Users\ggabu\graphics-lab-v2\public\materials\material_1779797914565\leaking012c_roughness.jpg",
    -800,
    50,
    True
)

links.new(
    rough.outputs["Color"],
    bsdf.inputs["Roughness"]
)


# =========================
# METALLIC
# =========================


metal = create_tex(
    r"C:\Users\ggabu\graphics-lab-v2\public\materials\material_1779797914565\leaking012c_metallic.jpg",
    -800,
    -150,
    True
)

links.new(
    metal.outputs["Color"],
    bsdf.inputs["Metallic"]
)


# =========================
# NORMAL
# =========================


normal_tex = create_tex(
    r"C:\Users\ggabu\graphics-lab-v2\public\materials\material_1779797914565\leaking012c_normal.jpg",
    -800,
    -400,
    True
)

normal_map = nodes.new(
    "ShaderNodeNormalMap"
)

normal_map.location =
    (-350, -400)

links.new(
    normal_tex.outputs["Color"],
    normal_map.inputs["Color"]
)

links.new(
    normal_map.outputs["Normal"],
    bsdf.inputs["Normal"]
)


# =========================
# AO
# =========================



# =========================
# HEIGHT
# =========================


height_tex = create_tex(
    r"C:\Users\ggabu\graphics-lab-v2\public\materials\material_1779797914565\leaking012c_displacement.jpg",
    -800,
    -650,
    True
)

displacement =
    nodes.new(
        "ShaderNodeDisplacement"
    )

displacement.location =
    (-300, -650)

links.new(
    height_tex.outputs["Color"],
    displacement.inputs["Height"]
)

links.new(
    displacement.outputs[
        "Displacement"
    ],
    output.inputs[
        "Displacement"
    ]
)


# =========================
# APPLY MATERIAL
# =========================

if len(obj.data.materials) == 0:

    obj.data.materials.append(mat)

else:

    obj.data.materials[0] = mat

print("MATERIAL IMPORT COMPLETE")

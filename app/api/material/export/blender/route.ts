import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

import fs from 'fs';
import path from 'path';

import { spawn } from 'child_process';

export async function POST(req: NextRequest) {
  try {

    console.log('========================');
    console.log('BLENDER EXPORT REQUEST');
    console.log('========================');

    // =========================
    // BODY
    // =========================

    const body = await req.json();

    const materialFolder =
      body.materialFolder;

    console.log(
      'MATERIAL FOLDER:',
      materialFolder
    );

    if (!materialFolder) {
      return NextResponse.json(
        {
          success: false,
          error:
            'materialFolder missing',
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // ABSOLUTE FOLDER
    // =========================

    const absFolder = path.join(
      process.cwd(),
      'public',
      materialFolder
    );

    console.log(
      'ABSOLUTE FOLDER:',
      absFolder
    );

    if (!fs.existsSync(absFolder)) {
      return NextResponse.json(
        {
          success: false,

          error:
            'Folder not found',

          absFolder,
        },
        {
          status: 404,
        }
      );
    }

    // =========================
    // FILES
    // =========================

    const files =
      fs.readdirSync(absFolder);

    console.log('FILES:', files);

    // =========================
    // TEXTURE DETECTION
    // =========================

    const textures:
      Record<string, string> = {};

    for (const file of files) {

      const lower =
        file.toLowerCase();

      const fullPath =
        path.join(absFolder, file);

      // BASE COLOR

      if (
        lower.includes('basecolor') ||
        lower.includes('albedo') ||
        lower.includes('diffuse')
      ) {
        textures.baseColor =
          fullPath;
      }

      // NORMAL

      else if (
        lower.includes('normal') ||
        lower.includes('_nor') ||
        lower.includes('nrm')
      ) {
        textures.normal =
          fullPath;
      }

      // ROUGHNESS

      else if (
        lower.includes('roughness') ||
        lower.includes('rough')
      ) {
        textures.roughness =
          fullPath;
      }

      // METALLIC

      else if (
        lower.includes('metallic') ||
        lower.includes('metal')
      ) {
        textures.metallic =
          fullPath;
      }

      // AO

      else if (
        lower.includes('ao') ||
        lower.includes(
          'ambientocclusion'
        )
      ) {
        textures.ao =
          fullPath;
      }

      // HEIGHT

      else if (
        lower.includes('height') ||
        lower.includes(
          'displacement'
        ) ||
        lower.includes('disp')
      ) {
        textures.height =
          fullPath;
      }
    }

    console.log(
      'DETECTED TEXTURES:',
      textures
    );

    // =========================
    // BLENDER PYTHON SCRIPT
    // =========================

    const blenderScript =
      generateBlenderScript(
        textures
      );

    const scriptPath = path.join(
      process.cwd(),
      'temp_blender_script.py'
    );

    fs.writeFileSync(
      scriptPath,
      blenderScript
    );

    console.log(
      'SCRIPT PATH:',
      scriptPath
    );

    // =========================
    // BLENDER PATH
    // =========================

    const blenderPath =
      'C:/Program Files/Blender Foundation/Blender 4.5/blender.exe';

    console.log(
      'BLENDER PATH:',
      blenderPath
    );

    console.log(
      'BLENDER EXISTS:',
      fs.existsSync(blenderPath)
    );

    if (
      !fs.existsSync(blenderPath)
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            'Blender executable not found',

          blenderPath,
        },
        {
          status: 500,
        }
      );
    }

    // =========================
    // SPAWN BLENDER
    // =========================

    console.log(
      'STARTING BLENDER PROCESS...'
    );

    const blender = spawn(
      blenderPath,
      [
        '--factory-startup',

        '--python',

        scriptPath,
      ],
      {
        detached: true,

        stdio: 'ignore',
      }
    );

    blender.on(
      'error',
      (err) => {

        console.error(
          'SPAWN ERROR:',
          err
        );
      }
    );

    blender.unref();

    console.log(
      'BLENDER SPAWNED'
    );

    // =========================
    // RESPONSE
    // =========================

    return NextResponse.json({
      success: true,

      message:
        'Blender launched',

      textures,
    });
  }

  catch (err: any) {

    console.error(
      '========================'
    );

    console.error(
      'ROUTE ERROR'
    );

    console.error(
      '========================'
    );

    console.error(err);

    return NextResponse.json(
      {
        success: false,

        error: String(err),

        stack:
          err?.stack || null,
      },
      {
        status: 500,
      }
    );
  }
}

function generateBlenderScript(
  textures:
    Record<string, string>
) {

  return `
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

${
  textures.baseColor
    ? `
base = create_tex(
    r"${textures.baseColor}",
    -800,
    300
)

links.new(
    base.outputs["Color"],
    bsdf.inputs["Base Color"]
)
`
    : ''
}

# =========================
# ROUGHNESS
# =========================

${
  textures.roughness
    ? `
rough = create_tex(
    r"${textures.roughness}",
    -800,
    50,
    True
)

links.new(
    rough.outputs["Color"],
    bsdf.inputs["Roughness"]
)
`
    : ''
}

# =========================
# METALLIC
# =========================

${
  textures.metallic
    ? `
metal = create_tex(
    r"${textures.metallic}",
    -800,
    -150,
    True
)

links.new(
    metal.outputs["Color"],
    bsdf.inputs["Metallic"]
)
`
    : ''
}

# =========================
# NORMAL
# =========================

${
  textures.normal
    ? `
normal_tex = create_tex(
    r"${textures.normal}",
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
`
    : ''
}

# =========================
# AO
# =========================

${
  textures.ao &&
  textures.baseColor
    ? `
ao_tex = create_tex(
    r"${textures.ao}",
    -1200,
    450,
    True
)

mix_node = nodes.new(
    "ShaderNodeMixRGB"
)

mix_node.blend_type =
    'MULTIPLY'

mix_node.inputs[0]
    .default_value = 1.0

mix_node.location =
    (-400, 300)

links.new(
    base.outputs["Color"],
    mix_node.inputs[1]
)

links.new(
    ao_tex.outputs["Color"],
    mix_node.inputs[2]
)

links.new(
    mix_node.outputs["Color"],
    bsdf.inputs["Base Color"]
)
`
    : ''
}

# =========================
# HEIGHT
# =========================

${
  textures.height
    ? `
height_tex = create_tex(
    r"${textures.height}",
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
`
    : ''
}

# =========================
# APPLY MATERIAL
# =========================

if len(obj.data.materials) == 0:

    obj.data.materials.append(mat)

else:

    obj.data.materials[0] = mat

print("MATERIAL IMPORT COMPLETE")
`;
}
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    //
    // MATERIAL ID
    //
    const materialId = `material_${Date.now()}`;

    //
    // TARGET DIRECTORY
    //
    const materialDir = path.join(
      process.cwd(),
      'public',
      'materials',
      materialId
    );

    fs.mkdirSync(materialDir, { recursive: true });

    //
    // DESCRIPTOR (STRUCTURED FIX)
    //
    const descriptor: {
      asset: string;
      textures: Record<string, string>;
      preview?: string;
    } = {
      asset: '',
      textures: {},
    };

    //
    // SAVE FILES
    //
    for (const [key, value] of formData.entries()) {
      if (!(value instanceof Blob)) continue;

      const file = value as File;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      //
      // filename (FRONT 그대로 유지)
      //
      const filename = file.name;

      const filepath = path.join(materialDir, filename);

      fs.writeFileSync(filepath, buffer);

      const url = `/materials/${materialId}/${filename}`;

      //
      // asset name (fallback safe)
      //
      const assetMatch = filename.match(/^([a-zA-Z0-9]+)/i);
      const assetName = assetMatch
        ? assetMatch[1].toLowerCase()
        : 'asset';

      descriptor.asset = assetName;

      //
      // preview 분리 저장
      //
      if (key === 'preview') {
        descriptor.preview = url;
      } else {
        descriptor.textures[key] = url;
      }
    }

    //
    // WRITE MATERIAL.JSON
    //
    fs.writeFileSync(
      path.join(materialDir, 'material.json'),
      JSON.stringify(descriptor, null, 2)
    );

    console.log('MATERIAL REGISTERED', materialId);

    return Response.json({
      success: true,
      materialId,
      descriptor,
    });
  } catch (err) {
    console.error(err);

    return Response.json(
      { success: false },
      { status: 500 }
    );
  }
}
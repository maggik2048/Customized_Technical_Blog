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
    // DESCRIPTOR (asset 기반 구조)
    //
    const descriptor: Record<string, string> = {};

    //
    // SAVE FILES
    //
    for (const [key, value] of formData.entries()) {

      if (!(value instanceof File)) {
        continue;
      }

      const bytes = await value.arrayBuffer();
      const buffer = Buffer.from(bytes);

      //
      // extension
      //
      const extension = value.name.split('.').pop();

      //
      //  FIX: 프론트에서 만든 이름 그대로 사용
      //
      const filename = value.name;

      const filepath = path.join(materialDir, filename);

      fs.writeFileSync(filepath, buffer);

      //
      // descriptor도 asset name 기준으로 저장
      //
      const assetMatch = filename.match(/^([a-zA-Z0-9]+)/i);
      const assetName = assetMatch ? assetMatch[1].toLowerCase() : 'asset';

      descriptor[`${key}`] = `/materials/${materialId}/${filename}`;
      descriptor[`asset`] = assetName;
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
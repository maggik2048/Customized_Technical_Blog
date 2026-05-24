import { NextRequest } from 'next/server';

import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {

    const formData = await request.formData();

    const file = formData.get('model') as File;

    if (!file) {
      return Response.json(
        { success: false, error: 'NO FILE' },
        { status: 400 }
      );
    }

    //
    // MODEL ID
    //
    const modelId = `model_${Date.now()}`;

    //
    // TARGET DIR
    //
    const modelDir = path.join(
      process.cwd(),
      'public',
      'models',
      modelId
    );

    fs.mkdirSync(modelDir, { recursive: true });

    //
    // SAVE MODEL
    //
    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const filename = file.name;

    const filepath = path.join(modelDir, filename);

    fs.writeFileSync(filepath, buffer);

    //
    // MODEL NAME
    //
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');

    //
    // DESCRIPTOR
    //
    const descriptor = {
      modelId,
      modelName: nameWithoutExt,
      modelUrl: `/models/${modelId}/${filename}`,
    };

    //
    // WRITE JSON
    //
    fs.writeFileSync(
      path.join(modelDir, 'model.json'),
      JSON.stringify(descriptor, null, 2)
    );

    console.log('MODEL REGISTERED', modelId);

    return Response.json({
      success: true,
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
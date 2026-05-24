import { NextRequest } from 'next/server';

import fs from 'fs';
import path from 'path';

export async function POST(
  request: NextRequest
) {

  try {

    const formData =
      await request.formData();

    //
    // MODEL FILE
    //
    const model =
      formData.get('model') as File;

    //
    // PREVIEW FILE
    //
    const preview =
      formData.get('preview') as File;

    if (!model) {

      return Response.json(
        {
          success: false,
          error: 'NO MODEL',
        },
        { status: 400 }
      );
    }

    //
    // MODEL ID
    //
    const modelId =
      `model_${Date.now()}`;

    //
    // TARGET DIR
    //
    const modelDir =
      path.join(
        process.cwd(),
        'public',
        'models',
        modelId
      );

    fs.mkdirSync(
      modelDir,
      { recursive: true }
    );

    //
    // SAVE MODEL
    //
    const modelBytes =
      await model.arrayBuffer();

    fs.writeFileSync(

      path.join(
        modelDir,
        model.name
      ),

      Buffer.from(modelBytes)
    );

    //
    // SAVE PREVIEW
    //
    let previewUrl = '';

    if (preview) {

      const previewBytes =
        await preview.arrayBuffer();

      const previewName =
        'preview.png';

      fs.writeFileSync(

        path.join(
          modelDir,
          previewName
        ),

        Buffer.from(previewBytes)
      );

      previewUrl =
        `/models/${modelId}/${previewName}`;
    }

    //
    // NAME
    //
    const modelName =
      model.name.replace(
        /\.[^/.]+$/,
        ''
      );

    //
    // DESCRIPTOR
    //
    const descriptor = {

      modelId,

      modelName,

      modelUrl:
        `/models/${modelId}/${model.name}`,

      previewUrl,

    };

    //
    // WRITE JSON
    //
    fs.writeFileSync(

      path.join(
        modelDir,
        'model.json'
      ),

      JSON.stringify(
        descriptor,
        null,
        2
      )
    );

    console.log(
      'MODEL REGISTERED',
      modelId
    );

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
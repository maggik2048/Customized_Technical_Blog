import { NextRequest }
from 'next/server';

import fs from 'fs';

import path from 'path';

export async function POST(
  request: NextRequest
) {

  try {

    const formData =
      await request.formData();

    //
    // MATERIAL ID
    //

    const materialId =
      `material_${Date.now()}`;

    //
    // TARGET DIRECTORY
    //

    const materialDir =
      path.join(
        process.cwd(),

        'public',

        'materials',

        materialId
      );

    //
    // CREATE DIRECTORY
    //

    fs.mkdirSync(
      materialDir,
      {
        recursive: true,
      }
    );

    //
    // DESCRIPTOR
    //

    const descriptor:
      Record<string, string>
        = {};

    //
    // SAVE FILES
    //

    for (
      const [key, value]
      of formData.entries()
    ) {

      if (
        !(value instanceof File)
      ) {
        continue;
      }

      const bytes =
        await value.arrayBuffer();

      const buffer =
        Buffer.from(bytes);

      //
      // EXTENSION
      //

      const extension =
        value.name
          .split('.')
          .pop();

      //
      // OUTPUT FILENAME
      //

      const filename =
        `${key}.${extension}`;

      //
      // OUTPUT PATH
      //

      const filepath =
        path.join(
          materialDir,
          filename
        );

      //
      // WRITE FILE
      //

      fs.writeFileSync(
        filepath,
        buffer
      );

      //
      // DESCRIPTOR ENTRY
      //

      descriptor[key] =
        `/materials/${materialId}/${filename}`;
    }

    //
    // WRITE MATERIAL.JSON
    //

    fs.writeFileSync(

      path.join(
        materialDir,
        'material.json'
      ),

      JSON.stringify(
        descriptor,
        null,
        2
      )
    );

    console.log(
      'MATERIAL REGISTERED',
      materialId
    );

    return Response.json({
      success: true,

      materialId,

      descriptor,
    });

  } catch (err) {

    console.error(err);

    return Response.json(
      {
        success: false,
      },

      {
        status: 500,
      }
    );
  }
}
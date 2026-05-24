import fs from 'fs';
import path from 'path';

export async function GET() {

  const dir = path.join(
    process.cwd(),
    'public',
    'models'
  );

  if (!fs.existsSync(dir)) {
    return Response.json([]);
  }

  const folders = fs.readdirSync(dir, {
    withFileTypes: true,
  })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const result: any[] = [];

  for (const folder of folders) {

    const folderPath = path.join(dir, folder);

    const jsonPath = path.join(
      folderPath,
      'model.json'
    );

    if (!fs.existsSync(jsonPath)) {
      continue;
    }

    const json = JSON.parse(
      fs.readFileSync(jsonPath, 'utf-8')
    );

    result.push({
      modelId: json.modelId,
      modelName: json.modelName,

      //
      // preview fallback
      //
      previewUrl:
        '/default_model_preview.png',
    });
  }

  return Response.json(result);
}
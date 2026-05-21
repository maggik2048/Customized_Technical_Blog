import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {

  const dir = path.join(process.cwd(), 'public', 'materials');

  const folders = fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const result: any[] = [];

  for (const folder of folders) {

    const folderPath = path.join(dir, folder);

    const files = fs.readdirSync(folderPath);

    const preview = files.find(f => f.includes('_preview'));

    if (!preview) continue;

    const assetMatch = preview.match(/^([a-zA-Z0-9]+)/i);
    const assetName = assetMatch ? assetMatch[1] : folder;

    result.push({
      materialId: folder,
      assetName,
      previewUrl: `/materials/${folder}/${preview}`,
    });
  }

  return Response.json(result);
}
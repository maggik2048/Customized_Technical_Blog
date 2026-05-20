import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE() {
  try {
    console.log('MATERIAL DELETE START');

    const materialsRoot = path.join(
      process.cwd(),
      'public',
      'materials'
    );

    // materials 폴더 없으면 성공 처리
    if (!fs.existsSync(materialsRoot)) {
      return NextResponse.json({
        success: true,
        message: 'No materials folder exists',
      });
    }

    const entries = fs.readdirSync(materialsRoot);

    // 모든 material_* 폴더 삭제
    for (const entry of entries) {
      const targetPath = path.join(materialsRoot, entry);

      fs.rmSync(targetPath, {
        recursive: true,
        force: true,
      });
    }

    console.log('MATERIAL DELETE DONE');

    return NextResponse.json({
      success: true,
      deletedCount: entries.length,
    });

  } catch (err) {
    console.error('MATERIAL DELETE ERROR:', err);

    return NextResponse.json(
      {
        success: false,
        error: String(err),
      },
      { status: 500 }
    );
  }
}
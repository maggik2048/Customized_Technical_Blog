// app/api/save-screenshot/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('screenshot') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // 파일명 생성 (한글 깨짐 방지)
    const originalName = file.name;
    const filename = originalName || `currentpage_${Date.now()}.png`;
    
    // public/CurrentPage 폴더 경로
    const publicDir = path.join(process.cwd(), 'public', 'CurrentPage');
    
    // 폴더가 없으면 생성
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true });
    }

    // 파일 저장 경로
    const filePath = path.join(publicDir, filename);
    
    // 파일 데이터를 Buffer로 변환
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 파일 저장
    await writeFile(filePath, buffer);

    // 저장된 경로 반환
    const savedPath = `/CurrentPage/${filename}`;
    
    console.log(`✅ Screenshot saved: ${filePath}`);
    console.log(`🔗 Access at: ${savedPath}`);

    return NextResponse.json({
      success: true,
      path: savedPath,
      filename: filename,
      fullPath: filePath,
    });
  } catch (error) {
    console.error('❌ Error saving screenshot:', error);
    return NextResponse.json(
      { error: 'Failed to save screenshot' },
      { status: 500 }
    );
  }
}
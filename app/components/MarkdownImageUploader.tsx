// MarkdownImageUploader.tsx
"use client";

import React from "react";
import { supabase } from "@/lib/supabase";

// PNG → JPG 변환
async function convertImageToJpg(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context not available");
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject("Conversion failed");
        },
        "image/jpeg",
        0.8
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export default function MarkdownImageUploader({
  content,
  setContent,
}: {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}) {
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // 1️ 일반 파일 이미지 처리 (PNG/JPG)
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (!file) continue;

        const uploadFile =
          file.type === "image/png" ? await convertImageToJpg(file) : file;
        const fileName = `${Date.now()}.jpg`;

        const { error } = await supabase.storage
          .from("post-images")
          .upload(fileName, uploadFile);

        if (error) return console.error(error);

        const url = supabase.storage
          .from("post-images")
          .getPublicUrl(fileName).data.publicUrl;

        setContent((prev) => `${prev}\n![이미지](${url})\n`);
      }

      // 2️ Snip & Sketch 등에서 붙여넣는 HTML 이미지 처리
      else if (item.kind === "string" && item.type === "text/html") {
        item.getAsString(async (html) => {
          const match = html.match(
            /src="data:image\/(\w+);base64,([^"]+)"/
          );
          if (!match) return;

          const base64Type = match[1];
          const data = match[2];

          // Blob 생성
          const blob = await (
            await fetch(`data:image/${base64Type};base64,${data}`)
          ).blob();

          // PNG이면 JPG로 변환
          const uploadFile =
            base64Type === "png" ? await convertImageToJpg(blob as unknown as File) : blob;

          const fileName = `${Date.now()}.jpg`;
          const { error } = await supabase.storage
            .from("post-images")
            .upload(fileName, uploadFile);

          if (error) return console.error(error);

          const url = supabase.storage
            .from("post-images")
            .getPublicUrl(fileName).data.publicUrl;

          setContent((prev) => `${prev}\n![이미지](${url})\n`);
        });
      }
    }
  };

  return (
    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      onPaste={handlePaste}
      style={{ width: "100%", minHeight: 200, fontFamily: "monospace" }}
      placeholder="Ctrl+V로 이미지 붙여넣기 가능"
    />
  );
}
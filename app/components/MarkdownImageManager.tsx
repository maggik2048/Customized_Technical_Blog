"use client";

import React, { useRef } from "react";
import { supabase } from "@/lib/supabase";
import { processPaste } from "@/lib/pasteProcessor";
import { resizeImage } from "@/lib/imageHandler";
import MarkdownRenderer from "./MarkdownRenderer";

type Props = {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

export default function MarkdownImageManager({ content, setContent }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 붙여넣기
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");
    const result = processPaste(html, text);
    setContent((prev) => prev + "\n" + result + "\n");
  };

  // 이미지 업로드
  const handleInsertImage = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const blob = await resizeImage(file);
    const fileName = `${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from("imagebucket")
      .upload(fileName, blob);
    if (error) return alert(error.message);

    const { data } = supabase.storage
      .from("imagebucket")
      .getPublicUrl(fileName);

    setContent((prev) => prev + `\n![](${data.publicUrl})\n`);
  };

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div>
        <button onClick={handleInsertImage}>Insert Image</button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onPaste={handlePaste}
          style={{ width: 400, height: 400 }}
        />
      </div>

      <div style={{ width: 400 }}>
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
}
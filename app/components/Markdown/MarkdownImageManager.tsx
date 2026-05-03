"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { supabase } from "@/lib/supabase";

type Props = {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

export default function MarkdownImageManager({ content, setContent }: Props) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // 이미지 리사이즈 함수
  const resizeImage = (file: File, maxSize = 1000): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          const scale = Math.min(maxSize / width, maxSize / height);
          width *= scale;
          height *= scale;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, file.type);
      };
    });
  };

  const handleInsertImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    try {
      const resizedBlob = await resizeImage(file, 1000);
      const fileName = `${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("imagebucket")
        .upload(fileName, resizedBlob);

      if (uploadError) {
        console.error("Upload failed:", uploadError.message);
        alert("Image upload failed: " + uploadError.message);
        return;
      }

      const { data: urlData, error: urlError } = supabase.storage
        .from("imagebucket")
        .getPublicUrl(fileName);

      if (urlError || !urlData?.publicUrl) {
        console.error("Failed to get public URL:", urlError);
        alert("Failed to get public URL after upload.");
        return;
      }

      setContent((prev) => prev + `\n![](${urlData.publicUrl})\n`);
      e.target.value = "";
    } catch (err) {
      console.error(err);
      alert("Unexpected error during upload.");
    }
  };

  // 🔹 순수 이미지 URL 자동 Markdown 변환
  const renderContent = content.replace(
    /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|bmp|svg))$/gm,
    "![]($1)"
  );

  return (
    <div>
      {/* Insert Image 버튼 */}
      <div style={{ marginBottom: 10 }}>
        <button
          type="button"
          onClick={handleInsertImage}
          style={{
            padding: "6px 12px",
            background: "#1e40af",
            color: "#fff",
            borderRadius: 4,
            cursor: "pointer",
            marginBottom: 8,
          }}
        >
          Insert Image
        </button>

        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      {/* Markdown Editor + Preview */}
      <div style={{ display: "flex", gap: 20 }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write Markdown with KaTeX..."
          style={{
            width: "50%",
            height: 400,
            padding: 10,
            fontFamily: "monospace",
          }}
        />

        <div
          style={{
            width: "50%",
            height: 400,
            overflow: "auto",
            padding: 10,
            background: "#111",
            color: "#fff",
            borderRadius: 8,
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code({ inline, className, children, ...props }) {
                const text = String(children);

                // 한 줄짜리 짧은 코드 또는 inline 코드 → 박스 없이 강조
                if (inline || (text.length < 80 && !text.includes("\n"))) {
                  return (
                    <code
                      style={{
                        background: "#333",
                        padding: "2px 6px",
                        borderRadius: 4,
                      }}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }

                // 긴 코드 블록 → SyntaxHighlighter 사용
                const match = /language-(\w+)/.exec(className || "");
                return (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match?.[1] || "text"}
                    PreTag="div"
                  >
                    {text}
                  </SyntaxHighlighter>
                );
              },
              img({ src, alt, ...props }) {
                return (
                  <img
                    src={src}
                    alt={alt}
                    style={{
                      maxWidth: "100%",
                      maxHeight: 300,
                      display: "block",
                      margin: "10px 0",
                      borderRadius: 6,
                    }}
                    {...props}
                  />
                );
              },
            }}
          >
            {renderContent || "Preview will appear here..."}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
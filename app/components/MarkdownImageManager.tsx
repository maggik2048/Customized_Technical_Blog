"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
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
  // 드래그&드롭 처리
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, file);

      if (error) {
        console.error("Upload error:", error);
        continue;
      }

      const { publicUrl } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      // Markdown 링크 자동 삽입
      setContent((prev) => prev + `\n![${file.name}](${publicUrl})\n`);
    }
  };

  // 단순 URL도 이미지로 처리
  const renderContent = content.replace(
    /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/gm,
    "![]($1)"
  );

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          width: "50%",
          height: 400,
          padding: 10,
          border: "2px dashed #888",
          borderRadius: 6,
          textAlign: "center",
          color: "#888",
          cursor: "pointer",
        }}
      >
        Drop images here to upload
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write Markdown with KaTeX..."
          style={{
            width: "100%",
            height: "100%",
            padding: 10,
            fontFamily: "monospace",
            border: "none",
            background: "transparent",
            color: "#fff",
            resize: "none",
          }}
        />
      </div>

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
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");

              if (inline) {
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

              return (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match?.[1] || "text"}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, "")}
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
  );
}
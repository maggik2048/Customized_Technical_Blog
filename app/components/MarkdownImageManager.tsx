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
  // 단순 Insert Image 버튼
  const handleInsertImage = async () => {
    const url = prompt("Insert image URL:");
    if (!url) return;

    // Supabase 업로드를 원하면 fetch + upload 가능
    // 현재는 URL을 그대로 Markdown에 삽입
    setContent((prev) => prev + `\n![](${url})\n`);
  };

  // 단순 URL도 이미지로 렌더링
  const renderContent = content.replace(
    /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/gm,
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
      </div>

      {/* 에디터 + 프리뷰 */}
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
    </div>
  );
}
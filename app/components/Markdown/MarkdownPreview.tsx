"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  content: string;
  previewRef: React.RefObject<HTMLDivElement>;
};

export default function MarkdownPreview({
  content,
  previewRef,
}: Props) {
  const renderContent = content.replace(
    /^(https?:\/\/.*\.(png|jpg|jpeg|gif|webp|bmp|svg))$/gm,
    "![]($1)"
  );

  return (
    <div
      ref={previewRef}
      style={{
        width: "50%",
        height: "100%",
        overflow: "auto",
        padding: 20,
        background: "#111",
        color: "#fff",
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ inline, className, children }: any) {
            const text = String(children);

            if (inline || (text.length < 80 && !text.includes("\n"))) {
              return (
                <code
                  style={{
                    background: "#333",
                    padding: "2px 6px",
                    borderRadius: 4,
                  }}
                >
                  {children}
                </code>
              );
            }

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

          img({ src, alt }: any) {
            return (
              <img
                src={src}
                alt={alt}
                style={{
                  maxWidth: "100%",
                  maxHeight: 400,
                  display: "block",
                  margin: "10px 0",
                  borderRadius: 6,
                }}
              />
            );
          },
        }}
      >
        {renderContent || "Preview..."}
      </ReactMarkdown>
    </div>
  );
}
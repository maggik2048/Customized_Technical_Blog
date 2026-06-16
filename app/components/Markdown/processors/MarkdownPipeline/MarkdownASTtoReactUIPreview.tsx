"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";

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

        //  줄 유지
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ inline, className, children }: any) {
            const text = Array.isArray(children)
              ? children.join("")
              : String(children);

            // inline code
            if (
              inline ||
              (text.length < 80 && !text.includes("\n"))
            ) {
              return (
                <code
                  style={{
                    background: "#333",
                    padding: "2px 6px",
                    borderRadius: 4,
                  }}
                >
                  {text}
                </code>
              );
            }

            // language
            const match = /language-(\w+)/.exec(
              className || ""
            );

            //  code block 자체가 copy 제어
            return (
              <pre
                onCopy={(e) => {
                  e.preventDefault();
                  e.clipboardData?.setData(
                    "text/plain",
                    text
                  );
                }}
                style={{
                  margin: 0,
                  borderRadius: 6,
                  overflow: "auto",
                }}
              >
                <SyntaxHighlighter
                  style={oneDark}
                  language={match?.[1] || "text"}
                  PreTag="div"
                  wrapLines={true}
                  wrapLongLines={false}
                >
                  {text}
                </SyntaxHighlighter>
              </pre>
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



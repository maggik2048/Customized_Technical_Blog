"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "../styles/markdownStyles.css";

type MarkdownRendererProps = {
  content: string;
};

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ inline, className, children }) {
            const text = String(children);

            if (inline) {
              // ✅ inline 코드는 SyntaxHighlighter 사용 X, 그냥 <code>로 렌더
              return (
                <code style={{
                  backgroundColor: "#f5f5f5",
                  padding: "0.2em 0.4em",
                  borderRadius: "4px",
                  fontSize: "0.95em",
                  fontWeight: 500,
                  whiteSpace: "pre-wrap"
                }}>
                  {text}
                </code>
              );
            }

            // ✅ block code만 SyntaxHighlighter 적용
            const match = /language-(\w+)/.exec(className || "");
            return (
              <SyntaxHighlighter
                style={oneDark}
                language={match?.[1] || "text"}
                wrapLongLines={true}
              >
                {text}
              </SyntaxHighlighter>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";

export default function RemarkPageRenderer({
  children,
  markdownComponents,
  sciFiMarkdownComponents,
  isDark,
  CodeBlock,
}: any) {
  const markdownProps = {
    remarkPlugins: [
      remarkMath,
      remarkGfm,
    ],
    rehypePlugins: [rehypeKatex, rehypeRaw],

    components: {
      ...markdownComponents,
      ...(isDark ? sciFiMarkdownComponents : {}),

      code: CodeBlock,

      /*  문단 안정화 (한글 줄깨짐 방지) */
      p: ({ children }: any) => (
        <p
          style={{
            wordBreak: "keep-all",
            overflowWrap: "normal",
            whiteSpace: "normal",
            lineHeight: 1.6,
            margin: "6px 0",
          }}
        >
          {children}
        </p>
      ),

      /*  리스트 → 박스 + 들여쓰기 + 오른쪽 확장 */
      ul: ({ children }: any) => (
        <div
          style={{
            display: "block",
            width: "fit-content",
            maxWidth: "100%",

            margin: "8px 0",
            marginLeft: 16,          //  들여쓰기

            padding: "6px 14px",
            paddingRight: 302,        //  오른쪽 더 길게

            borderRadius: 8,

            minWidth: "240px",       //  너무 작아지지 않게

            background: isDark
              ? "rgba(120,120,120,0.22)"
              : "rgba(0,0,0,0.06)",

            border: isDark
              ? "1px solid rgba(200,200,200,0.35)"
              : "1px solid rgba(0,0,0,0.12)",

            boxShadow: isDark
              ? "0 2px 10px rgba(0,0,0,0.35)"
              : "0 2px 6px rgba(0,0,0,0.08)",

            boxSizing: "border-box",
          }}
        >
          <ul
            style={{
              margin: 0,
              paddingLeft: 16,
            }}
          >
            {children}
          </ul>
        </div>
      ),

      /* 🔥 ordered list 동일 스타일 */
      ol: ({ children }: any) => (
        <div
          style={{
            display: "block",
            width: "fit-content",
            maxWidth: "100%",

            margin: "8px 0",
            marginLeft: 16,

            padding: "6px 14px",
            paddingRight: 22,

            borderRadius: 8,
            minWidth: "240px",

            background: isDark
              ? "rgba(120,120,120,0.22)"
              : "rgba(0,0,0,0.06)",

            border: isDark
              ? "1px solid rgba(200,200,200,0.35)"
              : "1px solid rgba(0,0,0,0.12)",

            boxShadow: isDark
              ? "0 2px 10px rgba(0,0,0,0.35)"
              : "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <ol
            style={{
              margin: 0,
              paddingLeft: 18,
            }}
          >
            {children}
          </ol>
        </div>
      ),

      /* 🔥 리스트 간격 */
      li: ({ children }: any) => (
        <li
          style={{
            marginBottom: 2,
            lineHeight: 1.5,
          }}
        >
          {children}
        </li>
      ),
    },
  };

  return (
    <ReactMarkdown {...markdownProps}>
      {children}
    </ReactMarkdown>
  );
}
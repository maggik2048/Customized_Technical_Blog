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

  /*  골드 텍스트 */
  const goldText = {
    background: "linear-gradient(135deg, #6b510f, #685123, #4f4312)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "0.02em",
  };

  /*  화이트 럭셔리 박스 */
  const luxuryWhiteBox = {
    background: "linear-gradient(145deg, #ffffff, #f6f3ee)",

    border: "1px solid rgba(212,168,79,0.35)",

    boxShadow: `
      0 6px 20px rgba(0,0,0,0.08),
      inset 0 1px 0 rgba(255,255,255,0.8)
    `,

    borderRadius: 14,
  };

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

      /*  문단 안정화 */
      p: ({ children }: any) => (
        <p
          style={{
            wordBreak: "keep-all",
            overflowWrap: "normal",
            whiteSpace: "normal",
            lineHeight: 1.65,
            margin: "6px 0",
            color: "#222",
          }}
        >
          {children}
        </p>
      ),

      /*  h2 → 박스 제거 + 골드 라인 */
      h2: ({ children }: any) => (
        <div
          style={{
            marginLeft: -64,
            width: "calc(100% + 64px)",

            marginTop: 28,
            marginBottom: 12,

            paddingLeft: 14,
            position: "relative",
          }}
        >
          {/* 골드 라인 */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 6,
              bottom: 6,
              width: 3,
              borderRadius: 2,
              background: "linear-gradient(to bottom, #f5d27a, #d4a84f)",
            }}
          />

          <h2
            style={{
              margin: 0,
              fontWeight: 700,
              ...goldText,
            }}
          >
            {children}
          </h2>
        </div>
      ),

      /*  리스트 박스 (럭셔리 유지) */
      ul: ({ children }: any) => (
        <div
          style={{
            margin: "12px 0",
            marginLeft: 20,

            padding: "10px 16px",

            minWidth: "260px",

            ...luxuryWhiteBox,
          }}
        >
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {children}
          </ul>
        </div>
      ),

      ol: ({ children }: any) => (
        <div
          style={{
            margin: "12px 0",
            marginLeft: 20,

            padding: "10px 16px",

            minWidth: "260px",

            ...luxuryWhiteBox,
          }}
        >
          <ol style={{ margin: 0, paddingLeft: 18 }}>
            {children}
          </ol>
        </div>
      ),

      /*  리스트 아이템 */
      li: ({ children }: any) => (
        <li
          style={{
            marginBottom: 4,
            lineHeight: 1.6,
            color: "#333",
          }}
        >
          <span
            style={{
              color: "#d4a84f",
              marginRight: 6,
              fontWeight: 700,
            }}
          >
            •
          </span>
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
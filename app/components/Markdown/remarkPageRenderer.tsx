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

  /*  오른쪽으로 fade 되는 럭셔리 박스 */
  const luxuryWhiteBox = {
    position: "relative",

    /* 핵심: 오른쪽으로 투명해지는 배경 */
    background:
      "linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(246,243,238,0.92) 60%, rgba(246,243,238,0.35) 85%, rgba(246,243,238,0) 100%)",

    border: "1px solid rgba(212,168,79,0.25)",

    boxShadow: `
      0 6px 20px rgba(0,0,0,0.08),
      inset 0 1px 0 rgba(255,255,255,0.8)
    `,

    borderRadius: 14,

    /* 오른쪽 fade 자연스럽게 */
    WebkitMaskImage:
      "linear-gradient(to right, black 70%, transparent 100%)",
    maskImage:
      "linear-gradient(to right, black 70%, transparent 100%)",
  };

  const markdownProps = {
    remarkPlugins: [remarkMath, remarkGfm],
    rehypePlugins: [rehypeKatex, rehypeRaw],

    components: {
      ...markdownComponents,
      ...(isDark ? sciFiMarkdownComponents : {}),

      code: CodeBlock,

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
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0.01,
              bottom: 0.01,
              width: 3,
              borderRadius: 2,
              background: "linear-gradient(to bottom, #9e7c27, #f2be57)",
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

      /* UL - fade box */
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

      /* OL - same fade box */
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

  return <ReactMarkdown {...markdownProps}>{children}</ReactMarkdown>;
}
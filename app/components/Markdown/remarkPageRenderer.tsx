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

  /* =========================
     🎨 HEADING SYSTEM (FULLY DECOUPLED)
  ========================= */

  // 🪨 H1 = engraved gold (메인 타이틀)
  const h1Style = {
    background: "linear-gradient(135deg, #85857b, #c5b7b7, #676251)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "0.02em",
    textShadow: `
      0 1px 0 rgba(255,255,255,0.55),
      0 2px 3px rgba(0,0,0,0.18)
    `,
  };

  // 🪙 H2 = luxury gold foil (섹션 타이틀)
  const h2Style = {
    background: "linear-gradient(90deg, #f6d36b, #c6b083, #9e7c27)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "0.02em",
    textShadow: `
      0 1px 0 rgba(255,255,255,0.55),
      0 2px 6px rgba(0,0,0,0.18)
    `,
  };

  // ✨ H3 = soft glow gold (서브 타이틀)
  const h3Style = {
    background: "linear-gradient(135deg, #ffe9a3, #d2c199, #dfb96b)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "0.03em",
    filter: "brightness(1.25) saturate(1.3)",
    textShadow: "0 0 8px rgba(212,168,79,0.25)",
  };

  /* =========================
     📦 LUXURY BOX (LISTS)
  ========================= */

  const luxuryWhiteBox = {
    position: "relative",
    background:
      "linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(246,243,238,0.92) 60%, rgba(246,243,238,0.35) 85%, rgba(246,243,238,0) 100%)",
    border: "1px solid rgba(212,168,79,0.25)",
    boxShadow: `
      0 6px 20px rgba(0,0,0,0.08),
      inset 0 1px 0 rgba(255,255,255,0.8)
    `,
    borderRadius: 14,
    WebkitMaskImage:
      "linear-gradient(to right, black 70%, transparent 100%)",
    maskImage:
      "linear-gradient(to right, black 70%, transparent 100%)",
  };

  /* =========================
     🧠 HEADING RENDERER (STRUCTURE ONLY)
  ========================= */

  const renderHeading = (level: number) => ({ children }: any) => {

    const sizeMap: any = {
      1: 30,
      2: 22,
      3: 18,
    };

    const marginMap: any = {
      1: "36px 0 18px",
      2: "28px 0 12px",
      3: "20px 0 10px",
    };

    const styleMap: any = {
      1: h1Style,
      2: h2Style,
      3: h3Style,
    };

    return (
      <div
        style={{
          margin: marginMap[level],
          position: "relative",
          paddingLeft: level >= 2 ? 14 : 0,
        }}
      >
        {/* H2/H3 accent line only */}
        {level >= 2 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 3,
              borderRadius: 2,
              background:
                level === 2
                  ? "linear-gradient(to bottom, #9e7c27, #f2be57)"
                  : "linear-gradient(to bottom, #ffe9a3, #f2c14e)",
            }}
          />
        )}

        <div
          style={{
            fontSize: sizeMap[level],
            fontWeight: level === 1 ? 800 : 700,
            letterSpacing: level === 1 ? "0.03em" : "0.02em",
            textShadow: `
              0 1px 0 rgba(255,255,255,0.65),
              0 2px 0 rgba(0,0,0,0.18),
              0 3px 6px rgba(0,0,0,0.10)
            `,
          }}
        >
          <span style={styleMap[level]}>
            {children}
          </span>
        </div>
      </div>
    );
  };

  /* =========================
     🧾 MARKDOWN CONFIG
  ========================= */

  const markdownProps = {
    remarkPlugins: [remarkMath, remarkGfm],
    rehypePlugins: [rehypeKatex, rehypeRaw],

    components: {
      ...markdownComponents,
      ...(isDark ? sciFiMarkdownComponents : {}),

      code: CodeBlock,

      h1: renderHeading(1),
      h2: renderHeading(2),
      h3: renderHeading(3),

      p: ({ children }: any) => (
        <p
          style={{
            wordBreak: "keep-all",
            overflowWrap: "normal",
            lineHeight: 1.65,
            margin: "6px 0",
            color: "#222",
          }}
        >
          {children}
        </p>
      ),

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
          <ul style={{ margin: 0, paddingLeft: 18 }}>{children}</ul>
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
          <ol style={{ margin: 0, paddingLeft: 18 }}>{children}</ol>
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
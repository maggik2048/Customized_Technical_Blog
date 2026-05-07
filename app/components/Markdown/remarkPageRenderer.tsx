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
     🎨 HEADINGS STYLE
  ========================= */

  const h1Style = {
    background: "linear-gradient(135deg, #9a9a8f, #e3d7d7, #6b665a)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    WebkitTextStroke: "0.9px rgba(0,0,0,0.18)",
    textShadow: `
      0 3px 0 rgba(255,255,255,0.65),
      0 1px 0px rgba(0,0,0,0.98)
    `,
  };

  const h2Style = {
    background: "linear-gradient(90deg, #ffe08a, #c9b27a, #a07d2a)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    WebkitTextStroke: "0.6px rgba(0,0,0,0.15)",
    textShadow: `
      0 1px 0 rgba(255,255,255,0.9),
      0 1px 7px rgba(0,0,0,0.15)
    `,
  };

  const h3Style = {
    background: "linear-gradient(135deg, #fff0b3, #d8caa3, #e2b85e)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    WebkitTextStroke: "0.25px rgba(0,0,0,0.12)",
    filter: "brightness(1.15) saturate(1.15)",
    textShadow: `
      0 1px 0 rgba(255,255,255,0.65),
      0 2px 5px rgba(0,0,0,0.12)
    `,
  };

  /* =========================
     📦 LUXURY BOX (RESTORED FADE)
  ========================= */

  const luxuryWhiteBox = {
    position: "relative" as const,
    background:
      "linear-gradient(90deg, rgba(255,255,255,0.97) 0%, rgba(246,243,238,0.9) 70%, rgba(246,243,238,0.35) 100%)",

    border: "1px solid rgba(212,168,79,0.2)",

    boxShadow: `
      0 6px 18px rgba(0,0,0,0.07),
      inset 0 1px 0 rgba(255,255,255,0.8)
    `,

    borderRadius: 14,

    /* 🔥 핵심: 오른쪽 fade out 유지 */
    WebkitMaskImage:
      "linear-gradient(to right, black 55%, rgba(0,0,0,0.85) 70%, transparent 100%)",
    maskImage:
      "linear-gradient(to right, black 55%, rgba(0,0,0,0.85) 70%, transparent 100%)",
  };

  /* =========================
     ✦ CLAUDE-STYLE MARKER
  ========================= */

  const starMarker = {
    color: "#a8842a",
    marginRight: 10,
    fontSize: 13,
    display: "inline-block",
    transform: "translateY(1px)",
    textShadow: "0 1px 2px rgba(0,0,0,0.25)",
  };

  /* =========================
     🧠 HEADINGS FADE LAYER
  ========================= */

  const headingDarkFadeBox = {
    position: "absolute" as const,
    top: "50%",
    left: 0,
    transform: "translateY(-50%)",
    width: "32%",
    height: "84%",
    borderRadius: 1,

    background: `
      linear-gradient(
        90deg,
        rgba(0,0,0,0.10) 0%,
        rgba(0,0,0,0.15) 18%,
        rgba(0,0,0,0.06) 40%,
        rgba(0,0,0,0.01) 60%,
        rgba(0,0,0,0) 80%
      )
    `,

    boxShadow: `inset 0 0 25px rgba(0,0,0,0.10)`,

    WebkitMaskImage: `
      linear-gradient(
        90deg,
        rgba(0,0,0,1) 0%,
        rgba(0,0,0,0.9) 20%,
        rgba(0,0,0,0.35) 50%,
        rgba(0,0,0,0.05) 70%,
        rgba(0,0,0,0) 80%
      )
    `,
    maskImage: `
      linear-gradient(
        90deg,
        rgba(0,0,0,1) 0%,
        rgba(0,0,0,0.9) 20%,
        rgba(0,0,0,0.35) 50%,
        rgba(0,0,0,0.05) 70%,
        rgba(0,0,0,0) 80%
      )
    `,

    pointerEvents: "none" as const,
  };

  const renderHeading = (level: number) => ({ children }: any) => {
    const sizeMap: any = { 1: 30, 2: 22, 3: 18 };
    const marginMap: any = {
      1: "36px 0 18px",
      2: "28px 0 12px",
      3: "20px 0 10px",
    };
    const styleMap: any = { 1: h1Style, 2: h2Style, 3: h3Style };

    return (
      <div style={{ margin: marginMap[level], position: "relative" }}>
        {level !== 1 && <div style={headingDarkFadeBox} />}

        <div style={{ position: "relative", zIndex: 2, padding: "6px 14px" }}>
          <span
            style={{
              ...styleMap[level],
              fontSize: sizeMap[level],
              fontWeight: level === 1 ? 800 : 700,
              display: "inline-block",
            }}
          >
            {children}
          </span>
        </div>
      </div>
    );
  };

  /* =========================
     🧾 MARKDOWN
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
        <p style={{ lineHeight: 1.65, margin: "6px 0", color: "#222" }}>
          {children}
        </p>
      ),

      /* =========================
         ✦ LIST ITEMS (SAFE OVERRIDE)
      ========================= */

      li: ({ children }: any) => (
        <li
          style={{
            display: "flex",
            alignItems: "flex-start",
            margin: "6px 0",
          }}
        >
          <span style={starMarker}>✦</span>
          <span>{children}</span>
        </li>
      ),

      ul: ({ children }: any) => (
        <div style={{ ...luxuryWhiteBox, margin: "12px 0", marginLeft: 20, padding: "10px 16px" }}>
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
            {children}
          </ul>
        </div>
      ),

      ol: ({ children }: any) => (
        <div style={{ ...luxuryWhiteBox, margin: "12px 0", marginLeft: 20, padding: "10px 16px" }}>
          <ol style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
            {children}
          </ol>
        </div>
      ),
    },
  };

  return <ReactMarkdown {...markdownProps}>{children}</ReactMarkdown>;
}
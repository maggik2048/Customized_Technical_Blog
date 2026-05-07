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
     🎨 HEADINGS
  ========================= */

  const h1Style = {
    background: "linear-gradient(135deg, #9a9a8f, #e3d7d7, #6b665a)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    WebkitTextStroke: "0.4px rgba(0,0,0,0.18)",
    textShadow: `
      0 3px 0 rgba(255,255,255,0.75),
      0 1px 3px rgba(0,0,0,0.08)
    `,
  };

  const h2Style = {
    background: "linear-gradient(90deg, #ffe08a, #c9b27a, #a07d2a)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    WebkitTextStroke: "0.6px rgba(0,0,0,0.15)",
    textShadow: `
      0 2px 0 rgba(255,255,255,0.9),
      0 2px 7px rgba(0,0,0,0.15)
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
     📦 LIST BOX
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
    WebkitMaskImage:
      "linear-gradient(to right, black 55%, transparent 100%)",
    maskImage:
      "linear-gradient(to right, black 55%, transparent 100%)",
  };

  /* =========================
     🌑 FIXED AIRBRUSH DARK BOX
  ========================= */

  const headingDarkFadeBox = {
    position: "absolute" as const,

    top: "50%",
    left: 0,
    transform: "translateY(-50%)",

    width: "32%",
    height: "84%",
    borderRadius: 1,

    /* 핵심: 빠르게 사라지는 gradient */
    background: `
      linear-gradient(
        90deg,
        rgba(0,0,0,0.30) 0%,
        rgba(0,0,0,0.18) 20%,
        rgba(0,0,0,0.08) 45%,
        rgba(0,0,0,0.02) 65%,
        rgba(0,0,0,0) 82%
      )
    `,

    /* shadow는 최소화 + 내부 중심 */
    boxShadow: `
      inset 0 0 35px rgba(0,0,0,0.10),
      0 8px 20px rgba(0,0,0,0.08)
    `,

    /* 핵심: 빠른 cutoff mask */
    WebkitMaskImage: `
      linear-gradient(
        90deg,
        rgba(0,0,0,1) 0%,
        rgba(0,0,0,0.85) 25%,
        rgba(0,0,0,0.25) 60%,
        rgba(0,0,0,0) 82%
      )
    `,
    maskImage: `
      linear-gradient(
        90deg,
        rgba(0,0,0,1) 0%,
        rgba(0,0,0,0.85) 25%,
        rgba(0,0,0,0.25) 60%,
        rgba(0,0,0,0) 82%
      )
    `,

    pointerEvents: "none",
  };

  /* =========================
     🧠 HEADING RENDER
  ========================= */

  const renderHeading = (level: number) => ({ children }: any) => {
    const sizeMap: any = { 1: 30, 2: 22, 3: 18 };
    const marginMap: any = {
      1: "36px 0 18px",
      2: "28px 0 12px",
      3: "20px 0 10px",
    };
    const styleMap: any = { 1: h1Style, 2: h2Style, 3: h3Style };

    return (
      <div
        style={{
          margin: marginMap[level],
          position: "relative",
          paddingLeft: level >= 2 ? 12 : 0,
        }}
      >
        {level !== 1 && (
          <>
            <div style={headingDarkFadeBox} />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.10)",
                filter: "blur(10px)",
                opacity: 0.4,
                borderRadius: 20,
                pointerEvents: "none",
              }}
            />
          </>
        )}

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
            position: "relative",
            zIndex: 2,
            fontSize: sizeMap[level],
            fontWeight: level === 1 ? 800 : 700,
            letterSpacing: level === 1 ? "0.03em" : "0.02em",
            padding: "6px 14px",
            display: "inline-block",
          }}
        >
          <span style={styleMap[level]}>{children}</span>
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

      ul: ({ children }: any) => (
        <div style={{ margin: "12px 0", marginLeft: 20, padding: "10px 16px", ...luxuryWhiteBox }}>
          <ul style={{ margin: 0, paddingLeft: 18 }}>{children}</ul>
        </div>
      ),

      ol: ({ children }: any) => (
        <div style={{ margin: "12px 0", marginLeft: 20, padding: "10px 16px", ...luxuryWhiteBox }}>
          <ol style={{ margin: 0, paddingLeft: 18 }}>{children}</ol>
        </div>
      ),
    },
  };

  return <ReactMarkdown {...markdownProps}>{children}</ReactMarkdown>;
}
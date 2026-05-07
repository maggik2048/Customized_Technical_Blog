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
     🎨 HEADING SYSTEM (SUBTLE EMBOSS UPGRADE)
  ========================= */

  const h1Style = {
    background: "linear-gradient(135deg, #9a9a8f, #e3d7d7, #6b665a)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",

    WebkitTextStroke: "0.4px rgba(0,0,0,0.18)",

    letterSpacing: "0.03em",
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

    letterSpacing: "0.03em",
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

    letterSpacing: "0.03em",
    filter: "brightness(1.15) saturate(1.15)",
    textShadow: `
      0 1px 0 rgba(255,255,255,0.65),
      0 2px 5px rgba(0,0,0,0.12)
    `,
  };

  /* =========================
     📦 LUXURY BOX (LISTS)
  ========================= */

  const luxuryWhiteBox = {
    position: "relative",
    background:
      "linear-gradient(90deg, rgba(255,255,255,0.97) 0%, rgba(246,243,238,0.9) 70%, rgba(246,243,238,0.35) 100%)",
    border: "1px solid rgba(212,168,79,0.2)",
    boxShadow: `
      0 6px 18px rgba(0,0,0,0.07),
      inset 0 1px 0 rgba(255,255,255,0.8)
    `,
    borderRadius: 14,
    WebkitMaskImage:
      "linear-gradient(to right, black 75%, transparent 100%)",
    maskImage:
      "linear-gradient(to right, black 75%, transparent 100%)",
  };

  /* =========================
     🧠 HEADING RENDERER
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
          paddingLeft: level >= 2 ? 12 : 0,
        }}
      >
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
              opacity: 0.9,
            }}
          />
        )}

        <div
          style={{
            fontSize: sizeMap[level],
            fontWeight: level === 1 ? 800 : 700,
            letterSpacing: level === 1 ? "0.03em" : "0.02em",
            textShadow: `
              0 1px 0 rgba(255,255,255,0.7),
              0 2px 2px rgba(0,0,0,0.12)
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
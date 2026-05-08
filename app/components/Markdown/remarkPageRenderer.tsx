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
    background: "linear-gradient(90deg, #fff6dd, #cbc0a3, #a08a57)",
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
      LUXURY BOX
     기존 흰색 gradient 대신
     tess4.png 렌더링
  ========================= */

  const luxuryWhiteBox = {
    position: "relative" as const,

    /*  여기 변경 */
    backgroundImage: `
      linear-gradient(
        90deg,
        rgba(255,255,255,0.92) 0%,
        rgba(255,255,255,0.78) 45%,
        rgba(255,255,255,0.45) 75%,
        rgba(255,255,255,0.15) 100%
      ),
      url("/images/tess4.png")
    `,

    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "repeat",

    border: "1px solid rgba(212,168,79,0.2)",

    boxShadow: `
      0 6px 18px rgba(0,0,0,0.07),
      inset 0 1px 0 rgba(255,255,255,0.8)
    `,

    borderRadius: 14,

    overflow: "hidden" as const,

    WebkitMaskImage:
      "linear-gradient(to right, black 55%, rgba(0,0,0,0.85) 75%, transparent 100%)",

    maskImage:
      "linear-gradient(to right, black 55%, rgba(0,0,0,0.85) 75%, transparent 100%)",
  };

  /* =========================
     ✦ MARKER
  ========================= */

  const starMarker = {
    color: "#a8842a",
    marginRight: 10,
    fontSize: 13,
    display: "inline-block",
    transform: "translateY(1px)",
    textShadow: "0 2px 2px rgba(0,0,0,0.5)",
  };

  /* =========================
     🟨 GOLD BAR
  ========================= */

  const goldBar = {
    position: "absolute" as const,
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    borderRadius: 2,
    background: "linear-gradient(to bottom, #9e7c27, #ffe7b6)",
    boxShadow: "0 0 6px rgba(212,168,79,0.35)",
  };

  /* =========================
     🧠 HEADINGS FADE
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

  /* =========================
     🧠 RENDER
  ========================= */

  const renderHeading = (level: number) => ({ children }: any) => {
    const sizeMap: any = { 1: 30, 2: 22, 3: 18 };

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
      <div style={{ margin: marginMap[level], position: "relative" }}>
        {level !== 1 && <div style={headingDarkFadeBox} />}

        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "6px 14px",
          }}
        >
          <span
            style={{
              ...styleMap[level],
              fontSize: sizeMap[level],
              fontWeight: level === 1 ? 800 : 700,
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

  const textShadow = "0 1px 2px rgba(0,0,0,0.22)";

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

      /* =========================
         📜 PARAGRAPH
      ========================= */

      p: ({ children }: any) => (
        <p
          style={{
            lineHeight: 1.65,
            margin: "6px 0",
            color: "#5a3f1a",
            textShadow,
          }}
        >
          {children}
        </p>
      ),

      /* =========================
         ✦ LIST ITEM
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

          <span
            style={{
              color: "#b48f46",
              textShadow,
            }}
          >
            {children}
          </span>
        </li>
      ),

      ul: ({ children }: any) => (
        <div
          style={{
            ...luxuryWhiteBox,
            margin: "12px 0",
            marginLeft: 20,
            padding: "10px 16px",
          }}
        >
          <div style={goldBar} />

          <ul
            style={{
              margin: 0,
              paddingLeft: 0,
              listStyle: "none",
              position: "relative",
              zIndex: 2,
            }}
          >
            {children}
          </ul>
        </div>
      ),

      ol: ({ children }: any) => (
        <div
          style={{
            ...luxuryWhiteBox,
            margin: "12px 0",
            marginLeft: 20,
            padding: "10px 16px",
          }}
        >
          <div style={goldBar} />

          <ol
            style={{
              margin: 0,
              paddingLeft: 0,
              listStyle: "none",
              position: "relative",
              zIndex: 2,
            }}
          >
            {children}
          </ol>
        </div>
      ),
    },
  };

  return (
    <ReactMarkdown {...markdownProps}>
      {children}
    </ReactMarkdown>
  );
}
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";

import {
  Cormorant,
  Cormorant_SC,
  Noto_Serif_KR,
  Libre_Baskerville,
} from "next/font/google";

import TableRenderer from "./TableRenderer";
import KaTeXPostProcessor from "./KaTeXPostProcessor";

/* =========================
    FONT SYSTEM
========================= */

const fontH1 = Cormorant_SC({
  subsets: ["latin"],
  weight: ["700"],
});

const fontH2 = Cormorant_SC({
  subsets: ["latin"],
  weight: ["600"],
});

const fontH3 = Cormorant_SC({
  subsets: ["latin"],
  weight: ["600"],
});

const fontBody = Cormorant_SC({
  subsets: ["latin"],
  weight: ["500"],
});

const bodyFont = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});

/* =========================
    BASE FONT
========================= */

const baseFontFamily =
  `${bodyFont.style.fontFamily},
   "ZenSerifKR",
   serif`;

/* =========================
    COMPONENT
========================= */

export default function RemarkPageRenderer({
  children,
  markdownComponents,
  sciFiMarkdownComponents,
  isDark,
  CodeBlock,
}: any) {

  /* =========================
      TEXT SHADOW
  ========================= */

  const textShadow = `
    0 1px 0 rgba(255,255,255,0.55),
    0 1px 2px rgba(0,0,0,0.28)
  `;

  const h1Style = {
    background: "linear-gradient(135deg, #9a9a8f, #e3d7d7, #6b665a)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    WebkitTextStroke: "0.9px rgba(0,0,0,0.18)",
    textShadow: `
      0 3px 0 rgba(255,255,255,0.965),
      0 2px 6px rgba(0,0,0,0.65)
    `,
  };

  const h2Style = {
    background: "linear-gradient(90deg, #fff6dd, #cbc0a3, #a08a57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    WebkitTextStroke: "0.6px rgba(0,0,0,0.15)",
    textShadow: `
      0 1px 0 rgba(255,255,255,0.9),
      0 2px 6px rgba(0,0,0,0.22)
    `,
  };

  const h3Style = {
    background: "linear-gradient(135deg, #76756b, #c5c3bd, #6d634a)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    WebkitTextStroke: "0.25px rgba(0,0,0,0.12)",
    filter: "brightness(1.15) saturate(1.15)",
    textShadow: `
      0 1px 0 rgba(255,255,255,0.55),
      0 2px 5px rgba(0,0,0,0.18)
    `,
  };

  const luxuryWhiteBox = {
    position: "relative" as const,
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
  };

  const starMarker = {
    color: "#a8842a",
    marginRight: 8,
    fontSize: 12,
    display: "inline-block",
    transform: "translateY(1px)",
    textShadow: "0 2px 2px rgba(0,0,0,0.45)",
  };

  /* =========================
      HEADINGS
  ========================= */

  const renderHeading = (level: number) => ({ children }: any) => {
    const sizeMap: any = { 1: 28, 2: 22, 3: 18 };

    const marginMap: any = {
      1: "28px 0 14px",
      2: "20px 0 10px",
      3: "14px 0 8px",
    };

    const styleMap: any = {
      1: h1Style,
      2: h2Style,
      3: h3Style,
    };

    const fontMap: any = {
      1: fontH1,
      2: fontH2,
      3: fontH3,
    };

    return (
      <div style={{ margin: marginMap[level] }}>
        <span
          className={fontMap[level].className}
          style={{
            ...styleMap[level],
            fontSize: sizeMap[level],
            fontWeight: 800,
          }}
        >
          {children}
        </span>
      </div>
    );
  };

  /* =========================
      MARKDOWN CONFIG
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

      // ✅ p 태그 - 본문 텍스트에 약간 어두운 그림자 추가
      p: ({ children }: any) => (
        <div
          style={{
            fontFamily: baseFontFamily,
            fontSize: 16,
            lineHeight: 1.75,
            letterSpacing: "0.015em",
            margin: "6px 0",
            color: "#6b5840",
            textShadow: `
              0 2px 0 rgba(255,255,255,0.95),
              0 1px 3px rgba(255,255,255,0.9),
              0 -1px 1px rgba(0,0,0,0.3),
              0 2px 4px rgba(0,0,0,0.45)
            `,
            fontWeight: 600,
          }}
        >
          {children}
        </div>
      ),

      li: ({ children }: any) => (
        <li
          style={{
            display: "flex",
            margin: "6px 0",
            fontFamily: baseFontFamily,
            lineHeight: 1.75,
            fontWeight: 600,
            fontSize: 19,
          }}
        >
          <span style={starMarker}>✦</span>
          <span
            style={{
              color: "#b48f46",
              textShadow,
              fontWeight: 600,
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
            margin: "8px 0",
            marginLeft: 16,
            padding: "8px 14px",
          }}
        >
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
            {children}
          </ul>
        </div>
      ),

      ol: ({ children }: any) => (
        <div
          style={{
            ...luxuryWhiteBox,
            margin: "8px 0",
            marginLeft: 16,
            padding: "8px 14px",
          }}
        >
          <ol style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
            {children}
          </ol>
        </div>
      ),

      table: TableRenderer,
      thead: TableRenderer.Thead,
      tbody: TableRenderer.Tbody,
      tr: TableRenderer.Tr,
      th: TableRenderer.Th,
      td: TableRenderer.Td,
    },
  };

  return (
    <>
      <KaTeXPostProcessor />
      <div
        style={{
          paddingTop: 68,
        }}
      >
        <ReactMarkdown {...markdownProps}>
          {children}
        </ReactMarkdown>
      </div>
    </>
  );
}
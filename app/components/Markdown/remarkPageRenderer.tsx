"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";

import { Cormorant_SC } from "next/font/google";
import TableRenderer from "./TableRenderer";

import KaTeXPostProcessor from "./KaTeXPostProcessor";

/* =========================
   🎯 FONT SYSTEM (완전 분리)
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
  weight: ["500"],
});

const fontBody = Cormorant_SC({
  subsets: ["latin"],
  weight: ["400"],
});

export default function RemarkPageRenderer({
  children,
  markdownComponents,
  sciFiMarkdownComponents,
  isDark,
  CodeBlock,
}: any) {

  /* =========================
     🎨 HEADINGS STYLE (기존 유지)
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
    background: "linear-gradient(135deg, #76756b, #c5c3bd, #6d634a)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    WebkitTextStroke: "0.25px rgba(0,0,0,0.12)",
    filter: "brightness(1.15) saturate(1.15)",
    textShadow: `
      0 1px 0 rgba(255,255,255,0.65),
      0 1px 5px rgba(0,0,0,0.12)
    `,
  };

  /* =========================
     LUXURY BOX (그대로 유지)
  ========================= */

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
    marginRight: 10,
    fontSize: 13,
    display: "inline-block",
    transform: "translateY(1px)",
    textShadow: "0 2px 2px rgba(0,0,0,0.5)",
  };

  const textShadow = "0 1px 2px rgba(0,0,0,0.22)";

  /* =========================
     HEADINGS RENDERER
  ========================= */

  const renderHeading = (level: number) => ({ children }: any) => {
    const sizeMap: any = { 1: 30, 2: 23, 3: 18 };

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

    const fontMap: any = {
      1: fontH1,
      2: fontH2,
      3: fontH3,
    };

    return (
      <div style={{ margin: marginMap[level], position: "relative" }}>
        <div style={{ position: "relative", zIndex: 2, padding: "6px 14px" }}>
          <span
            className={fontMap[level].className}
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

      p: ({ children }: any) => (
        <p
          className={fontBody.className}
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

      li: ({ children }: any) => (
        <li
          className={fontBody.className}
          style={{ display: "flex", margin: "6px 0" }}
        >
          <span style={starMarker}>✦</span>
          <span style={{ color: "#b48f46", textShadow }}>
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
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
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

      <ReactMarkdown {...markdownProps}>
        {children}
      </ReactMarkdown>
    </>
  );
}
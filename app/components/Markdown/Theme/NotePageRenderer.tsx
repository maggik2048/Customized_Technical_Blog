"use client";

import React from "react";

import ReactMarkdown from "react-markdown";

import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";

import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";

import {
  Caveat,
  Patrick_Hand,
  Shadows_Into_Light,
} from "next/font/google";

import TableRenderer from "./TableRenderer";

import KaTeXPostProcessor from "./KaTeXPostProcessor";

/* =========================
   HANDWRITING FONTS (Google Fonts)
========================= */

const titleFont = Caveat({
  subsets: ["latin"],
  weight: ["700"],
});

const headingFont = Patrick_Hand({
  subsets: ["latin"],
  weight: ["400"],
});

const bodyFont = Shadows_Into_Light({
  subsets: ["latin"],
  weight: ["400"],
});

/* =========================
   BASE FONT (NanumPen 우선 사용 - globals.css에서 등록)
========================= */

const handwritingFont = `
  "NanumPen",
  ${bodyFont.style.fontFamily},
  "Nanum Pen Script",
  "Gaegu",
  cursive
`;

/* =========================
   COMPONENT
========================= */

export default function NotePageRenderer({
  children,
  markdownComponents,
  isDark,
  CodeBlock,
}: any) {

  /* =========================
     COLORS
  ========================= */

  const paperColor =
    isDark
      ? "#1e1c19"
      : "#fffef8";

  const inkColor =
    isDark
      ? "#e7dbc3"
      : "#23395d";

  const subInkColor =
    isDark
      ? "#d8c8a7"
      : "#3f4f72";

  /* =========================
     NOTE GRID
  ========================= */

  const gridSize = 34;

  const gridLineColor = isDark
    ? "rgba(255,255,255,0.15)"
    : "rgba(60, 100, 220, 0.45)";

  const crumbledPaperPath = "/images/dossierBg/crumbledpapertex.jpg";

  const notebookStyle = {

    position: "relative" as const,

    overflow: "hidden" as const,

    backgroundColor: paperColor,

    borderRadius: 18,

    padding:
      "34px 42px 60px 72px",

    boxShadow: isDark
      ? `
        0 10px 40px rgba(0,0,0,0.45)
      `
      : `
        0 12px 38px rgba(0,0,0,0.08)
      `,

    backgroundImage: `
      linear-gradient(
        ${gridLineColor} 1px,
        transparent 1px
      ),
      linear-gradient(
        90deg,
        ${gridLineColor} 1px,
        transparent 1px
      ),
      url("${crumbledPaperPath}")
    `,

    backgroundBlendMode: `
      normal,
      normal,
      multiply
    `,

    backgroundSize: `
      ${gridSize}px ${gridSize}px,
      ${gridSize}px ${gridSize}px,
      400px 400px
    `,

    backgroundRepeat: `
      repeat,
      repeat,
      repeat
    `,

    backgroundPosition: `
      0 0,
      0 0,
      0 0
    `,
  };

  /* =========================
     RED MARGIN LINE
  ========================= */

  const marginLineStyle = {

    position: "absolute" as const,

    left: 48,

    top: 0,

    bottom: 0,

    width: 2,

    background: isDark
      ? "rgba(255,120,120,0.25)"
      : "rgba(255,70,70,0.30)",

    pointerEvents: "none" as const,
  };

  /* =========================
     HEADINGS
  ========================= */

  const renderHeading =
    (level: number) =>
    ({ children }: any) => {

      const sizeMap: any = {
        1: 46,
        2: 32,
        3: 24,
      };

      const rotateMap: any = {
        1: "-1.2deg",
        2: "-0.5deg",
        3: "0.3deg",
      };

      return (
        <div
          style={{
            marginTop:
              level === 1
                ? 28
                : 18,

            marginBottom: 10,

            transform:
              `rotate(${rotateMap[level]})`,
          }}
        >
          <span
            className={
              level === 1
                ? titleFont.className
                : headingFont.className
            }
            style={{

              color:
                level === 1
                  ? inkColor
                  : subInkColor,

              fontSize:
                sizeMap[level],

              lineHeight: 1.1,

              letterSpacing:
                "0.02em",

              textShadow:
                isDark
                  ? "0 1px 2px rgba(0,0,0,0.4)"
                  : "0 1px 0 rgba(255,255,255,0.8)",
            }}
          >
            {children}
          </span>
        </div>
      );
    };

  /* =========================
     HIGHLIGHT
  ========================= */

  const highlightStyle = {

    background: isDark
      ? "rgba(255,240,120,0.18)"
      : "rgba(255,235,90,0.5)",

    padding: "1px 5px",

    borderRadius: 4,
  };

  /* =========================
     MARKDOWN
  ========================= */

  const markdownProps = {

    remarkPlugins: [
      remarkMath,
      remarkGfm,
    ],

    rehypePlugins: [
      rehypeKatex,
      rehypeRaw,
    ],

    components: {

      ...markdownComponents,

      code: CodeBlock,

      h1: renderHeading(1),
      h2: renderHeading(2),
      h3: renderHeading(3),

      p: ({ children }: any) => (
        <p
          style={{

            fontFamily:
              handwritingFont,

            color: inkColor,

            fontSize: 23,

            lineHeight: 1.85,

            margin:
              "10px 0",

            transform:
              "rotate(-0.15deg)",

            letterSpacing:
              "0.01em",

            wordBreak:
              "keep-all",

            whiteSpace:
              "pre-wrap",
          }}
        >
          {children}
        </p>
      ),

      strong: ({ children }: any) => (
        <strong
          style={{
            ...highlightStyle,

            color:
              isDark
                ? "#fff1b0"
                : "#5b3f00",

            fontWeight: 700,
          }}
        >
          {children}
        </strong>
      ),

      em: ({ children }: any) => (
        <em
          style={{
            color:
              isDark
                ? "#ffd3aa"
                : "#8f5b32",

            transform:
              "rotate(-1deg)",

            display:
              "inline-block",
          }}
        >
          {children}
        </em>
      ),

      li: ({ children }: any) => (
        <li
          style={{

            display: "flex",

            alignItems:
              "flex-start",

            fontFamily:
              handwritingFont,

            color: inkColor,

            fontSize: 22,

            lineHeight: 1.8,

            margin:
              "4px 0",

            transform:
              "rotate(-0.2deg)",
          }}
        >
          <span
            style={{
              marginRight: 12,

              opacity: 0.8,
            }}
          >
            ✎
          </span>

          <span>
            {children}
          </span>
        </li>
      ),

      ul: ({ children }: any) => (
        <ul
          style={{
            listStyle: "none",

            padding: 0,

            margin:
              "10px 0",
          }}
        >
          {children}
        </ul>
      ),

      ol: ({ children }: any) => (
        <ol
          style={{
            listStyle: "none",

            padding: 0,

            margin:
              "10px 0",
          }}
        >
          {children}
        </ol>
      ),

      blockquote: ({
        children,
      }: any) => (
        <blockquote
          style={{

            margin:
              "18px 0",

            padding:
              "12px 18px",

            borderLeft:
              "4px solid rgba(120,120,120,0.2)",

            background:
              isDark
                ? "rgba(255,255,255,0.03)"
                : "rgba(255,255,255,0.55)",

            borderRadius: 10,

            transform:
              "rotate(-0.4deg)",
          }}
        >
          {children}
        </blockquote>
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
    <div style={notebookStyle}>

      <div style={marginLineStyle} />

      <KaTeXPostProcessor />

      <ReactMarkdown
        {...markdownProps}
      >
        {children}
      </ReactMarkdown>

    </div>
  );
}
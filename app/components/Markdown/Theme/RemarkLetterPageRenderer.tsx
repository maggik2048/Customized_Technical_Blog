"use client";

import React from "react";

import ReactMarkdown from "react-markdown";

import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";

import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";

import {
  Great_Vibes,
  Cormorant_Garamond,
  Crimson_Text,
} from "next/font/google";

import TableRenderer from "./TableRenderer";

import KaTeXPostProcessor from "./KaTeXPostProcessor";

/* =========================
   LETTER FONTS
========================= */

const titleFont = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
});

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
});

const bodyFont = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600"],
});

/* =========================
   BASE FONT
========================= */

const letterFont = `
  ${bodyFont.style.fontFamily},
  "Times New Roman",
  serif
`;

/* =========================
   COMPONENT
========================= */

export default function LetterPageRenderer({
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
      ? "#1a1714"
      : "#fdf8f1";

  const inkColor =
    isDark
      ? "#f3e7d2"
      : "#35271f";

  const subInkColor =
    isDark
      ? "#dbc7aa"
      : "#5a4638";

  const accentColor =
    isDark
      ? "#b98d5d"
      : "#8c5d3b";

  /* =========================
     LETTER STYLE
  ========================= */

  const letterStyle = {

    position: "relative" as const,

    overflow: "hidden" as const,

    backgroundColor: paperColor,

    borderRadius: 14,

    padding:
      "70px 72px",

    maxWidth: 920,

    margin: "0 auto",

    boxShadow: isDark
      ? `
        0 18px 60px rgba(0,0,0,0.45)
      `
      : `
        0 18px 55px rgba(80,50,20,0.12)
      `,

    backgroundImage: isDark
      ? `
        radial-gradient(
          rgba(255,255,255,0.03) 1px,
          transparent 1px
        )
      `
      : `
        radial-gradient(
          rgba(120,90,60,0.05) 1px,
          transparent 1px
        )
      `,

    backgroundSize:
      "8px 8px",
  };

  /* =========================
     LETTER SEAL
  ========================= */

  const sealStyle = {

    position: "absolute" as const,

    top: 32,

    right: 42,

    width: 90,

    height: 90,

    borderRadius: "50%",

    border:
      `2px solid ${accentColor}`,

    opacity: 0.12,

    transform:
      "rotate(-12deg)",

    pointerEvents: "none" as const,
  };

  /* =========================
     HEADINGS
  ========================= */

  const renderHeading =
    (level: number) =>
    ({ children }: any) => {

      const sizeMap: any = {
        1: 62,
        2: 34,
        3: 26,
      };

      return (
        <div
          style={{
            marginTop:
              level === 1
                ? 20
                : 28,

            marginBottom: 18,

            textAlign:
              level === 1
                ? "center"
                : "left",
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
                  ? accentColor
                  : subInkColor,

              fontSize:
                sizeMap[level],

              lineHeight: 1.15,

              letterSpacing:
                "0.03em",

              fontStyle:
                level === 1
                  ? "normal"
                  : "italic",
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
      ? "rgba(210,170,120,0.12)"
      : "rgba(180,130,80,0.12)",

    padding: "2px 6px",

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
              letterFont,

            color: inkColor,

            fontSize: 22,

            lineHeight: 2,

            margin:
              "16px 0",

            textAlign:
              "justify",

            letterSpacing:
              "0.01em",

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
              accentColor,

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
              subInkColor,

            fontStyle:
              "italic",
          }}
        >
          {children}
        </em>
      ),

      li: ({ children }: any) => (
        <li
          style={{

            fontFamily:
              letterFont,

            color: inkColor,

            fontSize: 21,

            lineHeight: 1.9,

            margin:
              "8px 0",

            paddingLeft: 4,
          }}
        >
          {children}
        </li>
      ),

      ul: ({ children }: any) => (
        <ul
          style={{
            paddingLeft: 28,

            margin:
              "14px 0",
          }}
        >
          {children}
        </ul>
      ),

      ol: ({ children }: any) => (
        <ol
          style={{
            paddingLeft: 28,

            margin:
              "14px 0",
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
              "26px 0",

            padding:
              "18px 24px",

            borderLeft:
              `4px solid ${accentColor}`,

            background:
              isDark
                ? "rgba(255,255,255,0.03)"
                : "rgba(120,80,40,0.04)",

            borderRadius: 8,

            fontStyle:
              "italic",
          }}
        >
          {children}
        </blockquote>
      ),

      hr: () => (
        <div
          style={{
            margin: "42px 0",

            borderTop:
              `1px solid ${
                isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(80,50,30,0.15)"
              }`,
          }}
        />
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
    <div style={letterStyle}>

      <div style={sealStyle} />

      <KaTeXPostProcessor />

      <ReactMarkdown
        {...markdownProps}
      >
        {children}
      </ReactMarkdown>

    </div>
  );
}
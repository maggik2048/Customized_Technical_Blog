"use client";

import React from "react";

import ReactMarkdown from "react-markdown";

import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";

import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";

import {
  Tangerine,
  Cormorant_Garamond,
  EB_Garamond,
  Italianno,
} from "next/font/google";

import TableRenderer from "./TableRenderer";

import KaTeXPostProcessor from "./KaTeXPostProcessor";

/* =========================
   VINTAGE LETTER FONTS
========================= */

/* MAIN TITLE */
const titleFont = Tangerine({
  subsets: ["latin"],
  weight: ["700"],
});

/* SECTION HEADINGS */
const luxuryHeadingFont = Italianno({
  subsets: ["latin"],
  weight: ["400"],
});

/* BODY */
const bodyFont = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

/* SUBTEXT */
const serifFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
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

export default function RemarkLetterPageRenderer({
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
      ? "#171310"
      : "#f5efe3";

  const inkColor =
    isDark
      ? "#eadfcb"
      : "#2f241d";

  const fadedInkColor =
    isDark
      ? "#d9c2a7"
      : "#5c4737";

  /* DEEP WINE RED */
  const headingColor =
    isDark
      ? "#8f433f"
      : "#6a1f1b";

  const borderColor =
    isDark
      ? "rgba(255,255,255,0.06)"
      : "rgba(70,40,20,0.14)";

  /* =========================
     OLD PAPER TEXTURE
  ========================= */

  const letterStyle = {

    position: "relative" as const,

    overflow: "hidden" as const,

    maxWidth: 980,

    margin: "0 auto",

    padding:
      "74px 78px 88px 78px",

    borderRadius: 8,

    backgroundColor: paperColor,

    boxShadow: isDark
      ? `
        0 24px 80px rgba(0,0,0,0.5)
      `
      : `
        0 20px 70px rgba(80,40,10,0.18)
      `,

    border:
      `1px solid ${borderColor}`,

    /* PAPER FIBER TEXTURE */
    backgroundImage: isDark
      ? `

        radial-gradient(
          rgba(255,255,255,0.018) 1px,
          transparent 1px
        ),

        radial-gradient(
          rgba(255,255,255,0.012) 1px,
          transparent 1px
        ),

        linear-gradient(
          135deg,
          rgba(255,255,255,0.01),
          transparent 40%
        )

      `
      : `

        radial-gradient(
          rgba(120,90,50,0.055) 1px,
          transparent 1px
        ),

        radial-gradient(
          rgba(120,90,50,0.03) 1px,
          transparent 1px
        ),

        linear-gradient(
          135deg,
          rgba(255,255,255,0.38),
          transparent 40%
        )

      `,

    backgroundSize:
      `
        6px 6px,
        12px 12px,
        100% 100%
      `,
  };

  /* =========================
     SHADOW / FOLDS
  ========================= */

  const foldShadowStyle = {

    position: "absolute" as const,

    inset: 0,

    pointerEvents: "none" as const,

    background: `
      linear-gradient(
        115deg,
        rgba(0,0,0,0.07) 0%,
        rgba(0,0,0,0.02) 18%,
        transparent 34%
      ),

      linear-gradient(
        70deg,
        transparent 0%,
        rgba(0,0,0,0.05) 58%,
        transparent 72%
      )
    `,
  };

  /* =========================
     SEAL
  ========================= */

  const sealStyle = {

    position: "absolute" as const,

    top: 28,

    left: 38,

    width: 62,

    height: 62,

    borderRadius: "50%",

    border:
      `3px solid ${headingColor}`,

    opacity: 0.18,

    pointerEvents: "none" as const,
  };

  /* =========================
     HEADING RENDERER
  ========================= */

  const renderHeading =
    (level: number) =>
    ({ children }: any) => {

      const sizeMap: any = {
        1: 72,
        2: 58,
        3: 42,
      };

      const marginMap: any = {
        1: 28,
        2: 38,
        3: 24,
      };

      return (
        <div
          style={{
            marginTop:
              marginMap[level],

            marginBottom: 18,
          }}
        >
          <span

            className={
              level === 1
                ? titleFont.className
                : luxuryHeadingFont.className
            }

            style={{

              color:
                headingColor,

              fontSize:
                sizeMap[level],

              lineHeight: 1,

              letterSpacing:
                "0.02em",

              textShadow:
                isDark
                  ? "0 1px 2px rgba(0,0,0,0.45)"
                  : "0 1px 0 rgba(255,255,255,0.55)",

              display:
                "inline-block",

              transform:
                level === 1
                  ? "rotate(-1deg)"
                  : "rotate(-0.6deg)",
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
      ? "rgba(150,90,60,0.18)"
      : "rgba(140,90,40,0.10)",

    padding:
      "1px 6px",

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
          className={
            serifFont.className
          }
          style={{

            fontFamily:
              letterFont,

            color:
              inkColor,

            fontSize: 30,

            lineHeight: 1.7,

            margin:
              "18px 0",

            letterSpacing:
              "0.01em",

            whiteSpace:
              "pre-wrap",

            textAlign:
              "left",

            fontWeight: 500,
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
              headingColor,

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
              fadedInkColor,

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

            color:
              inkColor,

            fontSize: 28,

            lineHeight: 1.7,

            margin:
              "10px 0",
          }}
        >
          {children}
        </li>
      ),

      ul: ({ children }: any) => (
        <ul
          style={{
            paddingLeft: 34,

            margin:
              "18px 0",
          }}
        >
          {children}
        </ul>
      ),

      ol: ({ children }: any) => (
        <ol
          style={{
            paddingLeft: 34,

            margin:
              "18px 0",
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
              "28px 0",

            padding:
              "20px 28px",

            borderLeft:
              `3px solid ${headingColor}`,

            background:
              isDark
                ? "rgba(255,255,255,0.02)"
                : "rgba(120,80,50,0.04)",

            borderRadius: 4,

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
            margin:
              "46px 0",

            borderTop:
              `1px solid ${borderColor}`,
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

      {/* PAPER SHADOWS */}
      <div style={foldShadowStyle} />

      {/* WAX SEAL */}
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
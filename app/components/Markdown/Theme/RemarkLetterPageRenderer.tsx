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
  Monsieur_La_Doulaise,
} from "next/font/google";

import TableRenderer from "./TableRenderer";

import KaTeXPostProcessor from "./KaTeXPostProcessor";

/* =========================
   INK PROCESSING
========================= */

import { renderInkText }
from "./letterInkText";

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

/* BODY SUB STYLE */
const serifFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
});

/* BOLD CALLIGRAPHY */
const boldCalligraphyFont =
  Monsieur_La_Doulaise({
    subsets: ["latin"],
    weight: ["400"],
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

  /* DARK WINE RED */
  const headingColor =
    isDark
      ? "#8f433f"
      : "#6a1f1b";

  const borderColor =
    isDark
      ? "rgba(255,255,255,0.06)"
      : "rgba(70,40,20,0.14)";

  /* =========================
     LETTER PAPER
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

    /* REAL PAPER IMAGE */
    backgroundImage: `
      url("/images/letter2.png")
    `,

    backgroundSize:
      "330%",

    backgroundRepeat:
      "no-repeat",

    backgroundPosition:
      "center",

    boxShadow: isDark
      ? `
        0 24px 80px rgba(0,0,0,0.5)
      `
      : `
        0 20px 70px rgba(80,40,10,0.18)
      `,

    border:
      `1px solid ${borderColor}`,
  };

  /* =========================
     EXTRA DEPTH OVERLAY
  ========================= */

  const cinematicOverlayStyle = {

    position: "absolute" as const,

    inset: 0,

    pointerEvents: "none" as const,

    background: isDark
      ? `
        linear-gradient(
          140deg,
          rgba(0,0,0,0.16),
          transparent 35%
        )
      `
      : `
        linear-gradient(
          140deg,
          rgba(255,255,255,0.10),
          transparent 35%
        )
      `,
  };

  /* =========================
     WAX SEAL
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

    opacity: 0.14,

    pointerEvents: "none" as const,
  };

  /* =========================
     HEADING RENDERER
  ========================= */

  const renderHeading =
    (level: number) =>
    ({ children }: any) => {

      const sizeMap: any = {
        1: 74,
        2: 62,
        3: 46,
      };

      const marginMap: any = {
        1: 28,
        2: 42,
        3: 26,
      };

      const seed =
        level * 999;

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
                "0.01em",

              textShadow:
                isDark
                  ? "0 1px 2px rgba(0,0,0,0.45)"
                  : "0 1px 0 rgba(255,255,255,0.55)",

              display:
                "inline-block",

              transform:
                level === 1
                  ? "rotate(-1deg)"
                  : "rotate(-0.5deg)",
            }}
          >
            {
              typeof children === "string"
                ? renderInkText(
                    children,
                    seed,
                    {
                      color:
                        headingColor,

                      maxBlur: 0.28,

                      bleedChance: 0.34,

                      maxShiftY: 1.2,

                      maxShiftX: 0.6,
                    }
                  )
                : children
            }
          </span>
        </div>
      );
    };

  /* =========================
     HIGHLIGHT
  ========================= */

  const highlightStyle = {

    background: isDark
      ? "rgba(150,90,60,0.14)"
      : "rgba(140,90,40,0.08)",

    padding:
      "0px 4px",

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

      /* =========================
         PARAGRAPH
      ========================= */

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

            lineHeight: 1.72,

            margin:
              "18px 0",

            letterSpacing:
              "0.01em",

            whiteSpace:
              "pre-wrap",

            textAlign:
              "left",

            fontWeight: 500,

            textShadow:
              "0 0 0.2px rgba(0,0,0,0.2)",
          }}
        >
          {
            typeof children === "string"
              ? renderInkText(
                  children,
                  1400,
                  {
                    color:
                      inkColor,

                    maxBlur: 0.16,

                    bleedChance: 0.18,

                    maxShiftY: 0.45,

                    maxShiftX: 0.28,
                  }
                )
              : children
          }
        </p>
      ),

      /* =========================
         BOLD CALLIGRAPHY
      ========================= */

      strong: ({ children }: any) => (

        <strong
          className={
            boldCalligraphyFont.className
          }
          style={{
            ...highlightStyle,

            color:
              headingColor,

            fontWeight: 400,

            fontSize: "1.35em",

            lineHeight: 1,

            letterSpacing:
              "0.02em",

            display:
              "inline-block",

            transform:
              "rotate(-1deg)",

            padding:
              "0 4px",

            textShadow:
              isDark
                ? "0 1px 1px rgba(0,0,0,0.4)"
                : "0 1px 0 rgba(255,255,255,0.5)",
          }}
        >
          {
            typeof children === "string"
              ? renderInkText(
                  children,
                  700,
                  {
                    color:
                      headingColor,

                    maxBlur: 0.34,

                    bleedChance: 0.42,

                    maxShiftY: 1.2,

                    maxShiftX: 0.7,
                  }
                )
              : children
          }
        </strong>
      ),

      /* =========================
         EMPHASIS
      ========================= */

      em: ({ children }: any) => (

        <em
          style={{

            color:
              fadedInkColor,

            fontStyle:
              "italic",
          }}
        >
          {
            typeof children === "string"
              ? renderInkText(
                  children,
                  2222,
                  {
                    color:
                      fadedInkColor,

                    maxBlur: 0.12,

                    bleedChance: 0.14,
                  }
                )
              : children
          }
        </em>
      ),

      /* =========================
         LIST
      ========================= */

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
          {
            typeof children === "string"
              ? renderInkText(
                  children,
                  3100,
                  {
                    color:
                      inkColor,

                    maxBlur: 0.16,

                    bleedChance: 0.16,
                  }
                )
              : children
          }
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

      /* =========================
         BLOCKQUOTE
      ========================= */

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
                : "rgba(120,80,50,0.03)",

            borderRadius: 4,

            fontStyle:
              "italic",

            backdropFilter:
              "blur(1px)",
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

      {/* CINEMATIC LIGHT OVERLAY */}
      <div
        style={
          cinematicOverlayStyle
        }
      />

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


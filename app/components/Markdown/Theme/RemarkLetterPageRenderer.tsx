"use client";

import React, {
  memo,
  useMemo,
  useCallback,
} from "react";

import ReactMarkdown from "react-markdown";

import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";

import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";

import {
  Tangerine,
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
const titleFont = Monsieur_La_Doulaise({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap", // Added for performance
});

/* SUBTITLE / ALL BODY FONT */
const luxuryHeadingFont = Tangerine({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

/* STRONG / DECORATIVE */
const boldCalligraphyFont = Italianno({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

/* =========================
   BASE FONT
========================= */

const letterFont = `
  ${luxuryHeadingFont.style.fontFamily},
  "Times New Roman",
  serif
`;

/* =========================
   STATIC PLUGINS (frozen for performance)
========================= */

const remarkPlugins = [
  remarkMath,
  remarkGfm,
] as const;

const rehypePlugins = [
  rehypeKatex,
  rehypeRaw,
] as const;

/* =========================
   CONSTANTS - Extracted to prevent recreation
========================= */

const INK_OPTIONS_BASE = {
  paragraph: {
    maxBlur: 0.16,
    bleedChance: 0.18,
    maxShiftY: 0.45,
    maxShiftX: 0.28,
  },
  list: {
    maxBlur: 0.16,
    bleedChance: 0.16,
    maxShiftY: 0.7,
    maxShiftX: 0.45,
    maxRotation: 1.6,
    minScale: 0.992,
    maxScale: 1.012,
    opacityMin: 0.78,
    opacityMax: 1,
    kerningVariance: 0.045,
  },
  bullet: {
    maxBlur: 0.55,
    bleedChance: 0.62,
    maxShiftY: 1.8,
    maxShiftX: 1.4,
    maxRotation: 8,
    minScale: 0.82,
    maxScale: 1.35,
    opacityMin: 0.45,
    opacityMax: 1,
    kerningVariance: 0.12,
  },
  heading: {
    maxBlur: 0.28,
    bleedChance: 0.34,
    maxShiftY: 1.2,
    maxShiftX: 0.6,
  },
  strong: {
    maxBlur: 0.34,
    bleedChance: 0.42,
    maxShiftY: 1.2,
    maxShiftX: 0.7,
  },
  emphasis: {
    maxBlur: 0.12,
    bleedChance: 0.14,
  },
} as const;

const SIZES = {
  heading: { 1: 90, 2: 84, 3: 78 },
  margin: { 1: 28, 2: 42, 3: 26 },
  fontSize: { li: 49, p: 36 },
} as const;

/* =========================
   MEMOIZED INK TEXT
========================= */

interface InkTextProps {
  text: string;
  seed: number;
  options: any;
}

const InkText = memo(function InkText({
  text,
  seed,
  options,
}: InkTextProps) {
  return renderInkText(text, seed, options);
});

InkText.displayName = "InkText";

/* =========================
   UTILITY FUNCTIONS
========================= */

const createInkOptions = (color: string, baseOptions: any) => ({
  color,
  ...baseOptions,
});

/* =========================
   COMPONENT
========================= */

interface RemarkLetterPageRendererProps {
  children: string;
  markdownComponents?: any;
  isDark?: boolean;
  CodeBlock?: React.ComponentType<any>;
}

export default function RemarkLetterPageRenderer({
  children,
  markdownComponents = {},
  isDark = false,
  CodeBlock,
}: RemarkLetterPageRendererProps) {

  /* =========================
     COLORS - Memoized
  ========================= */
  const colors = useMemo(
    () => ({
      paperColor: isDark ? "#171310" : "#f5efe3",
      inkColor: isDark ? "#eadfcb" : "#2f241d",
      fadedInkColor: isDark ? "#d9c2a7" : "#5c4737",
      headingColor: isDark ? "#8f433f" : "#6a1f1b",
      borderColor: isDark 
        ? "rgba(255,255,255,0.06)" 
        : "rgba(70,40,20,0.14)",
      bulletColor: isDark 
        ? "rgba(230,210,190,0.92)" 
        : "rgba(55,25,15,0.92)",
    }),
    [isDark]
  );

  /* =========================
     INK OPTIONS - Memoized
  ========================= */
  const paragraphInk = useMemo(
    () => createInkOptions(colors.inkColor, INK_OPTIONS_BASE.paragraph),
    [colors.inkColor]
  );

  const listInk = useMemo(
    () => createInkOptions(colors.inkColor, INK_OPTIONS_BASE.list),
    [colors.inkColor]
  );

  const bulletInk = useMemo(
    () => createInkOptions(colors.bulletColor, INK_OPTIONS_BASE.bullet),
    [colors.bulletColor]
  );

  const headingInk = useMemo(
    () => createInkOptions(colors.headingColor, INK_OPTIONS_BASE.heading),
    [colors.headingColor]
  );

  const strongInk = useMemo(
    () => createInkOptions(colors.headingColor, INK_OPTIONS_BASE.strong),
    [colors.headingColor]
  );

  const emphasisInk = useMemo(
    () => createInkOptions(colors.fadedInkColor, INK_OPTIONS_BASE.emphasis),
    [colors.fadedInkColor]
  );

  /* =========================
     STYLES - Memoized
  ========================= */
  const letterStyle = useMemo(
    () => ({
      position: "relative" as const,
      overflow: "hidden" as const,
      maxWidth: 980,
      margin: "0 auto",
      padding: "74px 78px 88px 78px",
      borderRadius: 8,
      backgroundColor: colors.paperColor,
      backgroundImage: `url("/images/letter2.png")`,
      backgroundSize: "330%",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      boxShadow: isDark
        ? "0 24px 80px rgba(0,0,0,0.5)"
        : "0 20px 70px rgba(80,40,10,0.18)",
      border: `1px solid ${colors.borderColor}`,
      contain: "layout paint style" as const,
    }),
    [colors.paperColor, colors.borderColor, isDark]
  );

  const cinematicOverlayStyle = useMemo(
    () => ({
      position: "absolute" as const,
      inset: 0,
      pointerEvents: "none" as const,
      background: isDark
        ? "linear-gradient(140deg, rgba(0,0,0,0.16), transparent 35%)"
        : "linear-gradient(140deg, rgba(255,255,255,0.10), transparent 35%)",
    }),
    [isDark]
  );

  const sealStyle = useMemo(
    () => ({
      position: "absolute" as const,
      top: 28,
      left: 38,
      width: 62,
      height: 62,
      borderRadius: "50%",
      border: `3px solid ${colors.headingColor}`,
      opacity: 0.14,
      pointerEvents: "none" as const,
    }),
    [colors.headingColor]
  );

  const highlightStyle = useMemo(
    () => ({
      background: isDark
        ? "rgba(150,90,60,0.14)"
        : "rgba(140,90,40,0.08)",
      padding: "0px 4px",
      borderRadius: 4,
    }),
    [isDark]
  );

  /* =========================
     HEADING RENDERER - useCallback
  ========================= */
  const renderHeading = useCallback(
    (level: number) => {
      const HeadingComponent = ({ children }: any) => {
        const seed = level * 999;
        const size = SIZES.heading[level as keyof typeof SIZES.heading];
        const marginTop = SIZES.margin[level as keyof typeof SIZES.margin];
        const isLevel1 = level === 1;
        
        return (
          <div style={{ marginTop, marginBottom: 18 }}>
            <span
              className={isLevel1 ? titleFont.className : luxuryHeadingFont.className}
              style={{
                color: colors.headingColor,
                fontSize: size,
                lineHeight: 1,
                letterSpacing: "0.01em",
                textShadow: isDark
                  ? "0 1px 2px rgba(0,0,0,0.45)"
                  : "0 1px 0 rgba(255,255,255,0.55)",
                display: "inline-block",
                transform: isLevel1 ? "rotate(-1deg)" : "rotate(-0.5deg)",
              }}
            >
              {typeof children === "string" ? (
                <InkText
                  text={children}
                  seed={seed}
                  options={headingInk}
                />
              ) : (
                children
              )}
            </span>
          </div>
        );
      };
      HeadingComponent.displayName = `Heading${level}`;
      return HeadingComponent;
    },
    [colors.headingColor, isDark, headingInk]
  );

  /* =========================
     MEMOIZED RENDERERS
  ========================= */
  const ParagraphRenderer = useCallback(
    ({ children }: any) => (
      <p
        style={{
          fontFamily: letterFont,
          color: colors.inkColor,
          fontSize: SIZES.fontSize.p,
          lineHeight: 1.0,
          margin: "18px 0",
          letterSpacing: "0.02em",
          whiteSpace: "pre-wrap",
          textAlign: "left",
          fontWeight: 700,
          textShadow: "0 0 0.2px rgba(0,0,0,0.2)",
        }}
      >
        {typeof children === "string" ? (
          <InkText text={children} seed={1400} options={paragraphInk} />
        ) : (
          children
        )}
      </p>
    ),
    [colors.inkColor, paragraphInk]
  );

  const StrongRenderer = useCallback(
    ({ children }: any) => (
      <strong
        className={boldCalligraphyFont.className}
        style={{
          ...highlightStyle,
          color: colors.headingColor,
          fontWeight: 400,
          fontSize: "1.5em",
          lineHeight: 1,
          letterSpacing: "0.02em",
          display: "inline-block",
          transform: "rotate(-1deg)",
          padding: "0 4px",
          textShadow: isDark
            ? "0 1px 1px rgba(0,0,0,0.4)"
            : "0 1px 0 rgba(255,255,255,0.5)",
        }}
      >
        {typeof children === "string" ? (
          <InkText text={children} seed={700} options={strongInk} />
        ) : (
          children
        )}
      </strong>
    ),
    [colors.headingColor, highlightStyle, isDark, strongInk]
  );

  const EmphasisRenderer = useCallback(
    ({ children }: any) => (
      <em
        style={{
          color: colors.fadedInkColor,
          fontStyle: "italic",
          fontFamily: letterFont,
        }}
      >
        {typeof children === "string" ? (
          <InkText text={children} seed={2222} options={emphasisInk} />
        ) : (
          children
        )}
      </em>
    ),
    [colors.fadedInkColor, emphasisInk]
  );

  const ListItemRenderer = useCallback(
    ({ children, index }: any) => (
      <li
        style={{
          listStyle: "none",
          position: "relative",
          fontFamily: letterFont,
          color: colors.inkColor,
          fontSize: SIZES.fontSize.li,
          lineHeight: 1.0,
          margin: "10px 0",
          paddingLeft: 34,
          fontWeight: 700,
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 0,
            top: "0.16em",
            lineHeight: 1,
            fontSize: "0.95em",
            pointerEvents: "none",
            mixBlendMode: "multiply",
          }}
        >
          <InkText text="•" seed={9000 + (index || 0)} options={bulletInk} />
        </span>
        <span>
          {typeof children === "string" ? (
            <InkText text={children} seed={3100 + (index || 0)} options={listInk} />
          ) : (
            children
          )}
        </span>
      </li>
    ),
    [colors.inkColor, bulletInk, listInk]
  );

  const BlockquoteRenderer = useCallback(
    ({ children }: any) => (
      <blockquote
        style={{
          margin: "28px 0",
          padding: "20px 28px",
          borderLeft: `3px solid ${colors.headingColor}`,
          background: isDark
            ? "rgba(255,255,255,0.02)"
            : "rgba(120,80,50,0.03)",
          borderRadius: 4,
          fontStyle: "italic",
          backdropFilter: "blur(1px)",
          fontFamily: letterFont,
        }}
      >
        {children}
      </blockquote>
    ),
    [colors.headingColor, isDark]
  );

  const HrRenderer = useCallback(
    () => (
      <div
        style={{
          margin: "46px 0",
          borderTop: `1px solid ${colors.borderColor}`,
        }}
      />
    ),
    [colors.borderColor]
  );

  /* =========================
     MARKDOWN COMPONENTS - Memoized
  ========================= */
  const components = useMemo(
    () => ({
      ...markdownComponents,
      code: CodeBlock,
      h1: renderHeading(1),
      h2: renderHeading(2),
      h3: renderHeading(3),
      p: ParagraphRenderer,
      strong: StrongRenderer,
      em: EmphasisRenderer,
      li: ListItemRenderer,
      ul: ({ children }: any) => (
        <ul style={{ paddingLeft: 0, margin: "18px 0" }}>{children}</ul>
      ),
      ol: ({ children }: any) => (
        <ol style={{ paddingLeft: 0, margin: "18px 0" }}>{children}</ol>
      ),
      blockquote: BlockquoteRenderer,
      hr: HrRenderer,
      table: TableRenderer,
      thead: TableRenderer.Thead,
      tbody: TableRenderer.Tbody,
      tr: TableRenderer.Tr,
      th: TableRenderer.Th,
      td: TableRenderer.Td,
    }),
    [
      markdownComponents,
      CodeBlock,
      renderHeading,
      ParagraphRenderer,
      StrongRenderer,
      EmphasisRenderer,
      ListItemRenderer,
      BlockquoteRenderer,
      HrRenderer,
    ]
  );

  return (
    <div style={letterStyle}>
      <div style={cinematicOverlayStyle} />
      <div style={sealStyle} />
      <KaTeXPostProcessor />
      <ReactMarkdown
        remarkPlugins={remarkPlugins as any}
        rehypePlugins={rehypePlugins as any}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
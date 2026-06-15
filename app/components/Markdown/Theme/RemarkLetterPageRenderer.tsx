"use client";

import React, {
  memo,
  useMemo,
  useCallback,
  lazy,
  Suspense,
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

// Lazy load heavy components
const TableRenderer = lazy(() => import("./TableRenderer"));
const KaTeXPostProcessor = lazy(() => import("./KaTeXPostProcessor"));
const { renderInkText } = await import("./letterInkText");

/* =========================
   FONT OPTIMIZATIONS
========================= */

const titleFont = Monsieur_La_Doulaise({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: true, // Added preload
});

const luxuryHeadingFont = Tangerine({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  preload: true,
});

const boldCalligraphyFont = Italianno({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false, // Only preload critical fonts
});

/* =========================
   STATIC CONSTANTS (Frozen)
========================= */

const LETTER_FONT = `${luxuryHeadingFont.style.fontFamily}, "Times New Roman", serif`;

const REMARK_PLUGINS = [remarkMath, remarkGfm] as const;
const REHYPE_PLUGINS = [rehypeKatex, rehypeRaw] as const;

// Freeze to prevent any modifications
const INK_OPTIONS_BASE = Object.freeze({
  paragraph: Object.freeze({
    maxBlur: 0.16,
    bleedChance: 0.18,
    maxShiftY: 0.45,
    maxShiftX: 0.28,
  }),
  list: Object.freeze({
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
  }),
  bullet: Object.freeze({
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
  }),
  heading: Object.freeze({
    maxBlur: 0.28,
    bleedChance: 0.34,
    maxShiftY: 1.2,
    maxShiftX: 0.6,
  }),
  strong: Object.freeze({
    maxBlur: 0.34,
    bleedChance: 0.42,
    maxShiftY: 1.2,
    maxShiftX: 0.7,
  }),
  emphasis: Object.freeze({
    maxBlur: 0.12,
    bleedChance: 0.14,
  }),
});

const SIZES = Object.freeze({
  heading: Object.freeze({ 1: 90, 2: 84, 3: 78 }),
  margin: Object.freeze({ 1: 28, 2: 42, 3: 26 }),
  fontSize: Object.freeze({ li: 49, p: 36 }),
});

// Pre-computed color configurations
const COLOR_CONFIGS = Object.freeze({
  light: Object.freeze({
    paperColor: "#f5efe3",
    inkColor: "#2f241d",
    fadedInkColor: "#5c4737",
    headingColor: "#6a1f1b",
    borderColor: "rgba(70,40,20,0.14)",
    bulletColor: "rgba(55,25,15,0.92)",
    shadowColor: "0 20px 70px rgba(80,40,10,0.18)",
    textShadow: "0 1px 0 rgba(255,255,255,0.55)",
    strongTextShadow: "0 1px 0 rgba(255,255,255,0.5)",
    gradientOverlay: "linear-gradient(140deg, rgba(255,255,255,0.10), transparent 35%)",
    blockquoteBg: "rgba(120,80,50,0.03)",
    highlightBg: "rgba(140,90,40,0.08)",
  }),
  dark: Object.freeze({
    paperColor: "#171310",
    inkColor: "#eadfcb",
    fadedInkColor: "#d9c2a7",
    headingColor: "#8f433f",
    borderColor: "rgba(255,255,255,0.06)",
    bulletColor: "rgba(230,210,190,0.92)",
    shadowColor: "0 24px 80px rgba(0,0,0,0.5)",
    textShadow: "0 1px 2px rgba(0,0,0,0.45)",
    strongTextShadow: "0 1px 1px rgba(0,0,0,0.4)",
    gradientOverlay: "linear-gradient(140deg, rgba(0,0,0,0.16), transparent 35%)",
    blockquoteBg: "rgba(255,255,255,0.02)",
    highlightBg: "rgba(150,90,60,0.14)",
  }),
});

/* =========================
   MEMOIZED COMPONENTS
========================= */

interface InkTextProps {
  text: string;
  seed: number;
  options: any;
}

// Use React.memo with custom comparison
const InkText = memo(function InkText({ text, seed, options }: InkTextProps) {
  return renderInkText(text, seed, options);
}, (prev, next) => {
  // Custom equality check for better performance
  return prev.text === next.text && 
         prev.seed === next.seed && 
         JSON.stringify(prev.options) === JSON.stringify(next.options);
});

InkText.displayName = "InkText";

// Loading fallback for lazy components
const TableFallback = () => <div className="table-loading" style={{ minHeight: 100 }} />;

/* =========================
   UTILITY FUNCTIONS
========================= */

const createInkOptions = (color: string, baseOptions: any) => {
  // Use Object.assign instead of spread for better performance
  return Object.assign({}, baseOptions, { color });
};

// Pre-bound renderer creators
const createHeadingRenderer = (level: number, colors: any, isDark: boolean, headingInk: any) => {
  const seed = level * 999;
  const size = SIZES.heading[level as keyof typeof SIZES.heading];
  const marginTop = SIZES.margin[level as keyof typeof SIZES.margin];
  const isLevel1 = level === 1;
  const rotation = isLevel1 ? "rotate(-1deg)" : "rotate(-0.5deg)";
  
  return memo(function HeadingRenderer({ children }: any) {
    return (
      <div style={{ marginTop, marginBottom: 18 }}>
        <span
          className={isLevel1 ? titleFont.className : luxuryHeadingFont.className}
          style={{
            color: colors.headingColor,
            fontSize: size,
            lineHeight: 1,
            letterSpacing: "0.01em",
            textShadow: colors.textShadow,
            display: "inline-block",
            transform: rotation,
          }}
        >
          {typeof children === "string" ? (
            <InkText text={children} seed={seed} options={headingInk} />
          ) : (
            children
          )}
        </span>
      </div>
    );
  });
};

/* =========================
   MAIN COMPONENT
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

  // Get pre-computed color config
  const colors = COLOR_CONFIGS[isDark ? "dark" : "light"];

  /* =========================
     INK OPTIONS (Memoized)
  ========================= */
  const inkOptions = useMemo(() => ({
    paragraph: createInkOptions(colors.inkColor, INK_OPTIONS_BASE.paragraph),
    list: createInkOptions(colors.inkColor, INK_OPTIONS_BASE.list),
    bullet: createInkOptions(colors.bulletColor, INK_OPTIONS_BASE.bullet),
    heading: createInkOptions(colors.headingColor, INK_OPTIONS_BASE.heading),
    strong: createInkOptions(colors.headingColor, INK_OPTIONS_BASE.strong),
    emphasis: createInkOptions(colors.fadedInkColor, INK_OPTIONS_BASE.emphasis),
  }), [colors]);

  /* =========================
     STYLES (Memoized with Object.freeze)
  ========================= */
  const styles = useMemo(() => Object.freeze({
    letter: {
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
      boxShadow: colors.shadowColor,
      border: `1px solid ${colors.borderColor}`,
      contain: "layout paint style" as const,
    },
    cinematicOverlay: {
      position: "absolute" as const,
      inset: 0,
      pointerEvents: "none" as const,
      background: colors.gradientOverlay,
    },
    seal: {
      position: "absolute" as const,
      top: 28,
      left: 38,
      width: 62,
      height: 62,
      borderRadius: "50%",
      border: `3px solid ${colors.headingColor}`,
      opacity: 0.14,
      pointerEvents: "none" as const,
    },
    highlight: {
      background: colors.highlightBg,
      padding: "0px 4px",
      borderRadius: 4,
    },
  }), [colors]);

  /* =========================
     RENDERERS (Created once per color change)
  ========================= */
  const renderers = useMemo(() => ({
    heading1: createHeadingRenderer(1, colors, isDark, inkOptions.heading),
    heading2: createHeadingRenderer(2, colors, isDark, inkOptions.heading),
    heading3: createHeadingRenderer(3, colors, isDark, inkOptions.heading),
  }), [colors, isDark, inkOptions.heading]);

  /* =========================
     MEMOIZED RENDERERS
  ========================= */
  const ParagraphRenderer = useMemo(() => memo(function ParagraphRenderer({ children }: any) {
    return (
      <p
        style={{
          fontFamily: LETTER_FONT,
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
          <InkText text={children} seed={1400} options={inkOptions.paragraph} />
        ) : (
          children
        )}
      </p>
    );
  }), [colors.inkColor, inkOptions.paragraph]);

  const StrongRenderer = useMemo(() => memo(function StrongRenderer({ children }: any) {
    return (
      <strong
        className={boldCalligraphyFont.className}
        style={{
          ...styles.highlight,
          color: colors.headingColor,
          fontWeight: 400,
          fontSize: "1.5em",
          lineHeight: 1,
          letterSpacing: "0.02em",
          display: "inline-block",
          transform: "rotate(-1deg)",
          padding: "0 4px",
          textShadow: colors.strongTextShadow,
        }}
      >
        {typeof children === "string" ? (
          <InkText text={children} seed={700} options={inkOptions.strong} />
        ) : (
          children
        )}
      </strong>
    );
  }), [colors.headingColor, colors.strongTextShadow, styles.highlight, inkOptions.strong]);

  const EmphasisRenderer = useMemo(() => memo(function EmphasisRenderer({ children }: any) {
    return (
      <em
        style={{
          color: colors.fadedInkColor,
          fontStyle: "italic",
          fontFamily: LETTER_FONT,
        }}
      >
        {typeof children === "string" ? (
          <InkText text={children} seed={2222} options={inkOptions.emphasis} />
        ) : (
          children
        )}
      </em>
    );
  }), [colors.fadedInkColor, inkOptions.emphasis]);

  const ListItemRenderer = useMemo(() => memo(function ListItemRenderer({ children, index }: any) {
    return (
      <li
        style={{
          listStyle: "none",
          position: "relative",
          fontFamily: LETTER_FONT,
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
          <InkText text="•" seed={9000 + (index || 0)} options={inkOptions.bullet} />
        </span>
        <span>
          {typeof children === "string" ? (
            <InkText text={children} seed={3100 + (index || 0)} options={inkOptions.list} />
          ) : (
            children
          )}
        </span>
      </li>
    );
  }), [colors.inkColor, inkOptions.bullet, inkOptions.list]);

  const BlockquoteRenderer = useMemo(() => memo(function BlockquoteRenderer({ children }: any) {
    return (
      <blockquote
        style={{
          margin: "28px 0",
          padding: "20px 28px",
          borderLeft: `3px solid ${colors.headingColor}`,
          background: colors.blockquoteBg,
          borderRadius: 4,
          fontStyle: "italic",
          backdropFilter: "blur(1px)",
          fontFamily: LETTER_FONT,
        }}
      >
        {children}
      </blockquote>
    );
  }), [colors.headingColor, colors.blockquoteBg]);

  const HrRenderer = useMemo(() => memo(function HrRenderer() {
    return (
      <div
        style={{
          margin: "46px 0",
          borderTop: `1px solid ${colors.borderColor}`,
        }}
      />
    );
  }), [colors.borderColor]);

  const ListWrapper = useMemo(() => memo(function ListWrapper({ children, isOrdered = false }: any) {
    const Component = isOrdered ? 'ol' : 'ul';
    return React.createElement(Component, {
      style: { paddingLeft: 0, margin: "18px 0" },
      children
    });
  }), []);

  /* =========================
     MARKDOWN COMPONENTS
  ========================= */
  const components = useMemo(() => ({
    ...markdownComponents,
    code: CodeBlock,
    h1: renderers.heading1,
    h2: renderers.heading2,
    h3: renderers.heading3,
    p: ParagraphRenderer,
    strong: StrongRenderer,
    em: EmphasisRenderer,
    li: ListItemRenderer,
    ul: (props: any) => <ListWrapper {...props} isOrdered={false} />,
    ol: (props: any) => <ListWrapper {...props} isOrdered={true} />,
    blockquote: BlockquoteRenderer,
    hr: HrRenderer,
    table: TableRenderer,
    thead: TableRenderer.Thead,
    tbody: TableRenderer.Tbody,
    tr: TableRenderer.Tr,
    th: TableRenderer.Th,
    td: TableRenderer.Td,
  }), [
    markdownComponents,
    CodeBlock,
    renderers,
    ParagraphRenderer,
    StrongRenderer,
    EmphasisRenderer,
    ListItemRenderer,
    ListWrapper,
    BlockquoteRenderer,
    HrRenderer,
  ]);

  return (
    <div style={styles.letter}>
      <div style={styles.cinematicOverlay} />
      <div style={styles.seal} />
      <Suspense fallback={null}>
        <KaTeXPostProcessor />
      </Suspense>
      <Suspense fallback={<TableFallback />}>
        <ReactMarkdown
          remarkPlugins={REMARK_PLUGINS as any}
          rehypePlugins={REHYPE_PLUGINS as any}
          components={components}
        >
          {children}
        </ReactMarkdown>
      </Suspense>
    </div>
  );
}

// Export memoized version of the main component
export const MemoizedRemarkLetterPageRenderer = memo(RemarkLetterPageRenderer);
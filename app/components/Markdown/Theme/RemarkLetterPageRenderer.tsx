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

// Local imports
import RemarkLetterPageBackgroundRenderer from "./RemarkLetterPagebackgroundRenderer";

// Lazy load heavy components
const TableRenderer = lazy(() => import("./TableRenderer"));
const KaTeXPostProcessor = lazy(() => import("./KaTeXPostProcessor"));

// Dynamic import with loading strategy
const { renderInkText } = await import("./letterInkText");

/* =========================
   FONT OPTIMIZATIONS
========================= */

const titleFont = Monsieur_La_Doulaise({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: true,
  adjustFontFallback: false,
});

const luxuryHeadingFont = Tangerine({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  preload: true,
  adjustFontFallback: false,
});

const boldCalligraphyFont = Italianno({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

/* =========================
   STATIC CONSTANTS (Frozen)
========================= */

const LETTER_FONT = `${luxuryHeadingFont.style.fontFamily}, "Times New Roman", serif`;

const REMARK_PLUGINS = [remarkMath, remarkGfm] as const;
const REHYPE_PLUGINS = [rehypeKatex, rehypeRaw] as const;

// Optimized ink options with smaller numbers for better performance
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

// Pre-computed color configurations with CSS variables for better performance
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

// Optimized InkText with better memoization
const InkText = memo(function InkText({ text, seed, options }: InkTextProps) {
  return renderInkText(text, seed, options);
}, (prev, next) => {
  // Faster comparison - avoid JSON.stringify when possible
  if (prev.text !== next.text || prev.seed !== next.seed) return false;
  
  // Only compare critical options properties
  const prevOpts = prev.options;
  const nextOpts = next.options;
  return prevOpts.color === nextOpts.color && 
         prevOpts.maxBlur === nextOpts.maxBlur &&
         prevOpts.bleedChance === nextOpts.bleedChance;
});

InkText.displayName = "InkText";

// Optimized loading fallback
const TableFallback = memo(() => (
  <div className="table-loading" style={{ minHeight: 100, willChange: "auto" }} />
));
TableFallback.displayName = "TableFallback";

/* =========================
   UTILITY FUNCTIONS
========================= */

const createInkOptions = (color: string, baseOptions: any) => {
  return Object.assign({}, baseOptions, { color });
};

// Pre-bound heading style generator
const getHeadingStyle = (level: number, colors: any, isLevel1: boolean) => ({
  color: colors.headingColor,
  fontSize: SIZES.heading[level as keyof typeof SIZES.heading],
  lineHeight: 1,
  letterSpacing: "0.01em",
  textShadow: colors.textShadow,
  display: "inline-block" as const,
  transform: isLevel1 ? "rotate(-1deg)" : "rotate(-0.5deg)",
});

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
     STYLES (Memoized with useMemo)
     NOTE: Background-related styles (letter, cinematicOverlay, seal) 
     are now handled by RemarkLetterPageBackgroundRenderer
  ========================= */
  const highlightStyle = useMemo(() => ({
    background: colors.highlightBg,
    borderRadius: 4,
    padding: "2px 4px",
  }), [colors.highlightBg]);

  /* =========================
     OPTIMIZED RENDERERS
  ========================= */
  
  const HeadingRenderer = useCallback((level: number) => {
    const seed = level * 999;
    const size = SIZES.heading[level as keyof typeof SIZES.heading];
    const marginTop = SIZES.margin[level as keyof typeof SIZES.margin];
    const isLevel1 = level === 1;
    const className = isLevel1 ? titleFont.className : luxuryHeadingFont.className;
    const headingStyle = getHeadingStyle(level, colors, isLevel1);
    
    return memo(function HeadingRenderer({ children }: any) {
      return (
        <div style={{ marginTop, marginBottom: 18 }}>
          <span className={className} style={headingStyle}>
            {typeof children === "string" ? (
              <InkText text={children} seed={seed} options={inkOptions.heading} />
            ) : (
              children
            )}
          </span>
        </div>
      );
    });
  }, [colors, inkOptions.heading]);

  // Simplified ParagraphRenderer with inline styles object reference
  const paragraphStyle = useMemo(() => ({
    fontFamily: LETTER_FONT,
    color: colors.inkColor,
    fontSize: SIZES.fontSize.p,
    lineHeight: 1.0,
    margin: "18px 0",
    letterSpacing: "0.02em",
    whiteSpace: "pre-wrap" as const,
    textAlign: "left" as const,
    fontWeight: 700,
    textShadow: "0 0 0.2px rgba(0,0,0,0.2)",
  }), [colors.inkColor]);
  
  const ParagraphRenderer = useMemo(() => memo(function ParagraphRenderer({ children }: any) {
    return (
      <p style={paragraphStyle}>
        {typeof children === "string" ? (
          <InkText text={children} seed={1400} options={inkOptions.paragraph} />
        ) : (
          children
        )}
      </p>
    );
  }), [paragraphStyle, inkOptions.paragraph]);

  // Merge styles for StrongRenderer
  const strongStyle = useMemo(() => ({
    ...highlightStyle,
    color: colors.headingColor,
    fontWeight: 400,
    fontSize: "1.5em",
    lineHeight: 1,
    letterSpacing: "0.02em",
    display: "inline-block" as const,
    transform: "rotate(-1deg)",
    padding: "0 4px",
    textShadow: colors.strongTextShadow,
  }), [colors.headingColor, colors.strongTextShadow, highlightStyle]);

  const StrongRenderer = useMemo(() => memo(function StrongRenderer({ children }: any) {
    return (
      <strong className={boldCalligraphyFont.className} style={strongStyle}>
        {typeof children === "string" ? (
          <InkText text={children} seed={700} options={inkOptions.strong} />
        ) : (
          children
        )}
      </strong>
    );
  }), [strongStyle, inkOptions.strong]);

  const EmphasisRenderer = useMemo(() => memo(function EmphasisRenderer({ children }: any) {
    const emStyle = {
      color: colors.fadedInkColor,
      fontStyle: "italic" as const,
      fontFamily: LETTER_FONT,
    };
    return (
      <em style={emStyle}>
        {typeof children === "string" ? (
          <InkText text={children} seed={2222} options={inkOptions.emphasis} />
        ) : (
          children
        )}
      </em>
    );
  }), [colors.fadedInkColor, inkOptions.emphasis]);

  const ListItemRenderer = useMemo(() => memo(function ListItemRenderer({ children, index }: any) {
    const bulletSeed = 9000 + (index || 0);
    const textSeed = 3100 + (index || 0);
    const liStyle = {
      listStyle: "none" as const,
      position: "relative" as const,
      fontFamily: LETTER_FONT,
      color: colors.inkColor,
      fontSize: SIZES.fontSize.li,
      lineHeight: 1.0,
      margin: "10px 0",
      paddingLeft: 34,
      fontWeight: 700,
    };
    const bulletStyle = {
      position: "absolute" as const,
      left: 0,
      top: "0.16em",
      lineHeight: 1,
      fontSize: "0.95em",
      pointerEvents: "none" as const,
      mixBlendMode: "multiply" as const,
    };
    
    return (
      <li style={liStyle}>
        <span style={bulletStyle}>
          <InkText text="•" seed={bulletSeed} options={inkOptions.bullet} />
        </span>
        <span>
          {typeof children === "string" ? (
            <InkText text={children} seed={textSeed} options={inkOptions.list} />
          ) : (
            children
          )}
        </span>
      </li>
    );
  }), [colors.inkColor, inkOptions.bullet, inkOptions.list]);

  const BlockquoteRenderer = useMemo(() => memo(function BlockquoteRenderer({ children }: any) {
    const bqStyle = {
      margin: "28px 0",
      padding: "20px 28px",
      borderLeft: `3px solid ${colors.headingColor}`,
      background: colors.blockquoteBg,
      borderRadius: 4,
      fontStyle: "italic" as const,
      backdropFilter: "blur(1px)",
      fontFamily: LETTER_FONT,
    };
    return <blockquote style={bqStyle}>{children}</blockquote>;
  }), [colors.headingColor, colors.blockquoteBg]);

  const HrRenderer = useMemo(() => memo(function HrRenderer() {
    return <div style={{ margin: "46px 0", borderTop: `1px solid ${colors.borderColor}` }} />;
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
    h1: HeadingRenderer(1),
    h2: HeadingRenderer(2),
    h3: HeadingRenderer(3),
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
    HeadingRenderer,
    ParagraphRenderer,
    StrongRenderer,
    EmphasisRenderer,
    ListItemRenderer,
    ListWrapper,
    BlockquoteRenderer,
    HrRenderer,
  ]);

  return (
    <RemarkLetterPageBackgroundRenderer
      isDark={isDark}
      headingColor={colors.headingColor}
    >
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
    </RemarkLetterPageBackgroundRenderer>
  );
}

// Export memoized version with display name
export const MemoizedRemarkLetterPageRenderer = memo(RemarkLetterPageRenderer);
MemoizedRemarkLetterPageRenderer.displayName = "MemoizedRemarkLetterPageRenderer";
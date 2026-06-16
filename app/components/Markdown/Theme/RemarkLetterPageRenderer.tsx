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

// Local imports
import RemarkLetterPageBackgroundRenderer from "./RemarkLetterPagebackgroundRenderer";
import {
  titleFont,
  luxuryHeadingFont,
  boldCalligraphyFont,
  SIZES,
  useLetterStyles,
} from "./RemarkLetterPageStyleRenderer";

// Import TableRenderer directly instead of lazy loading
import TableRenderer from "./TableRenderer";

// Lazy load other heavy components
const KaTeXPostProcessor = lazy(() => import("./KaTeXPostProcessor"));

// Dynamic import with loading strategy
const { renderInkText } = await import("./letterInkText");

/* =========================
   STATIC CONSTANTS
========================= */

const REMARK_PLUGINS = [remarkMath, remarkGfm] as const;
const REHYPE_PLUGINS = [rehypeKatex, rehypeRaw] as const;

/* =========================
   MEMOIZED COMPONENTS
========================= */

interface InkTextProps {
  text: string;
  seed: number;
  options: any;
}

const InkText = memo(function InkText({ text, seed, options }: InkTextProps) {
  return renderInkText(text, seed, options);
}, (prev, next) => {
  if (prev.text !== next.text || prev.seed !== next.seed) return false;
  const prevOpts = prev.options;
  const nextOpts = next.options;
  return prevOpts.color === nextOpts.color && 
         prevOpts.maxBlur === nextOpts.maxBlur &&
         prevOpts.bleedChance === nextOpts.bleedChance;
});

InkText.displayName = "InkText";

const TableFallback = memo(() => (
  <div className="table-loading" style={{ minHeight: 100, willChange: "auto" }} />
));
TableFallback.displayName = "TableFallback";

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

  const {
    colors,
    inkOptions,
    paragraphStyle,
    strongStyle,
    emphasisStyle,
    listItemStyle,
    bulletStyle,
    blockquoteStyle,
    hrStyle,
    listWrapperStyle,
    highlightStyle,
    getHeadingStyleForLevel,
  } = useLetterStyles(isDark);

  /* =========================
     OPTIMIZED RENDERERS
  ========================= */
  
  const HeadingRenderer = useCallback((level: number) => {
    const seed = level * 999;
    const marginTop = SIZES.margin[level as keyof typeof SIZES.margin];
    const isLevel1 = level === 1;
    const className = isLevel1 ? titleFont.className : luxuryHeadingFont.className;
    const headingStyle = getHeadingStyleForLevel(level, isLevel1);
    
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
  }, [getHeadingStyleForLevel, inkOptions.heading]);

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
    return (
      <em style={emphasisStyle}>
        {typeof children === "string" ? (
          <InkText text={children} seed={2222} options={inkOptions.emphasis} />
        ) : (
          children
        )}
      </em>
    );
  }), [emphasisStyle, inkOptions.emphasis]);

  const ListItemRenderer = useMemo(() => memo(function ListItemRenderer({ children, index }: any) {
    const bulletSeed = 9000 + (index || 0);
    const textSeed = 3100 + (index || 0);
    
    return (
      <li style={listItemStyle}>
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
  }), [listItemStyle, bulletStyle, inkOptions.bullet, inkOptions.list]);

  const BlockquoteRenderer = useMemo(() => memo(function BlockquoteRenderer({ children }: any) {
    return <blockquote style={blockquoteStyle}>{children}</blockquote>;
  }), [blockquoteStyle]);

  const HrRenderer = useMemo(() => memo(function HrRenderer() {
    return <div style={hrStyle} />;
  }), [hrStyle]);

  const ListWrapper = useMemo(() => memo(function ListWrapper({ children, isOrdered = false }: any) {
    const Component = isOrdered ? 'ol' : 'ul';
    return React.createElement(Component, {
      style: listWrapperStyle,
      children
    });
  }), [listWrapperStyle]);

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
      <ReactMarkdown
        remarkPlugins={REMARK_PLUGINS as any}
        rehypePlugins={REHYPE_PLUGINS as any}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </RemarkLetterPageBackgroundRenderer>
  );
}

export const MemoizedRemarkLetterPageRenderer = memo(RemarkLetterPageRenderer);
MemoizedRemarkLetterPageRenderer.displayName = "MemoizedRemarkLetterPageRenderer";
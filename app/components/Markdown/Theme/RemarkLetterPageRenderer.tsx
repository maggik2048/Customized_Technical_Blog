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
const { renderInkText, renderMixedInkText } = await import("./letterInkText");

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
  segments?: Array<{ text: string; isRed?: boolean; color?: string }>;
}

const InkText = memo(function InkText({ text, seed, options, segments }: InkTextProps) {
  if (segments && segments.length > 0) {
    return renderMixedInkText(segments, seed, options);
  }
  return renderInkText(text, seed, options);
}, (prev, next) => {
  if (prev.text !== next.text || prev.seed !== next.seed) return false;
  if (prev.segments !== next.segments) return false;
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
     HELPER: Extract text content from children
  ========================= */
  
  const extractTextContent = useCallback((node: any): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(extractTextContent).join('');
    if (node?.props?.children) return extractTextContent(node.props.children);
    return '';
  }, []);

  const processMixedContent = useCallback((children: any, seed: number, options: any): React.ReactNode => {
    // If it's just a string, render with ink effect
    if (typeof children === 'string') {
      return <InkText text={children} seed={seed} options={options} />;
    }
    
    // If it's an array, process each element
    if (Array.isArray(children)) {
      const segments: Array<{ text: string; isRed?: boolean; color?: string }> = [];
      let currentSegment = '';
      let isRedSegment = false;
      
      const flushSegment = () => {
        if (currentSegment) {
          segments.push({ 
            text: currentSegment, 
            isRed: isRedSegment,
            color: isRedSegment ? colors.headingColor : undefined 
          });
          currentSegment = '';
        }
      };
      
      for (const child of children) {
        if (typeof child === 'string') {
          currentSegment += child;
        } else if (child?.type === 'strong' || child?.type === 'em' || child?.type === 'b' || child?.type === 'i') {
          // This is a strong/em element - mark as red
          flushSegment();
          isRedSegment = true;
          const textContent = extractTextContent(child);
          currentSegment += textContent;
          flushSegment();
          isRedSegment = false;
        } else if (child?.type === 'span') {
          // Handle span with custom styles
          flushSegment();
          const isRed = child.props?.style?.color === colors.headingColor || 
                       child.props?.className?.includes('red') ||
                       child.props?.className?.includes('headingColor');
          const textContent = extractTextContent(child);
          if (textContent) {
            segments.push({ 
              text: textContent, 
              isRed: isRed,
              color: isRed ? colors.headingColor : undefined 
            });
          }
        } else if (React.isValidElement(child)) {
          // For other elements, extract text content
          const textContent = extractTextContent(child);
          if (textContent) {
            currentSegment += textContent;
          }
        }
      }
      
      flushSegment();
      
      if (segments.length > 0) {
        return <InkText text="" seed={seed} options={options} segments={segments} />;
      }
    }
    
    // Fallback: render as-is
    return children;
  }, [colors.headingColor, extractTextContent]);

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
      const processedChildren = processMixedContent(children, seed, inkOptions.heading);
      return (
        <div style={{ marginTop, marginBottom: 18 }}>
          <span className={className} style={headingStyle}>
            {processedChildren}
          </span>
        </div>
      );
    });
  }, [getHeadingStyleForLevel, inkOptions.heading, processMixedContent]);

  const ParagraphRenderer = useMemo(() => memo(function ParagraphRenderer({ children }: any) {
    const processedChildren = processMixedContent(children, 1400, inkOptions.paragraph);
    return (
      <p style={paragraphStyle}>
        {processedChildren}
      </p>
    );
  }), [paragraphStyle, inkOptions.paragraph, processMixedContent]);

  // REMOVED: StrongRenderer - now handled by processMixedContent
  // REMOVED: EmphasisRenderer - now handled by processMixedContent

  const ListItemRenderer = useMemo(() => memo(function ListItemRenderer({ children, index }: any) {
    const bulletSeed = 9000 + (index || 0);
    const textSeed = 3100 + (index || 0);
    const processedChildren = processMixedContent(children, textSeed, inkOptions.list);
    
    return (
      <li style={listItemStyle}>
        <span style={bulletStyle}>
          <InkText text="•" seed={bulletSeed} options={inkOptions.bullet} />
        </span>
        <span>
          {processedChildren}
        </span>
      </li>
    );
  }), [listItemStyle, bulletStyle, inkOptions.bullet, inkOptions.list, processMixedContent]);

  const BlockquoteRenderer = useMemo(() => memo(function BlockquoteRenderer({ children }: any) {
    const processedChildren = processMixedContent(children, 5000, inkOptions.paragraph);
    return <blockquote style={blockquoteStyle}>{processedChildren}</blockquote>;
  }), [blockquoteStyle, inkOptions.paragraph, processMixedContent]);

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
    // Remove strong and em renderers - let processMixedContent handle them
    // strong: StrongRenderer,  // REMOVED
    // em: EmphasisRenderer,    // REMOVED
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
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

// Import the new component
import { DifferentFont_insideParenthesis } from "./DifferentFont_insideParenthesis";

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

  // NEW: Process text with DifferentFont_insideParenthesis
  const processWithDifferentFont = useCallback((text: string): React.ReactNode => {
    if (typeof text !== 'string') return text;
    // Only apply if the text contains parentheses or equals signs
    if (!text.includes('(') && !text.includes('=')) return text;
    return <DifferentFont_insideParenthesis>{text}</DifferentFont_insideParenthesis>;
  }, []);

  const processMixedContent = useCallback((children: any, seed: number, options: any): React.ReactNode => {
    // If it's just a string, render with ink effect
    if (typeof children === 'string') {
      // First apply DifferentFont_insideParenthesis to handle (...) and =...=
      const processedWithFont = processWithDifferentFont(children);
      // If it returned a React element (meaning it found matches), use it
      if (React.isValidElement(processedWithFont)) {
        return processedWithFont;
      }
      // Otherwise, render with ink effect
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
          flushSegment();
          isRedSegment = true;
          const textContent = extractTextContent(child);
          currentSegment += textContent;
          flushSegment();
          isRedSegment = false;
        } else if (child?.type === 'span') {
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
          const textContent = extractTextContent(child);
          if (textContent) {
            currentSegment += textContent;
          }
        }
      }
      
      flushSegment();
      
      if (segments.length > 0) {
        // Check if any segment contains parentheses or equals signs
        // If so, we need to apply DifferentFont_insideParenthesis to those segments
        const processedSegments = segments.map(segment => {
          if (segment.text.includes('(') || segment.text.includes('=')) {
            // We need to handle this differently - the font should apply to the 
            // final rendered output, so we'll process it after rendering
            return segment;
          }
          return segment;
        });
        
        return <InkText text="" seed={seed} options={options} segments={processedSegments} />;
      }
    }
    
    // Fallback: render as-is
    return children;
  }, [colors.headingColor, extractTextContent, processWithDifferentFont]);

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
      // For headings, apply DifferentFont_insideParenthesis directly
      let processedChildren = children;
      if (typeof children === 'string') {
        processedChildren = <DifferentFont_insideParenthesis>{children}</DifferentFont_insideParenthesis>;
      }
      return (
        <div style={{ marginTop, marginBottom: 18 }}>
          <span className={className} style={headingStyle}>
            {processedChildren}
          </span>
        </div>
      );
    });
  }, [getHeadingStyleForLevel]);

  const ParagraphRenderer = useMemo(() => memo(function ParagraphRenderer({ children }: any) {
    // Process content with ink effect
    let processedChildren = processMixedContent(children, 1400, inkOptions.paragraph);
    
    // If it's a string and not already processed by DifferentFont_insideParenthesis
    if (typeof children === 'string' && (children.includes('(') || children.includes('='))) {
      // Apply DifferentFont_insideParenthesis
      processedChildren = <DifferentFont_insideParenthesis>{children}</DifferentFont_insideParenthesis>;
    }
    
    return (
      <p style={paragraphStyle}>
        {processedChildren}
      </p>
    );
  }), [paragraphStyle, inkOptions.paragraph, processMixedContent]);

  const ListItemRenderer = useMemo(() => memo(function ListItemRenderer({ children, index }: any) {
    const bulletSeed = 9000 + (index || 0);
    const textSeed = 3100 + (index || 0);
    
    let processedChildren = processMixedContent(children, textSeed, inkOptions.list);
    
    // Apply DifferentFont_insideParenthesis to string content
    if (typeof children === 'string' && (children.includes('(') || children.includes('='))) {
      processedChildren = <DifferentFont_insideParenthesis>{children}</DifferentFont_insideParenthesis>;
    }
    
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
    let processedChildren = children;
    if (typeof children === 'string' && (children.includes('(') || children.includes('='))) {
      processedChildren = <DifferentFont_insideParenthesis>{children}</DifferentFont_insideParenthesis>;
    }
    return <blockquote style={blockquoteStyle}>{processedChildren}</blockquote>;
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
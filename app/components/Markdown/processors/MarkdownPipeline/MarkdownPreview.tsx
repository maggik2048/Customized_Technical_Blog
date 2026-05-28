"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";

import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";

import "katex/dist/katex.min.css";

import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

import {
  PrismLight as SyntaxHighlighter,
} from "react-syntax-highlighter";

import ts from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import js from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import diff from "react-syntax-highlighter/dist/esm/languages/prism/diff";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import DiffVisualizer from "./DiffVisualizer";

/**
 * =========================================
 * REGISTER LANGUAGES
 * =========================================
 */

SyntaxHighlighter.registerLanguage(
  "ts",
  ts
);

SyntaxHighlighter.registerLanguage(
  "tsx",
  tsx
);

SyntaxHighlighter.registerLanguage(
  "js",
  js
);

SyntaxHighlighter.registerLanguage(
  "jsx",
  jsx
);

SyntaxHighlighter.registerLanguage(
  "diff",
  diff
);

/**
 * =========================================
 * CONSTANTS
 * =========================================
 */

const IMAGE_REGEX =
  /^(https?:\/\/.*\.(png|jpg|jpeg|gif|webp|bmp|svg))$/gm;

const LANGUAGE_REGEX =
  /language-(\w+)/;

const EMPTY_OBJECT = {};

/**
 * =========================================
 * TURNDOWN
 * =========================================
 */

const turndown = new TurndownService({
  headingStyle: "atx",

  codeBlockStyle: "fenced",

  emDelimiter: "*",
});

turndown.use(gfm);

/**
 * =========================================
 * PLUGINS
 * =========================================
 */

const remarkPlugins = [
  remarkGfm,
  remarkMath,
];

const rehypePlugins = [
  rehypeKatex,
  rehypeRaw,
];

/**
 * =========================================
 * STYLES
 * =========================================
 */

const INLINE_CODE_STYLE: React.CSSProperties =
  {
    background: "#333",

    padding: "2px 6px",

    borderRadius: 4,

    outline: "none",

    fontFamily: "monospace",
  };

const BLOCK_CODE_STYLE: React.CSSProperties =
  {
    ...INLINE_CODE_STYLE,

    display: "inline-block",

    margin: "2px 0",
  };

const EDITABLE_BASE_STYLE: React.CSSProperties =
  {
    outline: "none",

    cursor: "text",
  };

const PRE_STYLE: React.CSSProperties =
  {
    margin: "10px 0",

    borderRadius: 6,

    overflow: "auto",
  };

const SYNTAX_STYLE: React.CSSProperties =
  {
    margin: "10px 0",

    borderRadius: 6,

    padding: "12px",
  };

const IMAGE_STYLE: React.CSSProperties =
  {
    maxWidth: "100%",

    maxHeight: 400,

    display: "block",

    margin: "10px 0",

    borderRadius: 6,
  };

const CONTAINER_STYLE: React.CSSProperties =
  {
    width: "50%",

    minHeight: "100vh",

    overflow: "visible",

    padding: 20,

    background: "#111",

    color: "#fff",

    wordBreak: "break-word",
  };

const H1_STYLE: React.CSSProperties =
  {
    margin: "18px 0 10px",

    lineHeight: 1,
  };

const H2_STYLE: React.CSSProperties =
  {
    margin: "16px 0 8px",

    lineHeight: 1.25,
  };

const H3_STYLE: React.CSSProperties =
  {
    margin: "14px 0 6px",

    lineHeight: 1.3,
  };

const P_STYLE: React.CSSProperties =
  {
    margin: "6px 0",

    lineHeight: 1.2,
  };

const LI_STYLE: React.CSSProperties =
  {
    margin: "2px 0",

    lineHeight: 1.5,
  };

const BLOCKQUOTE_STYLE: React.CSSProperties =
  {
    margin: "10px 0",

    paddingLeft: 12,

    borderLeft: "3px solid #555",

    opacity: 0.9,

    lineHeight: 1.5,
  };

/**
 * =========================================
 * TYPES
 * =========================================
 */

type Props = {
  content: string;

  setContent: React.Dispatch<
    React.SetStateAction<string>
  >;

  previewRef: React.RefObject<HTMLDivElement>;
};

type EditableBlockProps = {
  tag: keyof JSX.IntrinsicElements;

  children: React.ReactNode;

  style?: React.CSSProperties;

  onBlur: () => void;
};

type EditableCodeProps = {
  text: string;

  onBlur: () => void;

  inline?: boolean;
};

/**
 * =========================================
 * EDITABLE BLOCK
 * =========================================
 */

const EditableBlock = React.memo(
  function EditableBlock({
    tag,
    children,
    style,
    onBlur,
  }: EditableBlockProps) {
    const Tag = tag as any;

    return (
      <Tag
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        onBlur={onBlur}
        style={
          style
            ? {
                ...EDITABLE_BASE_STYLE,

                ...style,
              }
            : EDITABLE_BASE_STYLE
        }
      >
        {children}
      </Tag>
    );
  }
);

/**
 * =========================================
 * EDITABLE CODE
 * =========================================
 */

const EditableCode = React.memo(
  function EditableCode({
    text,
    onBlur,
    inline,
  }: EditableCodeProps) {
    return (
      <code
        contentEditable
        suppressContentEditableWarning
        onBlur={onBlur}
        style={
          inline
            ? INLINE_CODE_STYLE
            : BLOCK_CODE_STYLE
        }
      >
        {text}
      </code>
    );
  }
);

/**
 * =========================================
 * SYNTAX BLOCK
 * =========================================
 */

const SyntaxBlock = React.memo(
  function SyntaxBlock({
    text,
    language,
  }: {
    text: string;

    language: string;
  }) {
    return (
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        wrapLines
        wrapLongLines={false}
        customStyle={SYNTAX_STYLE}
      >
        {text}
      </SyntaxHighlighter>
    );
  }
);

/**
 * =========================================
 * MARKDOWN COMPONENT FACTORY
 * =========================================
 */

function createMarkdownComponents(
  syncPreviewToMarkdown: () => void
) {
  return {
    /**
     * =====================================
     * PRE
     * =====================================
     */

    pre({
      children,
    }: any) {
      const childProps =
        children?.props ||
        EMPTY_OBJECT;

      const raw = String(
        childProps.children || ""
      );

      const className =
        childProps.className || "";

      /**
       * diff
       */

      if (
        className.includes(
          "language-diff"
        )
      ) {
        return (
          <DiffVisualizer raw={raw} />
        );
      }

      /**
       * single line
       */

      const trimmed = raw.trim();

      if (
        trimmed &&
        !trimmed.includes("\n")
      ) {
        return (
          <EditableCode
            text={trimmed}
            onBlur={
              syncPreviewToMarkdown
            }
          />
        );
      }

      /**
       * normal pre
       */

      return (
        <pre style={PRE_STYLE}>
          {children}
        </pre>
      );
    },

    /**
     * =====================================
     * HEADINGS
     * =====================================
     */

    h1({ children }: any) {
      return (
        <EditableBlock
          tag="h1"
          onBlur={
            syncPreviewToMarkdown
          }
          style={H1_STYLE}
        >
          {children}
        </EditableBlock>
      );
    },

    h2({ children }: any) {
      return (
        <EditableBlock
          tag="h2"
          onBlur={
            syncPreviewToMarkdown
          }
          style={H2_STYLE}
        >
          {children}
        </EditableBlock>
      );
    },

    h3({ children }: any) {
      return (
        <EditableBlock
          tag="h3"
          onBlur={
            syncPreviewToMarkdown
          }
          style={H3_STYLE}
        >
          {children}
        </EditableBlock>
      );
    },

    /**
     * =====================================
     * TEXT
     * =====================================
     */

    p({ children }: any) {
      return (
        <EditableBlock
          tag="p"
          onBlur={
            syncPreviewToMarkdown
          }
          style={P_STYLE}
        >
          {children}
        </EditableBlock>
      );
    },

    li({ children }: any) {
      return (
        <EditableBlock
          tag="li"
          onBlur={
            syncPreviewToMarkdown
          }
          style={LI_STYLE}
        >
          {children}
        </EditableBlock>
      );
    },

    blockquote({
      children,
    }: any) {
      return (
        <EditableBlock
          tag="blockquote"
          onBlur={
            syncPreviewToMarkdown
          }
          style={BLOCKQUOTE_STYLE}
        >
          {children}
        </EditableBlock>
      );
    },

    /**
     * =====================================
     * CODE
     * =====================================
     */

    code({
      inline,

      className,

      children,
    }: any) {
      const text = Array.isArray(
        children
      )
        ? children.join("")
        : String(children);

      /**
       * inline code
       */

      if (inline) {
        return (
          <EditableCode
            text={text}
            inline
            onBlur={
              syncPreviewToMarkdown
            }
          />
        );
      }

      /**
       * language
       */

      const match =
        LANGUAGE_REGEX.exec(
          className || ""
        );

      const language =
        match?.[1] || "text";

      /**
       * syntax
       */

      return (
        <SyntaxBlock
          text={text}
          language={language}
        />
      );
    },

    /**
     * =====================================
     * IMAGE
     * =====================================
     */

    img({ src, alt }: any) {
      return (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          style={IMAGE_STYLE}
        />
      );
    },
  };
}

/**
 * =========================================
 * COMPONENT
 * =========================================
 */

function MarkdownPreview({
  content,
  setContent,
  previewRef,
}: Props) {
  /**
   * =====================================
   * MARKDOWN -> IMAGE
   * =====================================
   */

  const renderContent = React.useMemo(
    () => {
      return content.replace(
        IMAGE_REGEX,
        "![]($1)"
      );
    },
    [content]
  );

  /**
   * =====================================
   * HTML -> MARKDOWN
   * =====================================
   */

  const frameRef = React.useRef(0);

  const syncPreviewToMarkdown =
    React.useCallback(() => {
      cancelAnimationFrame(
        frameRef.current
      );

      frameRef.current =
        requestAnimationFrame(() => {
          const root =
            previewRef.current;

          if (!root) {
            return;
          }

          const markdown =
            turndown
              .turndown(
                root.innerHTML
              )
              .replace(/\r/g, "")
              .replace(
                /\n{3,}/g,
                "\n\n"
              )
              .trim();

          setContent(markdown);
        });
    }, [previewRef, setContent]);

  /**
   * =====================================
   * CLEANUP
   * =====================================
   */

  React.useEffect(() => {
    return () => {
      cancelAnimationFrame(
        frameRef.current
      );
    };
  }, []);

  /**
   * =====================================
   * COMPONENTS
   * =====================================
   */

  const markdownComponents =
    React.useMemo(() => {
      return createMarkdownComponents(
        syncPreviewToMarkdown
      );
    }, [syncPreviewToMarkdown]);

  /**
   * =====================================
   * RENDER
   * =====================================
   */

  return (
    <div
      ref={previewRef}
      style={CONTAINER_STYLE}
    >
      <ReactMarkdown
        remarkPlugins={
          remarkPlugins
        }
        rehypePlugins={
          rehypePlugins
        }
        components={
          markdownComponents
        }
      >
        {renderContent ||
          "Preview..."}
      </ReactMarkdown>
    </div>
  );
}

export default React.memo(
  MarkdownPreview
);


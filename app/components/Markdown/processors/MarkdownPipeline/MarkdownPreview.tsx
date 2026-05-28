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
            : {
                ...INLINE_CODE_STYLE,

                display: "inline-block",

                margin: "2px 0",
              }
        }
      >
        {text}
      </code>
    );
  }
);

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
              .turndown(root.innerHTML)
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
   * COMPONENTS
   * =====================================
   */

  const markdownComponents =
    React.useMemo(() => {
      return {
        /**
         * ===============================
         * PRE
         * ===============================
         */

        pre({
          children,
        }: any) {
          const childProps =
            children?.props || {};

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

          const trimmed =
            raw.trim();

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
         * ===============================
         * HEADINGS
         * ===============================
         */

        h1({ children }: any) {
          return (
            <EditableBlock
              tag="h1"
              onBlur={
                syncPreviewToMarkdown
              }
              style={{
                margin:
                  "18px 0 10px",

                lineHeight: 1,
              }}
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
              style={{
                margin:
                  "16px 0 8px",

                lineHeight: 1.25,
              }}
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
              style={{
                margin:
                  "14px 0 6px",

                lineHeight: 1.3,
              }}
            >
              {children}
            </EditableBlock>
          );
        },

        /**
         * ===============================
         * TEXT
         * ===============================
         */

        p({ children }: any) {
          return (
            <EditableBlock
              tag="p"
              onBlur={
                syncPreviewToMarkdown
              }
              style={{
                margin: "6px 0",

                lineHeight: 1.2,
              }}
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
              style={{
                margin: "2px 0",

                lineHeight: 1.5,
              }}
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
              style={{
                margin: "10px 0",

                paddingLeft: 12,

                borderLeft:
                  "3px solid #555",

                opacity: 0.9,

                lineHeight: 1.5,
              }}
            >
              {children}
            </EditableBlock>
          );
        },

        /**
         * ===============================
         * CODE
         * ===============================
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

          /**
           * syntax
           */

          return (
            <SyntaxHighlighter
              style={oneDark}
              language={
                match?.[1] || "text"
              }
              wrapLines
              wrapLongLines={false}
              customStyle={
                SYNTAX_STYLE
              }
            >
              {text}
            </SyntaxHighlighter>
          );
        },

        /**
         * ===============================
         * IMAGE
         * ===============================
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


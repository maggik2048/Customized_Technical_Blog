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
        style={{
          outline: "none",

          cursor: "text",

          ...style,
        }}
      >
        {children}
      </Tag>
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

  const renderContent = React.useMemo(() => {
    return content.replace(
      /^(https?:\/\/.*\.(png|jpg|jpeg|gif|webp|bmp|svg))$/gm,
      "![]($1)"
    );
  }, [content]);

  /**
   * =====================================
   * HTML -> MARKDOWN SYNC
   * =====================================
   */

  const syncPreviewToMarkdown =
    React.useMemo(() => {
      let frame = 0;

      return () => {
        cancelAnimationFrame(frame);

        frame = requestAnimationFrame(() => {
          if (!previewRef.current) {
            return;
          }

          /**
           * editable html
           */

          const html =
            previewRef.current.innerHTML;

          /**
           * html -> markdown
           */

          const markdown =
            turndown
              .turndown(html)
              .replace(/\r/g, "")
              .replace(/\n{3,}/g, "\n\n")
              .trim();

          /**
           * sync
           */

          setContent(markdown);
        });
      };
    }, [previewRef, setContent]);

  /**
   * =====================================
   * PLUGINS
   * =====================================
   */

  const remarkPlugins = React.useMemo(
    () => [remarkGfm, remarkMath],
    []
  );

  const rehypePlugins = React.useMemo(
    () => [rehypeKatex, rehypeRaw],
    []
  );

  /**
   * =====================================
   * COMPONENTS
   * =====================================
   */

  const markdownComponents =
    React.useMemo(
      () => ({
        /**
         * =================================
         * PRE
         * =================================
         */

        pre({
          children,
        }: any) {
          /**
           * raw text
           */

          const raw = String(
            children?.props?.children || ""
          );

          /**
           * detect diff
           */

          const className =
            children?.props?.className || "";

          const isDiff =
            className.includes(
              "language-diff"
            );

          /**
           * diff render
           */

          if (isDiff) {
            return (
              <DiffVisualizer raw={raw} />
            );
          }

          /**
           * single line fenced code
           */

          const trimmed = raw.trim();

          const isSingleLine =
            !trimmed.includes("\n");

          if (
            isSingleLine &&
            trimmed.length > 0
          ) {
            return (
              <code
                contentEditable
                suppressContentEditableWarning
                onBlur={
                  syncPreviewToMarkdown
                }
                style={{
                  background: "#333",

                  padding: "2px 6px",

                  borderRadius: 4,

                  outline: "none",

                  display: "inline-block",

                  margin: "2px 0",

                  fontFamily:
                    "monospace",
                }}
              >
                {trimmed}
              </code>
            );
          }

          /**
           * normal pre
           */

          return (
            <pre
              style={{
                margin: "10px 0",

                borderRadius: 6,

                overflow: "auto",
              }}
            >
              {children}
            </pre>
          );
        },

        /**
         * =================================
         * HEADINGS
         * =================================
         */

        h1({ children }: any) {
          return (
            <EditableBlock
              tag="h1"
              onBlur={
                syncPreviewToMarkdown
              }
              style={{
                margin: "18px 0 10px",

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
                margin: "16px 0 8px",

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
                margin: "14px 0 6px",

                lineHeight: 1.3,
              }}
            >
              {children}
            </EditableBlock>
          );
        },

        /**
         * =================================
         * TEXT
         * =================================
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
         * =================================
         * CODE
         * =================================
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
              <code
                contentEditable
                suppressContentEditableWarning
                onBlur={
                  syncPreviewToMarkdown
                }
                style={{
                  background: "#333",

                  padding: "2px 6px",

                  borderRadius: 4,

                  outline: "none",
                }}
              >
                {text}
              </code>
            );
          }

          /**
           * language
           */

          const match =
            /language-(\w+)/.exec(
              className || ""
            );

          /**
           * block code
           */

          return (
            <SyntaxHighlighter
              style={oneDark}
              language={
                match?.[1] || "text"
              }
              wrapLines={true}
              wrapLongLines={false}
              customStyle={{
                margin: "10px 0",

                borderRadius: 6,

                padding: "12px",
              }}
            >
              {text}
            </SyntaxHighlighter>
          );
        },

        /**
         * =================================
         * IMAGE
         * =================================
         */

        img({ src, alt }: any) {
          return (
            <img
              src={src}
              alt={alt}
              loading="lazy"
              style={{
                maxWidth: "100%",

                maxHeight: 400,

                display: "block",

                margin: "10px 0",

                borderRadius: 6,
              }}
            />
          );
        },
      }),
      [syncPreviewToMarkdown]
    );

  /**
   * =====================================
   * RENDER
   * =====================================
   */

  return (
    <div
      ref={previewRef}
      style={{
        width: "50%",

        minHeight: "100vh",

        overflow: "visible",

        padding: 20,

        background: "#111",

        color: "#fff",

        wordBreak: "break-word",
      }}
    >
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={markdownComponents}
      >
        {renderContent || "Preview..."}
      </ReactMarkdown>
    </div>
  );
}

export default React.memo(
  MarkdownPreview
);
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

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

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

/**
 * =========================================
 * COMPONENT
 * =========================================
 */

export default function MarkdownPreview({
  content,
  setContent,
  previewRef,
}: Props) {
  /**
   * =====================================
   * MARKDOWN -> IMAGE
   * =====================================
   */

  const renderContent = content.replace(
    /^(https?:\/\/.*\.(png|jpg|jpeg|gif|webp|bmp|svg))$/gm,
    "![]($1)"
  );

  /**
   * =====================================
   * HTML -> MARKDOWN SYNC
   * =====================================
   */

  const syncPreviewToMarkdown =
    React.useCallback(() => {
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
    }, [previewRef, setContent]);

  /**
   * =====================================
   * EDITABLE BLOCK
   * =====================================
   */

  const EditableBlock = React.useCallback(
    ({
      tag,
      children,
      style,
    }: {
      tag: keyof JSX.IntrinsicElements;

      children: React.ReactNode;

      style?: React.CSSProperties;
    }) => {
      const Tag = tag as any;

      return (
        <Tag
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onBlur={syncPreviewToMarkdown}
          style={{
            outline: "none",

            cursor: "text",

            ...style,
          }}
        >
          {children}
        </Tag>
      );
    },
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
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeKatex,
          rehypeRaw,
        ]}
        components={{
          /**
           * =================================
           * DIFF BLOCK
           * =================================
           */

          pre({
            children,
          }: any) {
            /**
             * raw text
             */

            const raw =
              String(
                children?.props?.children ||
                  ""
              );

            /**
             * detect diff
             */

            const className =
              children?.props?.className ||
              "";

            const isDiff =
              className.includes(
                "language-diff"
              );

            /**
             * normal pre
             */

            if (!isDiff) {
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
            }

            /**
             * diff render
             */

            const lines =
              raw.split("\n");

            return (
              <div
                style={{
                  margin: "10px 0",

                  borderRadius: 8,

                  overflow: "hidden",

                  border:
                    "1px solid #333",

                  fontFamily:
                    "monospace",

                  fontSize: 14,
                }}
              >
                {lines.map(
                  (line, index) => {
                    let background =
                      "#1e1e1e";

                    let color =
                      "#d4d4d4";

                    if (
                      line.startsWith(
                        "+"
                      )
                    ) {
                      background =
                        "#0f2a1f";

                      color =
                        "#7ee787";
                    }

                    if (
                      line.startsWith(
                        "-"
                      )
                    ) {
                      background =
                        "#2d1517";

                      color =
                        "#ff7b72";
                    }

                    if (
                      line.startsWith(
                        "@"
                      )
                    ) {
                      background =
                        "#1f2937";

                      color =
                        "#79c0ff";
                    }

                    return (
                      <div
                        key={index}
                        style={{
                          background,

                          color,

                          padding:
                            "2px 10px",

                          whiteSpace:
                            "pre-wrap",

                          lineHeight: 1.6,
                        }}
                      >
                        {line || " "}
                      </div>
                    );
                  }
                )}
              </div>
            );
          },

          /**
           * =================================
           * HEADINGS
           * =================================
           */

          h1({ children }) {
            return (
              <EditableBlock
                tag="h1"
                style={{
                  margin: "18px 0 10px",
                  lineHeight: 1,
                }}
              >
                {children}
              </EditableBlock>
            );
          },

          h2({ children }) {
            return (
              <EditableBlock
                tag="h2"
                style={{
                  margin: "16px 0 8px",
                  lineHeight: 1.25,
                }}
              >
                {children}
              </EditableBlock>
            );
          },

          h3({ children }) {
            return (
              <EditableBlock
                tag="h3"
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

          p({ children }) {
            return (
              <EditableBlock
                tag="p"
                style={{
                  margin: "6px 0",
                  lineHeight: 1.2,
                }}
              >
                {children}
              </EditableBlock>
            );
          },

          li({ children }) {
            return (
              <EditableBlock
                tag="li"
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
          }) {
            return (
              <EditableBlock
                tag="blockquote"
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

            if (
              inline ||
              (text.length < 80 &&
                !text.includes("\n"))
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
        }}
      >
        {renderContent || "Preview..."}
      </ReactMarkdown>
    </div>
  );
}
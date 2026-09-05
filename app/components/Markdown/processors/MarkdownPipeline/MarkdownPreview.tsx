"use client";

// IMPORT PROPRE - Plus besoin de require
import { gfm } from "turndown-plugin-gfm";

import React from "react";
import ReactMarkdown from "react-markdown";

import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";

import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";

import "katex/dist/katex.min.css";

import TurndownService from "turndown";

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
  previewRef: React.RefObject<HTMLDivElement | null>;
};

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
    const safeLanguage = language || "text";
    
    try {
      return (
        <SyntaxHighlighter
          style={oneDark}
          language={safeLanguage}
          wrapLines
          wrapLongLines={false}
          customStyle={SYNTAX_STYLE}
        >
          {text || ""}
        </SyntaxHighlighter>
      );
    } catch (error) {
      console.warn("Syntax highlighting failed:", error);
      return (
        <pre style={PRE_STYLE}>
          <code>{text || ""}</code>
        </pre>
      );
    }
  }
);

/**
 * =========================================
 * MARKDOWN COMPONENTS
 * =========================================
 */

function createMarkdownComponents() {
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
        children?.props || {};

      const raw = String(
        childProps.children || ""
      );

      const className =
        childProps.className || "";

      // diff
      if (
        className.includes(
          "language-diff"
        )
      ) {
        try {
          return (
            <DiffVisualizer raw={raw} />
          );
        } catch (error) {
          console.warn("Diff visualizer failed:", error);
          return <pre>{raw}</pre>;
        }
      }

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
        <h1 style={H1_STYLE}>
          {children}
        </h1>
      );
    },

    h2({ children }: any) {
      return (
        <h2 style={H2_STYLE}>
          {children}
        </h2>
      );
    },

    h3({ children }: any) {
      return (
        <h3 style={H3_STYLE}>
          {children}
        </h3>
      );
    },

    /**
     * =====================================
     * TEXT
     * =====================================
     */

    p({ children }: any) {
      return (
        <p style={P_STYLE}>
          {children}
        </p>
      );
    },

    li({ children }: any) {
      return (
        <li style={LI_STYLE}>
          {children}
        </li>
      );
    },

    blockquote({
      children,
    }: any) {
      return (
        <blockquote style={BLOCKQUOTE_STYLE}>
          {children}
        </blockquote>
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
      let text = "";
      try {
        text = Array.isArray(children)
          ? children.join("")
          : String(children || "");
      } catch (error) {
        console.warn("Failed to process code children:", error);
        text = "";
      }

      // 너무 긴 텍스트는 처리하지 않음
      if (text.length > 50000) {
        console.warn("Code block too long, truncating");
        text = text.substring(0, 50000) + "\n... (truncated)";
      }

      const isInline =
        inline || !text.includes("\n");

      if (isInline) {
        return (
          <code style={{
            background: "#333",
            padding: "2px 6px",
            borderRadius: 4,
            fontFamily: "monospace",
          }}>
            {text}
          </code>
        );
      }

      const match =
        LANGUAGE_REGEX.exec(
          className || ""
        );

      const language =
        match?.[1] || "text";

      try {
        return (
          <SyntaxBlock
            text={text}
            language={language}
          />
        );
      } catch (error) {
        console.warn("Syntax block failed:", error);
        return (
          <pre style={PRE_STYLE}>
            <code>{text}</code>
          </pre>
        );
      }
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
   * CONTENT RENDER
   * =====================================
   */

  const renderContent = React.useMemo(
    () => {
      try {
        return content || "";
      } catch (error) {
        console.warn("Content rendering failed:", error);
        return content || "";
      }
    },
    [content]
  );

  /**
   * =====================================
   * COMPONENTS
   * =====================================
   */

  const markdownComponents =
    React.useMemo(() => {
      return createMarkdownComponents();
    }, []);

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
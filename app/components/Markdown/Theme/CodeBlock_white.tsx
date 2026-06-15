"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { motion } from "framer-motion";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

import type { Components } from "react-markdown";

import DiffVisualizer from "@/app/components/Markdown/processors/MarkdownPipeline/DiffVisualizer";

/* =========================
   TYPES
========================= */

type CodeProps =
  Components["code"] extends React.ComponentType<infer P>
    ? P
    : any;

/* =========================
   ICONS
========================= */

const CopyIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect
      x="9"
      y="9"
      width="13"
      height="13"
      rx="2"
      ry="2"
    />

    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

/* =========================
   COMPONENT
========================= */

export default function CodeBlock_white({
  inline,
  className,
  children,
  ...props
}: CodeProps) {
  const [copied, setCopied] =
    useState(false);

  const [hovered, setHovered] =
    useState(false);

  const timerRef =
    useRef<NodeJS.Timeout | null>(null);

  const text = String(children).replace(
    /\n$/,
    ""
  );

  const match = /language-(.+)/.exec(
    className || ""
  );

  const language =
    match?.[1]?.toLowerCase() || "";

  /* =========================
     INLINE DETECTION
  ========================= */

  const isInline =
    inline ||
    (!className &&
      text.length < 80 &&
      !text.includes("\n"));

  /* =========================
     DIFF DETECTION
  ========================= */

  const isDiff =
    language === "diff" ||
    language === "patch";

  /* =========================
     CLEANUP
  ========================= */

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  /* =========================
     COPY
  ========================= */

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        text
      );

      setCopied(true);

      timerRef.current = setTimeout(() => {
        setCopied(false);
      }, 1400);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  /* =========================
     INLINE CODE
  ========================= */

  if (isInline) {
    return (
      <code
        {...props}
        className={className}
        style={{
          background:
            "rgba(0,0,0,0.04)",

          color: "rgba(20,20,20,0.92)",

          padding: "2px 6px",

          borderRadius: 6,

          fontSize: "0.95em",

          border:
            "1px solid rgba(0,0,0,0.06)",

          backdropFilter: "blur(8px)",

          WebkitBackdropFilter:
            "blur(8px)",

          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, monospace",

          wordBreak: "break-word",
        }}
      >
        {children}
      </code>
    );
  }

  /* =========================
     DIFF VISUALIZER
  ========================= */

  if (isDiff) {
    return (
      <div
        style={{
          margin: "18px 0",
        }}
      >
        <DiffVisualizer raw={text} />
      </div>
    );
  }

  /* =========================
     BLOCK CODE
  ========================= */

  return (
    <motion.div
      onMouseEnter={() =>
        setHovered(true)
      }
      onMouseLeave={() =>
        setHovered(false)
      }
      style={{
        position: "relative",

        borderRadius: 14,

        overflow: "hidden",

        background:
          "rgba(255,255,255,0.96)",

        backdropFilter: "blur(14px)",

        WebkitBackdropFilter:
          "blur(14px)",

        border:
          "1px solid rgba(0,0,0,0.12)",

        boxShadow:
          "0 12px 28px rgba(0,0,0,0.08)",

        margin: "22px 0",
      }}
    >
      {/* COPY BUTTON */}

      <motion.button
        onClick={handleCopy}
        initial={false}
        animate={{
          opacity:
            hovered || copied ? 1 : 0.5,

          y:
            hovered || copied ? 0 : -2,

          scale: copied ? 1.02 : 1,
        }}
        transition={{
          duration: 0.16,
        }}
        style={{
          position: "absolute",

          top: 12,
          right: 12,

          width: 34,
          height: 34,

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          border: "none",

          borderRadius: 9,

          background: copied
            ? "rgba(0,0,0,0.06)"
            : hovered
            ? "rgba(0,0,0,0.1)"
            : "rgba(0,0,0,0.04)",

          color: copied
            ? "rgba(20,20,20,0.72)"
            : hovered
            ? "rgba(20,20,20,0.92)"
            : "rgba(20,20,20,0.45)",

          backdropFilter: "blur(10px)",

          WebkitBackdropFilter:
            "blur(10px)",

          cursor: "pointer",

          zIndex: 20,

          transition:
            "background 0.18s ease, color 0.18s ease",
        }}
      >
        {copied ? (
          <CheckIcon />
        ) : (
          <CopyIcon />
        )}
      </motion.button>

      {/* SYNTAX */}

      <SyntaxHighlighter
        language={language || "text"}
        PreTag="div"

        showLineNumbers
        showInlineLineNumbers

        wrapLongLines

        lineNumberStyle={{
          minWidth: 42,

          paddingRight: 16,

          color: "rgba(0,0,0,0.35)",

          borderRight:
            "1px solid rgba(0,0,0,0.06)",

          marginRight: 16,

          userSelect: "none",
        }}
        style={{
          ...oneLight,

          'pre[class*="language-"]': {
            ...oneLight[
              'pre[class*="language-"]'
            ],

            background: "transparent",

            margin: 0,
          },

          'code[class*="language-"]': {
            ...oneLight[
              'code[class*="language-"]'
            ],

            background: "transparent",

            color:
              "rgba(20,20,20,0.92)",

            textShadow: "none",
          },
        }}
        customStyle={{
          margin: 0,

          padding: "22px",

          background: "transparent",

          fontSize: 16,

          lineHeight: 1.8,

          opacity: 0.99,

          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        }}
        codeTagProps={{
          style: {
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, monospace",
          },
        }}
      >
        {text}
      </SyntaxHighlighter>
    </motion.div>
  );
}
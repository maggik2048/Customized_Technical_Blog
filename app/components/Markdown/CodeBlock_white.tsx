"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { motion } from "framer-motion";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

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

interface Props {
  inline?: boolean;

  className?: string;

  children: React.ReactNode;
}

export default function CodeBlock_white({
  inline,
  className,
  children,
}: Props) {
  const [copied, setCopied] = useState(false);

  const [hovered, setHovered] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(
    null
  );

  const text = String(children);

  const match = /language-(.+)/.exec(
    className || ""
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      timerRef.current = setTimeout(() => {
        setCopied(false);
      }, 1400);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // INLINE CODE
  if (inline) {
    return (
      <code
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

          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        {children}
      </code>
    );
  }

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",

        borderRadius: 14,

        overflow: "hidden",

        background:
          "rgba(255,255,255,0.82)",

        backdropFilter: "blur(14px)",

        WebkitBackdropFilter:
          "blur(14px)",

        border:
          "1px solid rgba(0,0,0,0.06)",

        boxShadow:
          "0 10px 28px rgba(0,0,0,0.08)",
      }}
    >
      {/* COPY BUTTON */}
      <motion.button
        onClick={handleCopy}
        initial={false}
        animate={{
          opacity: hovered || copied ? 1 : 0.5,

          y: hovered || copied ? 0 : -2,

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
        {copied ? <CheckIcon /> : <CopyIcon />}
      </motion.button>

      {/* CODE BLOCK */}
      <SyntaxHighlighter
        language={match?.[1] || "text"}
        PreTag="div"
        style={{
          ...oneLight,

          'pre[class*="language-"]': {
            ...oneLight[
              'pre[class*="language-"]'
            ],

            background: "transparent",
          },

          'code[class*="language-"]': {
            ...oneLight[
              'code[class*="language-"]'
            ],

            background: "transparent",

            color: "rgba(20,20,20,0.92)",
          },
        }}
        customStyle={{
          margin: 0,

          padding: "22px",

          background: "transparent",

          fontSize: 14,

          lineHeight: 1.72,

          opacity: 0.96,

          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        {text.replace(/\n$/, "")}
      </SyntaxHighlighter>
    </motion.div>
  );
}
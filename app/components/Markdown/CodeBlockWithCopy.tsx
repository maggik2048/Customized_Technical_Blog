"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlockWithCopy({
  inline,
  className,
  children,
}: any) {
  const [copied, setCopied] = useState(false);

  const text = String(children);
  const match = /language-(\w+)/.exec(className || "");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  if (inline || (text.length < 80 && !text.includes("\n"))) {
    return (
      <code
        style={{
          background: "#222",
          color: "#eee",
          padding: "1px 4px",
          borderRadius: 4,
        }}
      >
        {children}
      </code>
    );
  }

  return (
    <motion.div
      animate={{ backgroundColor: "#121212" }}
      transition={{ duration: 0.3 }}
      style={{
        borderRadius: 6,
        overflowX: "auto",
        position: "relative",
      }}
    >
      <button
        onClick={handleCopy}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "#333",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "4px 8px",
          fontSize: 12,
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>

      <SyntaxHighlighter
        style={oneDark}
        language={match?.[1] || "text"}
        PreTag="div"
      >
        {text.replace(/\n$/, "")}
      </SyntaxHighlighter>
    </motion.div>
  );
}
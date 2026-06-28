"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";

import { motion } from "framer-motion";
import { CodeBlock3D } from "./CodeBlock3D";
import DiffVisualizer from "@/app/components/Markdown/processors/MarkdownPipeline/DiffVisualizer";

/* =========================
   TYPES
========================= */

type CodeProps = React.ComponentProps<"code">;

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
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
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
   SIMPLE HASH FUNCTION (안정적인 key 생성용)
========================= */

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).substring(0, 6);
}

/* =========================
   COMPONENT
========================= */

export default function CodeBlock_white({
  inline,
  className,
  children,
  index = 0,
  ...props
}: CodeProps & { index?: number }) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const text = String(children).replace(/\n$/, "");
  const match = /language-(.+)/.exec(className || "");
  const language = match?.[1]?.toLowerCase() || "";

  // ✅ 고유 인스턴스 ID (디버깅용)
  const instanceId = useMemo(() => {
    return `cbw-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  }, [index]);

  // ✅ 안정적인 key 생성 (콘텐츠 기반)
  const stableKey = useMemo(() => {
    const contentHash = simpleHash(text);
    return `cb3d-${index}-${contentHash}`;
  }, [text, index]);

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
  const isDiff = language === "diff" || language === "patch";

  /* =========================
     CLEANUP
  ========================= */
  useEffect(() => {
    console.log(`✅ CodeBlock_white[${instanceId}][${index}]: 마운트됨`);
    return () => {
      console.log(`🧹 CodeBlock_white[${instanceId}][${index}]: 언마운트됨`);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [instanceId, index]);

  /* =========================
     COPY
  ========================= */
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

  /* =========================
     INLINE CODE
  ========================= */
  if (isInline) {
    return (
      <code
        {...props}
        className={className}
        style={{
          background: "rgba(0,0,0,0.04)",
          color: "rgba(20,20,20,0.92)",
          padding: "2px 6px",
          borderRadius: 6,
          fontSize: "0.95em",
          border: "1px solid rgba(0,0,0,0.06)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
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
      <div style={{ margin: "18px 0" }}>
        <DiffVisualizer raw={text} />
      </div>
    );
  }

  /* =========================
     BLOCK CODE - 3D Enhanced
  ========================= */
  return (
    <motion.div
      ref={containerRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-instance-id={instanceId}
      style={{
        position: "relative",
        borderRadius: 14,
        overflow: "hidden",
        margin: "22px 0",
        background: "transparent",
        border: "none",
        boxShadow: "none",
      }}
    >
      {/* ✅ 3D 코드블록 - 안정적인 key 사용 */}
      <CodeBlock3D 
        key={stableKey}  // ← 변경됨: 콘텐츠 기반 안정적인 key
        language={language} 
        index={index}
      >
        {text}
      </CodeBlock3D>

      {/* COPY BUTTON */}
      <motion.button
        onClick={handleCopy}
        initial={false}
        animate={{
          opacity: hovered || copied ? 1 : 0.5,
          y: hovered || copied ? 0 : -2,
          scale: copied ? 1.02 : 1,
        }}
        transition={{ duration: 0.16 }}
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
          WebkitBackdropFilter: "blur(10px)",
          cursor: "pointer",
          zIndex: 20,
          transition: "background 0.18s ease, color 0.18s ease",
        }}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </motion.button>
    </motion.div>
  );
}
"use client";

import React, { useRef } from "react";

/* =========================
   Markdown Normalizer
========================= */
function normalizeGPTToMarkdown(input: string): string {
  if (!input) return "";

  return input
    .replace(/\r\n/g, "\n")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/^[\s]*[•\-\*]\s+/gm, "- ")
    .replace(/^\s*(\d+)\.\s+/gm, "$1. ")
    .replace(/^(#{1,6})\s*/gm, "$1 ")
    .replace(/(https?:\/\/[^\s]+)/g, "[$1]($1)")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/* =========================
   Hook
========================= */
function usePasteHandler(
  setValue: React.Dispatch<React.SetStateAction<string>>
) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const onPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();

    const el = e.currentTarget;

    const clipboard =
      e.clipboardData.getData("text/plain") ||
      e.clipboardData.getData("text/html") ||
      "";

    if (!clipboard) return;

    const normalized = normalizeGPTToMarkdown(clipboard);

    // 🔥 핵심: paste 순간 selection 기준으로 안전하게 계산
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;

    setValue((prev) => {
      return (
        prev.slice(0, start) +
        normalized +
        prev.slice(end)
      );
    });
  };

  return { ref, onPaste };
}

/* =========================
   Component
========================= */
export default function MarkdownPasteEditor({
  value,
  setValue,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { ref, onPaste } = usePasteHandler(setValue);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onPaste={onPaste}
      placeholder="Paste GPT content here..."
      style={{
        width: "100%",
        height: 400,
        padding: 12,
        fontFamily: "monospace",
        fontSize: 14,
        lineHeight: 1.5,
        whiteSpace: "pre-wrap",
        resize: "none",
      }}
    />
  );
}
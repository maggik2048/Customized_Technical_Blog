"use client";

import React, { useRef } from "react";

/**
 *  Clipboard → Markdown 자동 정리 엔진
 */
function normalizeGPTToMarkdown(input: string): string {
  if (!input) return "";

  let text = input;

  // 줄바꿈 정리
  text = text.replace(/\r\n/g, "\n");

  // HTML 제거 ( 브라우저 복붙 대응)
  text = text.replace(/<\/?[^>]+(>|$)/g, "");

  // bullet 통일
  text = text.replace(/^[\s]*[•\-\*]\s+/gm, "- ");

  // 숫자 리스트 정리
  text = text.replace(/^\s*(\d+)\.\s+/gm, "$1. ");

  // heading 보정
  text = text.replace(/^(#{1,6})\s*/gm, "$1 ");

  // URL 자동 링크 변환
  text = text.replace(
    /(https?:\/\/[^\s]+)/g,
    "[$1]($1)"
  );

  // 과도한 줄바꿈 제거
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

/**
 * textarea paste 자동 Markdown processor
 */
function useGPTPasteProcessor(
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>
) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const onPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const clipboard =
      e.clipboardData.getData("text/plain") ||
      e.clipboardData.getData("text/html");

    if (!clipboard) return;

    e.preventDefault();

    const normalized = normalizeGPTToMarkdown(clipboard);

    const el = ref.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;

    setValue((prev) =>
      prev.substring(0, start) +
      normalized +
      prev.substring(end)
    );
  };

  return { ref, onPaste };
}

/**
 * Main Component
 */
export default function MarkdowndirectPasteAutoProcessor({
  value,
  setValue,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { ref, onPaste } = useGPTPasteProcessor(value, setValue);

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
      }}
    />
  );
}
"use client";

import React, { useRef } from "react";

export default function PreservedCopyEditor() {
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleCopy = async () => {
    const text = ref.current?.value ?? "";
    await navigator.clipboard.writeText(text);
  };

  const normalizeText = (input: string) => {
    return input
      .replace(/\r\n/g, "\n")

      // 🔥 핵심 1: ; 뒤 줄바꿈
      .replace(/;\s*/g, ";\n")

      // 🔥 핵심 2: , 뒤 줄바꿈
      .replace(/,\s*/g, ",\n")

      // 🔥 핵심 3: ;} 패턴 처리 (이게 지금 핵심 문제)
      .replace(/;\s*}/g, ";\n}")

      // 🔥 핵심 4: } 앞뒤 구조 안정화 (선택 but 강력)
      .replace(/\s*}\s*/g, "\n}\n")

      // 🔥 핵심 5: 연속 줄바꿈 정리
      .replace(/\n{3,}/g, "\n\n");
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();

    const raw = e.clipboardData.getData("text/plain");

    const el = ref.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;

    const text = normalizeText(raw);

    const before = el.value.slice(0, start);
    const after = el.value.slice(end);

    el.value = before + text + after;

    const pos = (before + text).length;
    el.setSelectionRange(pos, pos);
  };

  return (
    <div>
      <button onClick={handleCopy}>Copy</button>

      <textarea
        ref={ref}
        defaultValue={`line1
line2
line3`}
        onPaste={handlePaste}
        style={{
          width: "100%",
          height: "200px",
          whiteSpace: "pre",
        }}
      />
    </div>
  );
}
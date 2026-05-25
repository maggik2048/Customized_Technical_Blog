import React, { useRef } from "react";

export default function PreservedCopyEditor() {
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleCopy = async () => {
    const text = ref.current?.value ?? "";

    // 핵심: plain text로 직접 clipboard에 넣기
    await navigator.clipboard.writeText(text);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();

    // 붙여넣기 시에도 줄바꿈 유지
    const text = e.clipboardData.getData("text/plain");

    const el = ref.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;

    const before = text.slice(0, start);
    const after = text.slice(end);

    el.value = before + text + after;
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
          whiteSpace: "pre", // 줄바꿈 유지 핵심
        }}
      />
    </div>
  );
}
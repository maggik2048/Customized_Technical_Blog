import React, { useRef } from "react";

export default function HighlightableText() {
  const containerRef = useRef<HTMLDivElement>(null);

  const applyHighlight = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);

    if (!containerRef.current?.contains(range.commonAncestorContainer)) return;

    const span = document.createElement("span");
    span.className = "brush-highlight";

    const contents = range.extractContents();
    span.appendChild(contents);
    range.insertNode(span);

    selection.removeAllRanges();
  };

  const handleMouseUp = () => {
    // 약간의 delay를 줘야 selection이 안정적으로 잡힘
    setTimeout(() => {
      applyHighlight();
    }, 0);
  };

  return (
    <div
      ref={containerRef}
      className="text-area"
      onMouseUp={handleMouseUp}
    >
      여기 텍스트를 드래그하면 바로 형광펜 효과가 적용됨
    </div>
  );
}
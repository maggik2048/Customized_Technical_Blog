"use client";

import React from "react";

export type HighlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type Highlight = {
  id: string;
  rects: HighlightRect[];
};

type Props = {
  highlights: Highlight[];
  containerRef: React.RefObject<HTMLDivElement>;
};

export default function HighlightLayer({
  highlights,
  containerRef,
}: Props) {
  const [containerRect, setContainerRect] =
    React.useState<DOMRect | null>(null);

  /**
   * =========================
   * container rect tracking
   * (scroll / resize 대응)
   * =========================
   */
  React.useEffect(() => {
    if (!containerRef.current) return;

    const update = () => {
      setContainerRect(
        containerRef.current!.getBoundingClientRect()
      );
    };

    update();

    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [containerRef]);

  if (!containerRect) return null;

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {highlights.flatMap((h) =>
        h.rects.map((r, i) => {
          const x = r.left - containerRect.left;
          const y = r.top - containerRect.top;

          const w = r.width;
          const hgt = r.height;

          /**
           * =========================
           * brush-like ink shape
           * (살짝 휘어진 형광펜)
           * =========================
           */
          const path = `
            M ${x} ${y + hgt * 0.75}
            Q ${x + w * 0.25} ${y + hgt * 0.15},
              ${x + w * 0.55} ${y + hgt * 0.25}
            Q ${x + w * 0.85} ${y + hgt * 0.35},
              ${x + w} ${y + hgt * 0.7}
            L ${x + w} ${y + hgt}
            L ${x} ${y + hgt}
            Z
          `;

          return (
            <path
              key={`${h.id}-${i}`}
              d={path}
              fill="rgba(255, 235, 59, 0.45)"
            />
          );
        })
      )}
    </svg>
  );
}
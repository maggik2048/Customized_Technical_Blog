"use client";

import React from "react";

export default function PaperDecorFrame({
  children,
  enabled = true,
}: {
  children: React.ReactNode;
  enabled?: boolean;
}) {
  /* 비활성 페이지 */
  if (!enabled) {
    return (
      <div
        style={{
          borderRadius: 14,
          overflow: "hidden",

          border: "1px solid rgba(255,255,255,0.08)",

          boxShadow: "0 4px 18px rgba(0,0,0,0.10)",
        }}
      >
        {children}
      </div>
    );
  }

  /* 활성 페이지 */
  return (
    <div
      style={{
        position: "relative",

        padding: 12,

        borderRadius: 18,

        /* 내부 거의 투명 */
        background: "rgba(255,255,255,0.005)",

        /* 메인 프레임 */
        border: "2.5px solid rgba(255,252,246,0.92)",

        /* blur/glow 제거 */
        boxShadow: `
          0 0 0 1px rgba(255,252,245,0.30),
          0 10px 40px rgba(0,0,0,0.16)
        `,

        overflow: "hidden",

        willChange: "transform",
        backfaceVisibility: "hidden",
        transformStyle: "preserve-3d",
      }}
    >
      {/* 내부 라인 */}
      <div
        style={{
          position: "absolute",

          inset: 3,

          border: "15px solid rgba(255,252,245,0.60)",

          borderRadius: 14,

          pointerEvents: "none",
        }}
      />

      {/* 아르데코 코너 장식 */}
      {[
        { top: 10, left: 10, rotate: "0deg" },
        { top: 10, right: 10, rotate: "90deg" },
        { bottom: 10, right: 10, rotate: "180deg" },
        { bottom: 10, left: 10, rotate: "270deg" },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",

            width: 70,
            height: 70,

            ...(pos.top !== undefined ? { top: pos.top } : {}),
            ...(pos.bottom !== undefined ? { bottom: pos.bottom } : {}),
            ...(pos.left !== undefined ? { left: pos.left } : {}),
            ...(pos.right !== undefined ? { right: pos.right } : {}),

            transform: `rotate(${pos.rotate})`,

            pointerEvents: "none",
          }}
        >
          <svg
            width="70"
            height="70"
            viewBox="0 0 70 70"
            fill="none"
          >
            {/* 메인 라인 */}
            <path
              d="M2 35 L2 2 L35 2"
              stroke="rgba(255,253,248,0.96)"
              strokeWidth="3"
            />

            {/* 내부 라인 */}
            <path
              d="M10 35 L10 10 L35 10"
              stroke="rgba(255,250,245,0.75)"
              strokeWidth="1.5"
            />

            {/* deco */}
            <path
              d="M20 2 L20 20"
              stroke="rgba(255,252,248,0.92)"
              strokeWidth="2"
            />

            <path
              d="M2 20 L20 20"
              stroke="rgba(255,252,248,0.92)"
              strokeWidth="2"
            />

            {/* diamond */}
            <rect
              x="16"
              y="16"
              width="8"
              height="8"
              transform="rotate(45 20 20)"
              fill="rgba(255,252,248,0.88)"
            />

            {/* curve */}
            <path
              d="M35 2 Q26 8 20 20"
              stroke="rgba(255,252,248,0.50)"
              strokeWidth="1.2"
            />

            {/* extra deco */}
            <path
              d="M2 28 Q10 24 16 16"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="1"
            />
          </svg>
        </div>
      ))}

      {/* subtle sheen only */}
      <div
        style={{
          position: "absolute",

          inset: 0,

          borderRadius: 18,

          background: `
            linear-gradient(
              135deg,
              rgba(255,255,255,0.025),
              transparent 20%,
              transparent 80%,
              rgba(255,252,245,0.015)
            )
          `,

          pointerEvents: "none",
        }}
      />

      {/* 콘텐츠 */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
        {children}
      </div>
    </div>
  );
}
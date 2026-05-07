"use client";

import React from "react";

export default function PaperDecorFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "relative",

        /* 페이지에 더 붙게 */
        padding: 12,

        borderRadius: 18,

        /* 내부 거의 투명 */
        background: "rgba(255,255,255,0.008)",

        /* 메인 프레임 */
        border: "2px solid rgba(255,245,210,0.94)",

        boxShadow: `
          0 0 0 1px rgba(255,240,200,0.45),
          0 0 12px rgba(255,245,220,0.14),
          0 0 26px rgba(255,235,180,0.08),
          0 10px 40px rgba(0,0,0,0.18)
        `,

        overflow: "hidden",
      }}
    >
      {/* 외곽 glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 18,

          boxShadow: `
            inset 0 0 18px rgba(255,245,220,0.05),
            0 0 18px rgba(255,245,220,0.05)
          `,

          pointerEvents: "none",
        }}
      />

      {/* 내부 이중 라인 */}
      <div
        style={{
          position: "absolute",
          inset: 6,

          border: "1.5px solid rgba(255,248,225,0.78)",
          borderRadius: 14,

          boxShadow: `
            0 0 8px rgba(255,245,220,0.06)
          `,

          pointerEvents: "none",
        }}
      />

      {/* 아르데코 코너 장식 */}
      {[
        {
          top: 10,
          left: 10,
          rotate: "0deg",
        },
        {
          top: 10,
          right: 10,
          rotate: "90deg",
        },
        {
          bottom: 10,
          right: 10,
          rotate: "180deg",
        },
        {
          bottom: 10,
          left: 10,
          rotate: "270deg",
        },
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

            filter: `
              drop-shadow(0 0 4px rgba(255,255,240,0.32))
              drop-shadow(0 0 12px rgba(255,240,200,0.16))
            `,
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
              stroke="rgba(255,250,235,0.98)"
              strokeWidth="3"
            />

            {/* 내부 라인 */}
            <path
              d="M10 35 L10 10 L35 10"
              stroke="rgba(255,245,220,0.75)"
              strokeWidth="1.5"
            />

            {/* 장식 선 */}
            <path
              d="M20 2 L20 20"
              stroke="rgba(255,248,230,0.95)"
              strokeWidth="2"
            />

            <path
              d="M2 20 L20 20"
              stroke="rgba(255,248,230,0.95)"
              strokeWidth="2"
            />

            {/* 다이아 장식 */}
            <rect
              x="16"
              y="16"
              width="8"
              height="8"
              transform="rotate(45 20 20)"
              fill="rgba(255,248,230,0.92)"
            />

            {/* 추가 deco */}
            <path
              d="M35 2 Q26 8 20 20"
              stroke="rgba(255,248,230,0.55)"
              strokeWidth="1.2"
            />
          </svg>
        </div>
      ))}

      {/* metallic sheen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 18,

          background: `
            linear-gradient(
              135deg,
              rgba(255,255,255,0.045),
              transparent 18%,
              transparent 82%,
              rgba(255,248,220,0.03)
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
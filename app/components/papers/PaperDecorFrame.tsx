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

        /* 페이지에 더 밀착 */
        padding: 12,

        borderRadius: 18,

        /* 내부는 거의 안 보이게 */
        background: "rgba(255,255,255,0.006)",

        /* 화이트 골드 메인 프레임 */
        border: "2px solid rgba(255,250,242,0.96)",

        /* glow 강화 + white ivory 느낌 */
        boxShadow: `
          0 0 0 1px rgba(255,250,240,0.52),
          0 0 14px rgba(255,252,245,0.16),
          0 0 34px rgba(255,248,235,0.10),
          0 0 60px rgba(255,248,240,0.05),
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
            inset 0 0 18px rgba(255,250,245,0.05),
            0 0 22px rgba(255,252,248,0.06)
          `,

          pointerEvents: "none",
        }}
      />

      {/* 내부 이중 라인 */}
      <div
        style={{
          position: "absolute",
          inset: 6,

          border: "1.5px solid rgba(255,252,245,0.82)",
          borderRadius: 14,

          boxShadow: `
            0 0 10px rgba(255,252,245,0.08)
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
              drop-shadow(0 0 5px rgba(255,255,255,0.34))
              drop-shadow(0 0 18px rgba(255,250,240,0.22))
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
              stroke="rgba(255,253,248,0.99)"
              strokeWidth="3"
            />

            {/* 내부 라인 */}
            <path
              d="M10 35 L10 10 L35 10"
              stroke="rgba(255,250,245,0.82)"
              strokeWidth="1.5"
            />

            {/* 장식 선 */}
            <path
              d="M20 2 L20 20"
              stroke="rgba(255,252,248,0.96)"
              strokeWidth="2"
            />

            <path
              d="M2 20 L20 20"
              stroke="rgba(255,252,248,0.96)"
              strokeWidth="2"
            />

            {/* 다이아 장식 */}
            <rect
              x="16"
              y="16"
              width="8"
              height="8"
              transform="rotate(45 20 20)"
              fill="rgba(255,252,248,0.94)"
            />

            {/* 곡선 deco */}
            <path
              d="M35 2 Q26 8 20 20"
              stroke="rgba(255,252,248,0.60)"
              strokeWidth="1.2"
            />

            {/* 추가 deco line */}
            <path
              d="M2 28 Q10 24 16 16"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1"
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
              rgba(255,255,255,0.05),
              transparent 18%,
              transparent 82%,
              rgba(255,252,245,0.035)
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
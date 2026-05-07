"use client";

import React from "react";

export default function PaperDecorFrame({
  children,
  enabled = true,
}: {
  children: React.ReactNode;
  enabled?: boolean;
}) {
  /* 비활성 페이지는 lightweight */
  if (!enabled) {
    return (
      <div
        style={{
          borderRadius: 14,
          overflow: "hidden",

          border: "1px solid rgba(255,255,255,0.08)",

          boxShadow: `
            0 4px 20px rgba(0,0,0,0.10)
          `,
        }}
      >
        {children}
      </div>
    );
  }

  /* 현재 페이지만 full glow */
  return (
    <div
      style={{
        position: "relative",

        padding: 12,

        borderRadius: 18,

        background: "rgba(255,255,255,0.006)",

        border: "2px solid rgba(255,250,242,0.96)",

        boxShadow: `
          0 0 0 1px rgba(255,252,245,0.62),

          0 0 16px rgba(255,255,250,0.20),

          0 0 40px rgba(255,250,240,0.14),

          0 0 85px rgba(255,248,235,0.09),

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

      {/* bloom */}
      <div
        style={{
          position: "absolute",
          inset: -20,
          borderRadius: 30,

          background: `
            radial-gradient(
              circle,
              rgba(255,255,255,0.05),
              rgba(255,248,235,0.025),
              transparent 70%
            )
          `,

          filter: "blur(10px)",

          pointerEvents: "none",
        }}
      />

      {/* 내부 라인 */}
      <div
        style={{
          position: "absolute",
          inset: 6,

          border: "1.5px solid rgba(255,252,245,0.82)",
          borderRadius: 14,

          pointerEvents: "none",
        }}
      />

      {/* 코너 장식 */}
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

            filter: `
              drop-shadow(0 0 6px rgba(255,255,255,0.42))
              drop-shadow(0 0 20px rgba(255,252,245,0.22))
            `,
          }}
        >
          <svg
            width="70"
            height="70"
            viewBox="0 0 70 70"
            fill="none"
          >
            <path
              d="M2 35 L2 2 L35 2"
              stroke="rgba(255,253,248,0.99)"
              strokeWidth="3"
            />

            <path
              d="M10 35 L10 10 L35 10"
              stroke="rgba(255,250,245,0.82)"
              strokeWidth="1.5"
            />

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

            <rect
              x="16"
              y="16"
              width="8"
              height="8"
              transform="rotate(45 20 20)"
              fill="rgba(255,252,248,0.94)"
            />

            <path
              d="M35 2 Q26 8 20 20"
              stroke="rgba(255,252,248,0.60)"
              strokeWidth="1.2"
            />

            <path
              d="M2 28 Q10 24 16 16"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1"
            />
          </svg>
        </div>
      ))}

      {/* sheen */}
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
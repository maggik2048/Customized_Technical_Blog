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
        borderRadius: 20,
        padding: 30,

        /* 내부는 거의 안 보이게 */
        background: "rgba(255,255,255,0.01)",

        /* 메인 프레임 */
        border: "2px solid rgba(255,245,210,0.92)",

        /* 밝은 화이트골드 glow */
        boxShadow: `
          0 0 0 1px rgba(255,240,200,0.45),
          0 0 10px rgba(255,245,220,0.14),
          0 0 22px rgba(255,235,180,0.08),
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
          borderRadius: 20,

          boxShadow: `
            inset 0 0 18px rgba(255,245,220,0.05),
            0 0 18px rgba(255,245,220,0.06)
          `,

          pointerEvents: "none",
        }}
      />

      {/* 내부 라인 */}
      <div
        style={{
          position: "absolute",
          inset: 10,

          border: "2px solid rgba(255,248,225,0.75)",
          borderRadius: 15,

          boxShadow: `
            0 0 10px rgba(255,245,220,0.08)
          `,

          pointerEvents: "none",
        }}
      />

      {/* 코너 장식 */}
      {[
        { top: 14, left: 14 },
        { top: 14, right: 14 },
        { bottom: 14, left: 14 },
        { bottom: 14, right: 14 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 54,
            height: 54,

            pointerEvents: "none",

            ...(pos.top !== undefined ? { top: pos.top } : {}),
            ...(pos.bottom !== undefined ? { bottom: pos.bottom } : {}),
            ...(pos.left !== undefined ? { left: pos.left } : {}),
            ...(pos.right !== undefined ? { right: pos.right } : {}),

            borderTop:
              pos.top !== undefined
                ? "3px solid rgba(255,250,235,0.98)"
                : undefined,

            borderLeft:
              pos.left !== undefined
                ? "3px solid rgba(255,250,235,0.98)"
                : undefined,

            borderRight:
              pos.right !== undefined
                ? "3px solid rgba(255,250,235,0.98)"
                : undefined,

            borderBottom:
              pos.bottom !== undefined
                ? "3px solid rgba(255,250,235,0.98)"
                : undefined,

            filter: `
              drop-shadow(0 0 4px rgba(255,255,240,0.35))
              drop-shadow(0 0 10px rgba(255,240,200,0.18))
            `,
          }}
        />
      ))}

      {/* metallic sheen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 20,

          background: `
            linear-gradient(
              135deg,
              rgba(255,255,255,0.05),
              transparent 18%,
              transparent 82%,
              rgba(255,248,220,0.04)
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
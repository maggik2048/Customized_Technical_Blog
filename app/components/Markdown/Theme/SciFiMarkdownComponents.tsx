import React from "react";

/* ---------------- 색상 (조금 더 채도 ↑) ---------------- */

const colors = {
  h1: "rgba(255,255,240,0.99)",   // 더 선명한 옐로우 화이트
  h2: "rgba(160,230,255,0.95)",   // 더 시안 느낌
  h3: "rgba(180,255,180,0.95)",   // 더 그린 느낌
  bullet: "rgba(255,190,120,0.92)", // 오렌지 살짝 강조
};

/* ---------------- shadow (검정 박스형) ---------------- */

const boxShadowText = `
  0 2px 6px rgba(0,0,0,0.25),
  0 6px 18px rgba(0,0,0,0.18),
  0 12px 32px rgba(0,0,0,0.12)
`;

/* ---------------- 컴포넌트 ---------------- */

export const sciFiMarkdownComponents = {
  h1: ({ children }: any) => (
    <h1
      style={{
        color: colors.h1,
        fontWeight: 800,
        opacity: 0.98,

        textShadow: boxShadowText,
      }}
    >
      {children}
    </h1>
  ),

  h2: ({ children }: any) => (
    <h2
      style={{
        color: colors.h2,
        fontWeight: 700,
        opacity: 0.97,

        textShadow: boxShadowText,
      }}
    >
      {children}
    </h2>
  ),

  h3: ({ children }: any) => (
    <h3
      style={{
        color: colors.h3,
        fontWeight: 700,
        opacity: 0.96,

        textShadow: boxShadowText,
      }}
    >
      {children}
    </h3>
  ),

  li: ({ children }: any) => (
    <li
      style={{
        color: "rgba(235,235,235,0.95)",
        marginBottom: 6,

        textShadow: "0 2px 10px rgba(0,0,0,0.2)",
      }}
    >
      <span
        style={{
          color: colors.bullet,
          marginRight: 6,
          opacity: 0.95,

          textShadow: "0 2px 8px rgba(0,0,0,0.25)",
        }}
      >
        ▸
      </span>
      {children}
    </li>
  ),
};
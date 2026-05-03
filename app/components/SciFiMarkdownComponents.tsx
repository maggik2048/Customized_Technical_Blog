import React from "react";

/* ---------------- 색상 토큰 ---------------- */

const colors = {
  h1: "#FFFF00",  // 노랑
  h2: "#00E5FF",   // 파랑
  h3: "#39FF14",   // 연두
  bullet: "#FF3D00", // 주황
};

/* ---------------- 컴포넌트 ---------------- */

export const sciFiMarkdownComponents = {
  h1: ({ children }: any) => (
    <h1 style={{ color: colors.h1, fontWeight: 800 }}>
      {children}
    </h1>
  ),

  h2: ({ children }: any) => (
    <h2 style={{ color: colors.h2, fontWeight: 700 }}>
      {children}
    </h2>
  ),

  h3: ({ children }: any) => (
    <h3 style={{ color: colors.h3, fontWeight: 700 }}>
      {children}
    </h3>
  ),

  li: ({ children }: any) => (
    <li
      style={{
        color: "#ddd",
        marginBottom: 6,
      }}
    >
      <span style={{ color: colors.bullet, marginRight: 6 }}>
        ▸
      </span>
      {children}
    </li>
  ),
};
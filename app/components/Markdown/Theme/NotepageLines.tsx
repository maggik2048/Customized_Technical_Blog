"use client";

import React from "react";

export default function NotepageLines({ children, node }: any) {
  // ✅ node가 없을 경우 기본값 0 사용
  const line = node?.position?.start?.line ?? 0;
  const isEven = line % 2 === 0;

  // ✅ p → div로 변경
  return (
    <div
      style={{
        padding: "6px 0",
        lineHeight: 1.6,

        borderBottom: isEven
          ? "1px dashed rgba(255,255,255,0.08)"
          : "1px solid transparent",

        opacity: isEven ? 1 : 0.85,

        transition: "all 0.2s ease",
      }}
    >
      {children}
    </div>
  );
}
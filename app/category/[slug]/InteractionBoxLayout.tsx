// InteractionBoxLayout.tsx

"use client";

import React from "react";

export default function InteractionBoxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: "100%",

        display: "flex",

        // interaction 영역만 왼쪽 정렬
        justifyContent: "flex-start",

        paddingLeft: 390,
        paddingRight: 40,

        boxSizing: "border-box",

        flexShrink: 0,

        // interaction 전체만 왼쪽으로 이동
        transform: "translateX(-120px)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,

          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
}
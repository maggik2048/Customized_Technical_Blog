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

        // interaction 영역 positioning 책임
        justifyContent: "flex-start",

        paddingLeft: 390,
        paddingRight: 40,

        boxSizing: "border-box",

        flexShrink: 0,

        transform: "translateX(-120px)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,

          position: "relative",

          // interaction stack 책임도 여기로 이동
          display: "flex",
          flexDirection: "column",
          gap: 56,
        }}
      >
        {children}
      </div>
    </div>
  );
}
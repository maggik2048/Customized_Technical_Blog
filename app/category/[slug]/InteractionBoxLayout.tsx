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
        justifyContent: "center",

        // 여기서부터 레이아웃 책임 분리
        paddingLeft: 40,
        paddingRight: 40,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 5900,

          // 인터랙션 박스 전용 “시각적 기준선”
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
}
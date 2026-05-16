// @/components/ViewportGuard.tsx
"use client";

import React from "react";

type ViewportGuardProps = {
  children: React.ReactNode;
  width?: string | number;
  maxWidth?: string | number;
};

export default function ViewportGuard({ 
  children, 
  width = "100%", 
  maxWidth = "1200px" 
}: ViewportGuardProps) {
  return (
    <div
      style={{
        position: "relative",
        width: width,
        maxWidth: maxWidth,
        margin: "0 auto",
        // 핵심: 이 범위를 벗어나면 렌더링은 되더라도 화면에 보이지 않게 '뚝' 끊음
        overflow: "hidden", 
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      {children}
    </div>
  );
}
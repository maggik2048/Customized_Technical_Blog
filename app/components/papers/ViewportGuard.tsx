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
  maxWidth = "1400px" // 뷰어 크기에 맞춰 조정
}: ViewportGuardProps) {
  return (
    <div
      style={{
        position: "relative",
        width: width,
        maxWidth: maxWidth,
        margin: "0 auto",
        
        // 핵심 수정: 가로만 자르고 세로는 스크롤 가능하게 변경
        overflowX: "hidden", 
        overflowY: "auto", 
        
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        
        // 스크롤바를 숨기고 싶을 경우 추가 (선택사항)
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
      className="hide-scrollbar" // CSS로 추가 제어 가능
    >
      {children}
    </div>
  );
}
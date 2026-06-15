"use client";

import React from "react";

interface DocContentBackgroundManagerProps {
  children: React.ReactNode;
  isDark?: boolean;
  backgroundColor?: string;
  paddingTop?: number;
  paddingBottom?: number;
  marginOffset?: number;
  allowOverflow?: boolean; // 🔑 추가: overflow 허용 여부
}

/**
 * DocContentBackgroundManager
 * 
 * 문서 콘텐츠 영역의 배경을 관리하는 컴포넌트
 * - pageStyle의 padding을 뚫고 나가서 전체 너비를 채움
 * - 세로로 자연스럽게 확장됨
 */
export default function DocContentBackgroundManager({
  children,
  isDark = false,
  backgroundColor = "red",
  paddingTop = 20,
  paddingBottom = 20,
  marginOffset = 64,
  allowOverflow = true, // 기본값 true (letter 박스 변환 허용)
}: DocContentBackgroundManagerProps) {

  return (
    <div
      style={{
        backgroundColor: backgroundColor,
        marginLeft: -marginOffset,
        marginRight: -marginOffset,
        paddingLeft: marginOffset,
        paddingRight: marginOffset,
        paddingTop: paddingTop,
        paddingBottom: paddingBottom,
        width: `calc(100% + ${marginOffset * 2}px)`,
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
        overflow: allowOverflow ? "visible" : "hidden", // 🔑 핵심
        // 다크모드에 따른 추가 스타일
        ...(isDark && {
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
        }),
      }}
    >
      {children}
    </div>
  );
}
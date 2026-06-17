"use client";

import React from "react";

//  기본 배경 이미지 상수화
const DEFAULT_BG_IMAGE = "/images/dossierBg/woodmarble23.jpg";

interface DocContentBackgroundManagerProps {
  children: React.ReactNode;
  parentPaddingLeft?: number;
  parentPaddingRight?: number;
  backgroundColor?: string;
  backgroundImage?: string; // 외부에서 덮어쓰고 싶을 때만 사용
  backgroundSize?: "cover" | "contain" | "auto" | string;
  backgroundPosition?: string;
  backgroundRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  backgroundBlendMode?: string;
  paddingTop?: number;
  paddingBottom?: number;
}

export default function DocContentBackgroundManager({
  children,
  parentPaddingLeft = 64,
  parentPaddingRight = 64,
  backgroundColor = "transparent",
  backgroundImage = DEFAULT_BG_IMAGE,
  backgroundSize = "auto", //  원본 크기 유지 (tile 효과)
  backgroundPosition = "center center",
  backgroundRepeat = "repeat", //  가로/세로 반복 (tile 효과)
  backgroundBlendMode = "overlay",
  paddingTop = 20,
  paddingBottom = 20,
}: DocContentBackgroundManagerProps) {
  const containerStyle: React.CSSProperties = {
    marginLeft: -parentPaddingLeft,
    marginRight: -parentPaddingRight,
    paddingLeft: parentPaddingLeft,
    paddingRight: parentPaddingRight,
    paddingTop,
    paddingBottom,
    position: "relative",
    backgroundColor,
    ...(backgroundImage && {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize,
      backgroundPosition,
      backgroundRepeat,
      backgroundBlendMode: backgroundBlendMode as any,
    }),
  };

  const contentStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 1,
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>{children}</div>
    </div>
  );
}
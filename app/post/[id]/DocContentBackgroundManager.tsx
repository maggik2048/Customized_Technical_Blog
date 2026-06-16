"use client";

import React from "react";

interface DocContentBackgroundManagerProps {
  children: React.ReactNode;
  parentPaddingLeft?: number;
  parentPaddingRight?: number;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;     // ✅ 직접 조절 가능하게 추가
  backgroundPosition?: string; // ✅ 직접 조절 가능하게 추가
  backgroundRepeat?: string;   // ✅ 직접 조절 가능하게 추가
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  paddingTop?: number;
  paddingBottom?: number;
}

export default function DocContentBackgroundManager({
  children,
  parentPaddingLeft = 64,
  parentPaddingRight = 64,
  backgroundColor = "transparent",
  backgroundImage,
  backgroundSize = "auto",      // ✅ 기본값 auto (원본 크기 그대로)
  backgroundPosition = "center center",
  backgroundRepeat = "no-repeat",
  objectFit = "cover",
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
  };

  const imgContainerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    borderRadius: 12,
    overflow: "hidden",
  };

  const imgStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: objectFit,
    objectPosition: backgroundPosition,
    display: "block",
  };

  const contentStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 1,
  };

  return (
    <div style={containerStyle}>
      {backgroundImage && (
        <div style={imgContainerStyle}>
          <img src={backgroundImage} alt="" style={imgStyle} />
        </div>
      )}
      <div style={contentStyle}>{children}</div>
    </div>
  );
}
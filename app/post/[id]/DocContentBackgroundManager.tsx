"use client";

import React from "react";
import { useTheme } from "@/app/contexts/ThemeContext";

// 배경 이미지 상수화
const DEFAULT_BG_IMAGE = "/images/dossierBg/woodmarble233.png";
const MARBLE_BG_IMAGE = "/images/dossierBg/marble222.png";

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
  // 강제로 특정 배경을 사용하고 싶을 때
  forceDefaultBackground?: boolean;
  forceMarbleBackground?: boolean;
  // 🆕 marble2.png 전용 설정 (기본 테마)
  marbleBackgroundSize?: string;
  marbleBackgroundRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  // 🆕 woodmarble233.png 전용 설정 (노트/레터 테마)
  woodMarbleBackgroundSize?: string;
  woodMarbleBackgroundRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
}

export default function DocContentBackgroundManager({
  children,
  parentPaddingLeft = 64,
  parentPaddingRight = 64,
  backgroundColor = "transparent",
  backgroundImage, // 이제 기본값을 여기서 설정하지 않음
  backgroundSize = "auto", // 원본 크기 유지 (tile 효과)
  backgroundPosition = "center center",
  backgroundRepeat = "repeat", // 가로/세로 반복 (tile 효과)
  backgroundBlendMode = "overlay",
  paddingTop = 20,
  paddingBottom = 20,
  forceDefaultBackground = false,
  forceMarbleBackground = false,
  // 🆕 marble2.png 전용 설정 (기본 테마)
  marbleBackgroundSize = "1200px 800px", // 기본값: 400px x 400px 타일
  marbleBackgroundRepeat = "repeat", // 기본값: 반복
  // 🆕 woodmarble233.png 전용 설정 (노트/레터 테마)
  woodMarbleBackgroundSize = "auto", // 기본값: 원본 크기 유지
  woodMarbleBackgroundRepeat = "repeat", // 기본값: 반복
}: DocContentBackgroundManagerProps) {
  // 테마 컨텍스트 가져오기 (선택적으로)
  let theme;
  try {
    theme = useTheme();
  } catch (error) {
    // ThemeProvider가 없으면 기본값 사용
    console.warn("DocContentBackgroundManager: ThemeProvider not found, using default background");
    theme = null;
  }

  // 사용할 배경 이미지 결정
  const getBackgroundImage = () => {
    // 1. 외부에서 명시적으로 제공된 경우 우선 사용
    if (backgroundImage) {
      return backgroundImage;
    }

    // 2. 강제 오버라이드
    if (forceDefaultBackground) {
      return DEFAULT_BG_IMAGE;
    }
    if (forceMarbleBackground) {
      return MARBLE_BG_IMAGE;
    }

    // 3. 테마가 없으면 기본값 사용
    if (!theme) {
      return DEFAULT_BG_IMAGE;
    }

    // 4. 테마에 따른 자동 선택
    // 기본 테마(RemarkPageRenderer)에서는 marble2.png 사용
    if (theme.isDefaultTheme) {
      return MARBLE_BG_IMAGE;
    }

    // 노트/레터 테마에서는 woodmarble233.png 사용
    return DEFAULT_BG_IMAGE;
  };

  // 🆕 테마별 backgroundSize 결정
  const getBackgroundSize = () => {
    // 1. 외부에서 명시적으로 제공된 경우 우선 사용
    if (backgroundImage && backgroundSize) {
      return backgroundSize;
    }

    const image = getBackgroundImage();

    // 2. 강제 오버라이드
    if (forceDefaultBackground) {
      return woodMarbleBackgroundSize;
    }
    if (forceMarbleBackground) {
      return marbleBackgroundSize;
    }

    // 3. 테마가 없으면 기본값 사용
    if (!theme) {
      return woodMarbleBackgroundSize;
    }

    // 4. 테마별 설정 적용
    if (theme.isDefaultTheme) {
      return marbleBackgroundSize; // marble2.png 전용 사이즈
    }

    // 노트/레터 테마
    return woodMarbleBackgroundSize; // woodmarble233.png 전용 사이즈
  };

  // 🆕 테마별 backgroundRepeat 결정
  const getBackgroundRepeat = () => {
    // 1. 외부에서 명시적으로 제공된 경우 우선 사용
    if (backgroundImage && backgroundRepeat) {
      return backgroundRepeat;
    }

    const image = getBackgroundImage();

    // 2. 강제 오버라이드
    if (forceDefaultBackground) {
      return woodMarbleBackgroundRepeat;
    }
    if (forceMarbleBackground) {
      return marbleBackgroundRepeat;
    }

    // 3. 테마가 없으면 기본값 사용
    if (!theme) {
      return woodMarbleBackgroundRepeat;
    }

    // 4. 테마별 설정 적용
    if (theme.isDefaultTheme) {
      return marbleBackgroundRepeat; // marble2.png 전용 반복 설정
    }

    // 노트/레터 테마
    return woodMarbleBackgroundRepeat; // woodmarble233.png 전용 반복 설정
  };

  const finalBackgroundImage = getBackgroundImage();
  const finalBackgroundSize = getBackgroundSize();
  const finalBackgroundRepeat = getBackgroundRepeat();

  const containerStyle: React.CSSProperties = {
    marginLeft: -parentPaddingLeft,
    marginRight: -parentPaddingRight,
    paddingLeft: parentPaddingLeft,
    paddingRight: parentPaddingRight,
    paddingTop,
    paddingBottom,
    position: "relative",
    backgroundColor,
    backgroundImage: `url(${finalBackgroundImage})`,
    backgroundSize: finalBackgroundSize,
    backgroundPosition,
    backgroundRepeat: finalBackgroundRepeat,
    backgroundBlendMode: backgroundBlendMode as any,
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
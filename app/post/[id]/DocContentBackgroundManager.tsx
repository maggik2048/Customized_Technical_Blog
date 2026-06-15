"use client";

import React from "react";

interface DocContentBackgroundManagerProps {
  children: React.ReactNode;
  /** 부모 컨테이너의 왼쪽 패딩 값 (px) */
  parentPaddingLeft?: number;
  /** 부모 컨테이너의 오른쪽 패딩 값 (px) */
  parentPaddingRight?: number;
  /** 배경색 (기본값: transparent) */
  backgroundColor?: string;
  /** 배경 이미지 URL */
  backgroundImage?: string;
  /** 배경 이미지 크기 */
  backgroundSize?: string;
  /** 배경 이미지 위치 */
  backgroundPosition?: string;
  /** 배경 이미지 반복 */
  backgroundRepeat?: string;
  /** 배경 블렌드 모드 */
  backgroundBlendMode?: string;
  /** 상단 패딩 (px) */
  paddingTop?: number;
  /** 하단 패딩 (px) */
  paddingBottom?: number;
}

/**
 * DocContentBackgroundManager
 * 
 * 부모 컨테이너의 패딩을 상쇄하면서 전체 너비로 확장되는 배경 레이어를 제공하는 컴포넌트
 * 
 * @description
 * [문제 상황]
 * - 부모 컨테이너에 paddingLeft/Right가 적용된 상태에서 특정 영역만 전체 너비 배경을 적용해야 함
 * - 초기 접근: transform + left: 50% 방식으로 중앙 정렬 시도 → 내부 콘텐츠 위치 계산 컨텍스트 깨짐
 * 
 * [최종 해결책]
 * - CSS Transform 완전 배제, 순수 margin 기반 레이아웃
 * - marginLeft/Right 음수값으로 부모 패딩 상쇄
 * - width 속성 미지정 (브라우저 자동 계산에 위임)
 * - left: 0, right: 0 명시적 지정으로 위치 컨텍스트 명확화
 * 
 * [기술적 인사이트]
 * 1. CSS Transform은 새로운 stacking context와 containing block을 생성하여 내부 요소의 position 참조 기준을 변경함
 * 2. margin 음수값은 부모의 padding을 안전하게 상쇄하면서 내부 요소의 레이아웃 컨텍스트는 유지함
 * 3. 명시적 width 지정보다 브라우저의 자동 레이아웃 계산에 맡기는 것이 복합 컴포넌트에서 더 안정적
 */
export default function DocContentBackgroundManager({
  children,
  parentPaddingLeft = 64,
  parentPaddingRight = 64,
  backgroundColor = "transparent",
  backgroundImage,
  backgroundSize = "cover",
  backgroundPosition = "center center",
  backgroundRepeat = "no-repeat",
  backgroundBlendMode,
  paddingTop = 20,
  paddingBottom = 20,
}: DocContentBackgroundManagerProps) {
  const style: React.CSSProperties = {
    marginLeft: -parentPaddingLeft,
    marginRight: -parentPaddingRight,
    paddingLeft: parentPaddingLeft,
    paddingRight: parentPaddingRight,
    paddingTop,
    paddingBottom,
    position: "relative",
    left: 0,
    right: 0,
  };

  // 배경 설정
  if (backgroundImage) {
    style.backgroundImage = `url("${backgroundImage}")`;
    style.backgroundSize = backgroundSize;
    style.backgroundPosition = backgroundPosition;
    style.backgroundRepeat = backgroundRepeat;
    if (backgroundBlendMode) {
      style.backgroundBlendMode = backgroundBlendMode;
    }
  } else if (backgroundColor) {
    style.backgroundColor = backgroundColor;
  }

  return <div style={style}>{children}</div>;
}
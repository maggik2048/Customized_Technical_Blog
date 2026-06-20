// app/components/papers/PaperWobble3DPositioning.tsx
"use client";

import React from 'react';

/**
 * 📐 PaperWobble3D의 모든 위치/크기/카메라 설정을 관리하는 파일
 * 이 파일만 수정하면 3D 종이의 크기, 위치, 카메라 거리 등을 조절할 수 있습니다.
 */

// ============================================================
// 1. 컨테이너 크기 설정 (전체 화면)
// ============================================================
export const CONTAINER_CONFIG = {
  /** 컨테이너 높이 - '100vh'로 전체 화면 높이 */
  height: '100vh',
  /** 컨테이너 너비 - '100vw'로 전체 화면 너비 */
  width: '100vw',
  /** 컨테이너 배경 그라데이션 */
  background: 'linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%)',
  /** 컨테이너 테두리 반경 (전체 화면이면 0) */
  borderRadius: '0px',
  /** 컨테이너 overflow */
  overflow: 'hidden' as const,
  /** 컨테이너 position - fixed로 전체 화면 고정 */
  position: 'fixed' as const,
  /** 상단 고정 */
  top: 0,
  left: 0,
  /** z-index - 매우 높게 설정 (다른 요소 위에) */
  zIndex: 99999,
} as const;

// ============================================================
// 2. Canvas (카메라) 설정
// ============================================================
export const CAMERA_CONFIG = {
  /** 카메라 위치 [x, y, z] - z값을 줄이면 종이가 더 크게 보임 */
  position: [0, 0, 1.8] as [number, number, number],
  /** 시야각 (Field of View) */
  fov: 50,
  /** near 클리핑 평면 */
  near: 0.1,
  /** far 클리핑 평면 */
  far: 10,
} as const;

// ============================================================
// 3. 종이(Paper) 크기 설정
// ============================================================
export const PAPER_CONFIG = {
  /** 종이 너비 (viewport 대비 비율) */
  widthRatio: 0.85,
  /** 종이 높이 (viewport 대비 비율) */
  heightRatio: 0.75,
  /** 종이 분할 수 (높을수록 부드러운 물리) */
  segments: 24,
  /** 종이 투명도 */
  opacity: 0.98,
  /** 종이 거칠기 (0-1) */
  roughness: 0.25,
  /** 종이 금속성 (0-1) */
  metalness: 0.0,
} as const;

// ============================================================
// 4. 종이 위치/회전 설정 (애니메이션 중)
// ============================================================
export const POSITION_CONFIG = {
  /** X축 이동 계수 - 페이지 넘길 때 좌우 이동 */
  xOffsetRatio: 0.25,
  /** Z축 이동 계수 - 페이지 넘길 때 앞뒤 이동 */
  zOffsetRatio: 0.25,
  /** 회전 각도 계수 */
  rotationFactor: 1,
} as const;

// ============================================================
// 5. 조명(Lighting) 설정
// ============================================================
export const LIGHTING_CONFIG = {
  ambient: {
    intensity: 0.7,
  },
  directionalLights: [
    { position: [3, 4, 3] as [number, number, number], intensity: 1.5 },
    { position: [-3, 2, -2] as [number, number, number], intensity: 0.7 },
    { position: [0, -2, 2] as [number, number, number], intensity: 0.5 },
  ],
  pointLight: {
    position: [0, 0, 3] as [number, number, number],
    intensity: 0.6,
  },
} as const;

// ============================================================
// 6. 그림자(Shadow) 설정
// ============================================================
export const SHADOW_CONFIG = {
  positionY: -0.65,
  positionZ: -0.4,
  width: 3.5,
  height: 2.8,
  opacity: 0.1,
} as const;

// ============================================================
// 7. 로딩 UI 설정
// ============================================================
export const LOADING_CONFIG = {
  height: '100vh',
  width: '100vw',
  background: '#f0f0f0',
  borderRadius: '0px',
  fontSize: '18px',
  color: '#666',
} as const;

// ============================================================
// 8. 하단 오버레이 정보 설정
// ============================================================
export const OVERLAY_CONFIG = {
  position: 'absolute' as const,
  bottom: '40px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(0,0,0,0.7)',
  color: 'white',
  padding: '10px 24px',
  borderRadius: '30px',
  fontSize: '16px',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  gap: '20px',
  alignItems: 'center',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
} as const;

// ============================================================
// 9. 도우미 함수 - 종이 크기 계산
// ============================================================
export function calculatePaperSize(
  viewportWidth: number,
  viewportHeight: number
): { width: number; height: number } {
  return {
    width: viewportWidth * PAPER_CONFIG.widthRatio,
    height: viewportHeight * PAPER_CONFIG.heightRatio,
  };
}

// ============================================================
// 10. 도우미 함수 - 종이 위치 계산 (애니메이션 중)
// ============================================================
export function calculatePaperPosition(
  progress: number,
  viewportWidth: number,
  isForward: boolean
): { x: number; z: number } {
  const p = Math.min(Math.max(progress, 0), 1);
  const direction = isForward ? -1 : 1;
  
  return {
    x: direction * viewportWidth * POSITION_CONFIG.xOffsetRatio * p,
    z: -Math.sin(p * Math.PI) * POSITION_CONFIG.zOffsetRatio,
  };
}

// ============================================================
// 11. 도우미 함수 - 종이 회전 계산
// ============================================================
export function calculatePaperRotation(
  progress: number,
  isForward: boolean
): number {
  const p = Math.min(Math.max(progress, 0), 1);
  const direction = isForward ? -1 : 1;
  return direction * Math.PI * POSITION_CONFIG.rotationFactor * p;
}

// ============================================================
// 12. 타입 정의
// ============================================================
export interface PaperPositioningProps {
  viewportWidth: number;
  viewportHeight: number;
  progress: number;
  isForward: boolean;
}

export interface PaperPositioningResult {
  width: number;
  height: number;
  positionX: number;
  positionZ: number;
  rotationY: number;
}
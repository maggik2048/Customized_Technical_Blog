// SidebarBookMotion.ts

import React from "react";

/**
 * 럭셔리 느낌:
 * - 흔들림 제거
 * - 부드럽게 앞으로 튀어나옴
 * - 살짝 확대
 * - 더 강한 밝기
 * - 은은한 골드 glow
 */

export function onBookEnter(e: React.MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;

  // hover transform
  el.style.transform = `
    translateX(12px)
    scale(1.04)
  `;

  // 더 밝게
  el.style.filter = `
    brightness(1.82)
    saturate(1.18)
    contrast(1.04)
  `;

  // luxury shadow
  el.style.boxShadow = `
    0 18px 40px rgba(0,0,0,0.46),
    0 0 24px rgba(214,180,90,0.14),
    0 0 60px rgba(214,180,90,0.06),
    inset 0 1px 0 rgba(255,255,255,0.10)
  `;

  // 부드러운 전환
  el.style.transition = `
    transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 240ms ease,
    filter 240ms ease
  `;
}

export function onBookLeave(
  e: React.MouseEvent<HTMLDivElement>,
  index: number,
  active: boolean
) {
  const el = e.currentTarget;

  // 원래 transform
  el.style.transform = getDefaultTransform(index);

  // 원래 그림자
  el.style.boxShadow = getDefaultShadow(active);

  // 밝기 복구
  el.style.filter = `
    brightness(1)
    saturate(1)
    contrast(1)
  `;

  el.style.transition = `
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 260ms ease,
    filter 260ms ease
  `;
}

export function getDefaultTransform(index: number) {
  return `rotate(${(index % 5) - 2}deg)`;
}

export function getDefaultShadow(active: boolean) {
  return active
    ? `
      0 0 24px rgba(173,140,71,0.16),
      inset 0 1px 0 rgba(255,255,255,0.06),
      inset 0 -1px 0 rgba(0,0,0,0.25)
    `
    : `
      inset 0 1px 0 rgba(255,255,255,0.025),
      inset 0 -1px 0 rgba(0,0,0,0.25),
      0 3px 10px rgba(0,0,0,0.22)
    `;
}
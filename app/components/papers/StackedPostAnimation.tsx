"use client";

/* ========================= */
/* STATIC CONFIG (절대 재생성 안됨) */
/* ========================= */

const POST_STYLES = {
  [-1]: {
    x: -520,
    y: -40,
    scale: 0.9,
    rotate: -3,
    opacity: 1,
    zIndex: 20,
  },
  [0]: {
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    opacity: 1,
    zIndex: 30,
  },
  [1]: {
    x: 520,
    y: -40,
    scale: 0.9,
    rotate: 3,
    opacity: 1,
    zIndex: 20,
  },
} as const;

/* fallback */
const HIDDEN_STATE = {
  opacity: 0,
};

/* ========================= */
/* ANIMATION STATE (PURE LOOKUP) */
/* ========================= */

export function getPostStyle(offset: -1 | 0 | 1 | number) {
  return POST_STYLES[offset as -1 | 0 | 1] ?? HIDDEN_STATE;
}

/* ========================= */
/* SPRING CONFIG (STATIC) */
/* ========================= */

export const springTransition = {
  type: "spring",
  stiffness: 80,   // 약간 상승 → 더 빠른 응답
  damping: 28,     // 잔진동 감소
  mass: 0.85,      // 관성 살짝 감소 → 덜 “출렁”
  restDelta: 0.001, // 수렴 안정성 ↑
  restSpeed: 0.001,
} as const;
// sidebarFilters.ts

/**
 * =========================================
 * SIDEBAR GLOBAL EDITORIAL FILTERS
 * =========================================
 *
 * sidebar 전체 aesthetic tone 통일용
 * 각 책 이미지를 직접 수정하는 게 아니라
 * 렌더 시 cinematic grading 느낌으로 보정
 */

/**
 * luxury editorial image grading
 */
export const SIDEBAR_IMAGE_FILTER = `
  grayscale(0.12)
  sepia(0.08)
  contrast(1.02)
  brightness(0.95)
  saturate(0.78)
`;

/**
 * unified warm editorial tint
 */
export const SIDEBAR_EDITORIAL_OVERLAY =
  "rgba(38, 30, 24, 0.12)";

/**
 * optional darker cinematic version
 */
export const SIDEBAR_DARK_EDITORIAL_FILTER = `
  grayscale(0.18)
  sepia(0.14)
  contrast(0.98)
  brightness(0.9)
  saturate(0.72)
`;

/**
 * optional archival cold version
 */
export const SIDEBAR_ARCHIVAL_FILTER = `
  grayscale(0.28)
  contrast(0.96)
  brightness(0.92)
  saturate(0.58)
`;
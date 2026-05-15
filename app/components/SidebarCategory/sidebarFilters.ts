// sidebarFilters.ts

/**
 * =========================================
 * SIDEBAR GLOBAL EDITORIAL FILTERS
 * =========================================
 *
 * luxury editorial / hardcover / cinematic grading
 * inspired by:
 * - criterion collection
 * - aesop
 * - taschen
 * - moody museum catalogs
 */

/**
 * MAIN LUXURY IMAGE FILTER
 *
 * 핵심:
 * - blacks deepen
 * - cheap RGB saturation 제거
 * - warm paper tone 추가
 * - hardcover print 느낌 강화
 */
export const SIDEBAR_IMAGE_FILTER = `
  brightness(0.84)
  contrast(1.18)
  saturate(0.74)
  sepia(0.16)
  hue-rotate(-4deg)
`;

/**
 * EDITORIAL LIGHTING OVERLAY
 *
 * 단색 overlay 대신
 * cinematic directional lighting 느낌
 */
export const SIDEBAR_EDITORIAL_OVERLAY = `
  linear-gradient(
    135deg,
    rgba(14,12,10,0.24),
    rgba(42,32,24,0.10),
    rgba(10,8,8,0.32)
  )
`;

/**
 * OPTIONAL:
 * darker archival grading
 */
export const SIDEBAR_DARK_EDITORIAL_FILTER = `
  brightness(0.72)
  contrast(1.24)
  saturate(0.58)
  sepia(0.22)
  hue-rotate(-8deg)
`;

/**
 * OPTIONAL:
 * cold museum catalog grading
 */
export const SIDEBAR_ARCHIVAL_FILTER = `
  brightness(0.88)
  contrast(1.06)
  saturate(0.52)
  grayscale(0.18)
`;
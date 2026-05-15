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
 *
 * philosophy:
 * - restrained color
 * - deep material blacks
 * - warm paper undertones
 * - matte cinematic response
 * - printed object feeling
 */

/**
 * -----------------------------------------
 * MAIN LUXURY EDITORIAL FILTER
 * -----------------------------------------
 *
 * goals:
 * - remove cheap RGB feel
 * - deepen blacks
 * - soften digital sharpness psychologically
 * - introduce subtle warm print tonality
 */
export const SIDEBAR_IMAGE_FILTER = `
  brightness(0.82)
  contrast(1.16)
  saturate(0.68)
  sepia(0.18)
  hue-rotate(-3deg)
`;

/**
 * -----------------------------------------
 * DARKER HARDCOVER EDITORIAL
 * -----------------------------------------
 *
 * heavier museum / archive mood
 * stronger density
 */
export const SIDEBAR_DARK_EDITORIAL_FILTER = `
  brightness(0.70)
  contrast(1.22)
  saturate(0.54)
  sepia(0.24)
  hue-rotate(-7deg)
`;

/**
 * -----------------------------------------
 * COLD ARCHIVAL MUSEUM LOOK
 * -----------------------------------------
 *
 * desaturated
 * restrained
 * northern european catalog tone
 */
export const SIDEBAR_ARCHIVAL_FILTER = `
  brightness(0.86)
  contrast(1.08)
  saturate(0.48)
  grayscale(0.18)
  sepia(0.06)
`;

/**
 * -----------------------------------------
 * EDITORIAL LIGHTING OVERLAY
 * -----------------------------------------
 *
 * directional cinematic lighting
 * with warm paper reflection
 *
 * avoids:
 * - flat dark overlays
 * - generic black gradients
 */
export const SIDEBAR_EDITORIAL_OVERLAY = `
  linear-gradient(
    135deg,
    rgba(18,16,14,0.34) 0%,
    rgba(52,42,34,0.12) 38%,
    rgba(16,12,10,0.42) 100%
  )
`;

/**
 * -----------------------------------------
 * OPTIONAL:
 * MATTE FILM GRAIN OVERLAY
 * -----------------------------------------
 *
 * use with:
 * mix-blend-mode: soft-light;
 * opacity: 0.04;
 *
 * creates:
 * - hardcover print texture
 * - cinematic material response
 * - removes sterile digital feel
 */
export const SIDEBAR_GRAIN_TEXTURE = `
  radial-gradient(
    rgba(255,255,255,0.035) 0.6px,
    transparent 0.6px
  )
`;

/**
 * -----------------------------------------
 * OPTIONAL:
 * LUXURY SHADOW SYSTEM
 * -----------------------------------------
 *
 * subtle ambient density
 * instead of aggressive borders
 */
export const SIDEBAR_LUXURY_SHADOW = `
  0 1px 0 rgba(255,255,255,0.03) inset,
  0 0 0 1px rgba(120,96,72,0.08),
  0 24px 60px rgba(0,0,0,0.42)
`;

/**
 * -----------------------------------------
 * OPTIONAL:
 * PREMIUM BORDER TONE
 * -----------------------------------------
 *
 * warm museum-paper border
 */
export const SIDEBAR_BORDER_COLOR = `
  rgba(148, 124, 98, 0.10)
`;

/**
 * -----------------------------------------
 * OPTIONAL:
 * TYPOGRAPHIC ATMOSPHERE
 * -----------------------------------------
 *
 * luxury UI relies heavily on typography
 * and spacing restraint
 */
export const SIDEBAR_TEXT_TONE = {
  title: "rgba(245,240,232,0.92)",
  body: "rgba(220,212,200,0.72)",
  muted: "rgba(180,168,152,0.52)",
};

/**
 * -----------------------------------------
 * RECOMMENDED USAGE
 * -----------------------------------------
 *
 * image:
 * filter: SIDEBAR_IMAGE_FILTER
 *
 * image overlay:
 * background: SIDEBAR_EDITORIAL_OVERLAY
 *
 * grain:
 * background-image: SIDEBAR_GRAIN_TEXTURE
 * background-size: 3px 3px
 * mix-blend-mode: soft-light
 * opacity: 0.04
 *
 * container:
 * box-shadow: SIDEBAR_LUXURY_SHADOW
 * border: 1px solid SIDEBAR_BORDER_COLOR
 */
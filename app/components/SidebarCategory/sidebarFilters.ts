// sidebarFilters.ts

/**
 * =========================================
 * SIDEBAR GLOBAL EDITORIAL FILTERS
 * =========================================
 *
 * ultra luxury editorial / archival cinema
 * darker + denser + lower saturation
 *
 * references:
 * - criterion collection
 * - loewe campaigns
 * - aesop interiors
 * - saint laurent creative
 * - moody european museum catalogs
 *
 * visual philosophy:
 * - deep matte blacks
 * - restrained chroma
 * - heavy tonal density
 * - cinematic contrast rolloff
 * - expensive print-object atmosphere
 * - anti-RGB digital feel
 */

/**
 * -----------------------------------------
 * PRIMARY ULTRA LUXURY FILTER
 * -----------------------------------------
 *
 * stronger contrast
 * lower saturation
 * deeper blacks
 * richer tonal compression
 * subtle warm paper chemistry
 */
export const SIDEBAR_IMAGE_FILTER = `
  brightness(0.72)
  contrast(1.34)
  saturate(0.42)
  sepia(0.22)
  hue-rotate(-4deg)
`;

/**
 * -----------------------------------------
 * DARK HARDCOVER CINEMATIC
 * -----------------------------------------
 *
 * museum-grade darkness
 * heavy editorial density
 * premium fashion campaign mood
 */
export const SIDEBAR_DARK_EDITORIAL_FILTER = `
  brightness(0.60)
  contrast(1.42)
  saturate(0.32)
  sepia(0.28)
  hue-rotate(-8deg)
`;

/**
 * -----------------------------------------
 * ARCHIVAL COLD MUSEUM LOOK
 * -----------------------------------------
 *
 * extremely restrained chroma
 * northern european archive feel
 * matte paper atmosphere
 */
export const SIDEBAR_ARCHIVAL_FILTER = `
  brightness(0.80)
  contrast(1.18)
  saturate(0.26)
  grayscale(0.28)
  sepia(0.08)
  hue-rotate(-2deg)
`;

/**
 * -----------------------------------------
 * HIGH-END EDITORIAL OVERLAY
 * -----------------------------------------
 *
 * cinematic directional density
 * avoids cheap dark overlays
 *
 * adds:
 * - atmospheric shadowing
 * - warm reflected paper light
 * - luxury visual depth
 */
export const SIDEBAR_EDITORIAL_OVERLAY = `
  linear-gradient(
    135deg,
    rgba(10,8,7,0.52) 0%,
    rgba(36,28,22,0.18) 34%,
    rgba(14,10,8,0.58) 100%
  )
`;

/**
 * -----------------------------------------
 * FILM MATTE GRAIN
 * -----------------------------------------
 *
 * removes sterile digital cleanliness
 * creates printed hardcover response
 *
 * recommended:
 * mix-blend-mode: soft-light;
 * opacity: 0.05;
 */
export const SIDEBAR_GRAIN_TEXTURE = `
  radial-gradient(
    rgba(255,255,255,0.028) 0.7px,
    transparent 0.7px
  )
`;

/**
 * -----------------------------------------
 * LUXURY DEPTH SHADOW SYSTEM
 * -----------------------------------------
 *
 * dense ambient shadowing
 * premium object separation
 * avoids visible UI borders
 */
export const SIDEBAR_LUXURY_SHADOW = `
  0 1px 0 rgba(255,255,255,0.025) inset,
  0 0 0 1px rgba(126,96,68,0.06),
  0 40px 90px rgba(0,0,0,0.62),
  0 8px 24px rgba(0,0,0,0.38)
`;

/**
 * -----------------------------------------
 * WARM MUSEUM BORDER
 * -----------------------------------------
 *
 * subtle paper-edge separation
 * instead of cold UI outlines
 */
export const SIDEBAR_BORDER_COLOR = `
  rgba(142, 116, 88, 0.08)
`;

/**
 * -----------------------------------------
 * TYPOGRAPHIC ATMOSPHERE
 * -----------------------------------------
 *
 * restrained warm typography
 * luxury UI depends heavily
 * on text tone discipline
 */
export const SIDEBAR_TEXT_TONE = {
  title: "rgba(244,238,228,0.88)",
  body: "rgba(214,206,194,0.64)",
  muted: "rgba(172,160,146,0.42)",
};

/**
 * -----------------------------------------
 * OPTIONAL:
 * CINEMATIC VIGNETTE
 * -----------------------------------------
 *
 * subtle edge darkening
 * creates expensive focal depth
 */
export const SIDEBAR_VIGNETTE = `
  radial-gradient(
    circle at center,
    transparent 42%,
    rgba(0,0,0,0.24) 100%
  )
`;

/**
 * -----------------------------------------
 * OPTIONAL:
 * MATTE SURFACE BLEND
 * -----------------------------------------
 *
 * softens digital highlights
 * creates luxury print diffusion
 */
export const SIDEBAR_SURFACE_BLEND = `
  linear-gradient(
    to bottom,
    rgba(255,255,255,0.015),
    rgba(0,0,0,0.08)
  )
`;

/**
 * =========================================
 * RECOMMENDED COMBINATION
 * =========================================
 *
 * image:
 * filter: SIDEBAR_IMAGE_FILTER;
 * transform: scale(1.02);
 *
 * overlay:
 * background: SIDEBAR_EDITORIAL_OVERLAY;
 *
 * vignette:
 * background: SIDEBAR_VIGNETTE;
 * mix-blend-mode: multiply;
 *
 * grain:
 * background-image: SIDEBAR_GRAIN_TEXTURE;
 * background-size: 3px 3px;
 * mix-blend-mode: soft-light;
 * opacity: 0.05;
 *
 * container:
 * box-shadow: SIDEBAR_LUXURY_SHADOW;
 * border: 1px solid SIDEBAR_BORDER_COLOR;
 * backdrop-filter: blur(10px);
 *
 * mood result:
 * - darker
 * - more cinematic
 * - lower chroma
 * - premium hardcover atmosphere
 * - anti-generic SaaS aesthetic
 */
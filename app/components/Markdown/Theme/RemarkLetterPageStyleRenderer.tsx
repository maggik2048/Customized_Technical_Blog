// RemarkLetterPageStyleRenderer.tsx
import React, { useMemo, useCallback, memo } from "react";
import {
  Tangerine,
  Italianno,
  Monsieur_La_Doulaise,
} from "next/font/google";

// Fonts
export const titleFont = Monsieur_La_Doulaise({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: true,
  adjustFontFallback: false,
});

export const luxuryHeadingFont = Tangerine({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  preload: true,
  adjustFontFallback: false,
});

export const boldCalligraphyFont = Italianno({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

// Font constants
export const LETTER_FONT = `${luxuryHeadingFont.style.fontFamily}, "Times New Roman", serif`;

// Size configuration
export const SIZES = Object.freeze({
  heading: Object.freeze({ 1: 90, 2: 84, 3: 78 }),
  margin: Object.freeze({ 1: 28, 2: 42, 3: 26 }),
  fontSize: Object.freeze({ li: 36, p: 36 }),
});

// Ink effect options - ENHANCED with more smearing
export const INK_OPTIONS_BASE = Object.freeze({
  paragraph: Object.freeze({
    maxBlur: 0.16,
    bleedChance: 0.18,
    maxShiftY: 0.45,
    maxShiftX: 0.28,
  }),
  list: Object.freeze({
    maxBlur: 0.16,
    bleedChance: 0.16,
    maxShiftY: 0.7,
    maxShiftX: 0.45,
    maxRotation: 1.6,
    minScale: 0.992,
    maxScale: 1.012,
    opacityMin: 0.78,
    opacityMax: 1,
    kerningVariance: 0.045,
  }),
  bullet: Object.freeze({
    maxBlur: 0.55,
    bleedChance: 0.62,
    maxShiftY: 1.8,
    maxShiftX: 1.4,
    maxRotation: 8,
    minScale: 0.82,
    maxScale: 1.35,
    opacityMin: 0.45,
    opacityMax: 1,
    kerningVariance: 0.12,
  }),
  heading: Object.freeze({
    maxBlur: 0.28,
    bleedChance: 0.34,
    maxShiftY: 1.2,
    maxShiftX: 0.6,
  }),
  strong: Object.freeze({
    maxBlur: 0.34,
    bleedChance: 0.42,
    maxShiftY: 1.2,
    maxShiftX: 0.7,
  }),
  emphasis: Object.freeze({
    maxBlur: 0.12,
    bleedChance: 0.14,
  }),
});

// Color configurations - STRONGER, TIGHTER SHADOWS
export const COLOR_CONFIGS = Object.freeze({
  light: Object.freeze({
    paperColor: "#f5efe3",
    inkColor: "#2f241d",
    fadedInkColor: "#5c4737",
    headingColor: "#6a1f1b",
    borderColor: "rgba(70,40,20,0.14)",
    bulletColor: "rgba(55,25,15,0.92)",
    shadowColor: "0 20px 70px rgba(80,40,10,0.18)",
    // Tighter, stronger shadows - less blur, more opacity
    textShadow: `
      0 1px 0 rgba(255,255,255,0.55),
      0 1px 3px rgba(0,0,0,0.35),
      0 1px 2px rgba(0,0,0,0.25)
    `,
    headingTextShadow: `
      0 2px 0 rgba(255,255,255,0.65),
      0 2px 6px rgba(0,0,0,0.40),
      0 1px 3px rgba(0,0,0,0.25)
    `,
    strongTextShadow: `
      0 1px 0 rgba(255,255,255,0.50),
      0 1px 4px rgba(0,0,0,0.38),
      0 1px 2px rgba(0,0,0,0.22)
    `,
    listTextShadow: `
      0 1px 0 rgba(255,255,255,0.55),
      0 1px 3px rgba(0,0,0,0.30),
      0 1px 2px rgba(0,0,0,0.18)
    `,
    gradientOverlay: "linear-gradient(140deg, rgba(255,255,255,0.10), transparent 35%)",
    blockquoteBg: "rgba(120,80,50,0.03)",
    highlightBg: "rgba(140,90,40,0.08)",
  }),
  dark: Object.freeze({
    paperColor: "#171310",
    inkColor: "#eadfcb",
    fadedInkColor: "#d9c2a7",
    headingColor: "#8f433f",
    borderColor: "rgba(255,255,255,0.06)",
    bulletColor: "rgba(230,210,190,0.92)",
    shadowColor: "0 24px 80px rgba(0,0,0,0.5)",
    // Tighter, stronger shadows for dark mode
    textShadow: `
      0 1px 0 rgba(255,255,255,0.15),
      0 1px 4px rgba(0,0,0,0.55),
      0 1px 2px rgba(0,0,0,0.35)
    `,
    headingTextShadow: `
      0 2px 0 rgba(255,255,255,0.20),
      0 2px 8px rgba(0,0,0,0.60),
      0 1px 3px rgba(0,0,0,0.40)
    `,
    strongTextShadow: `
      0 1px 0 rgba(255,255,255,0.15),
      0 1px 5px rgba(0,0,0,0.55),
      0 1px 3px rgba(0,0,0,0.35)
    `,
    listTextShadow: `
      0 1px 0 rgba(255,255,255,0.15),
      0 1px 4px rgba(0,0,0,0.50),
      0 1px 2px rgba(0,0,0,0.30)
    `,
    gradientOverlay: "linear-gradient(140deg, rgba(0,0,0,0.16), transparent 35%)",
    blockquoteBg: "rgba(255,255,255,0.02)",
    highlightBg: "rgba(150,90,60,0.14)",
  }),
});

// Style factories
export const createInkOptions = (color: string, baseOptions: any) => {
  return Object.assign({}, baseOptions, { color });
};

export const getHeadingStyle = (
  level: number, 
  colors: any, 
  isLevel1: boolean
) => ({
  color: colors.headingColor,
  fontSize: SIZES.heading[level as keyof typeof SIZES.heading],
  lineHeight: 1,
  letterSpacing: "0.01em",
  textShadow: colors.headingTextShadow,
  display: "inline-block" as const,
  transform: isLevel1 ? "rotate(-1deg)" : "rotate(-0.5deg)",
});

export const getParagraphStyle = (colors: any) => ({
  fontFamily: LETTER_FONT,
  color: colors.inkColor,
  fontSize: SIZES.fontSize.p,
  lineHeight: 1.0,
  margin: "18px 0",
  letterSpacing: "0.02em",
  whiteSpace: "pre-wrap" as const,
  textAlign: "left" as const,
  fontWeight: 700,
  textShadow: colors.textShadow,
});

export const getStrongStyle = (colors: any) => ({
  color: colors.headingColor,
  fontWeight: 400,
  fontSize: "1.5em",
  lineHeight: 1,
  letterSpacing: "0.02em",
  display: "inline-block" as const,
  transform: "rotate(-1deg)",
  padding: "0 4px",
  textShadow: colors.strongTextShadow,
});

export const getEmphasisStyle = (colors: any) => ({
  color: colors.fadedInkColor,
  fontStyle: "italic" as const,
  fontFamily: LETTER_FONT,
  textShadow: colors.textShadow,
});

export const getListItemStyle = (colors: any) => ({
  listStyle: "none" as const,
  position: "relative" as const,
  fontFamily: LETTER_FONT,
  color: colors.inkColor,
  fontSize: SIZES.fontSize.li,
  lineHeight: 1.0,
  margin: "10px 0",
  paddingLeft: 34,
  fontWeight: 700,
  textShadow: colors.listTextShadow,
});

export const getBulletStyle = () => ({
  position: "absolute" as const,
  left: 0,
  top: "0.16em",
  lineHeight: 1,
  fontSize: "0.95em",
  pointerEvents: "none" as const,
  mixBlendMode: "multiply" as const,
});

export const getBlockquoteStyle = (colors: any) => ({
  margin: "28px 0",
  padding: "20px 28px",
  borderLeft: `3px solid ${colors.headingColor}`,
  background: colors.blockquoteBg,
  borderRadius: 4,
  fontStyle: "italic" as const,
  backdropFilter: "blur(1px)",
  fontFamily: LETTER_FONT,
  textShadow: colors.textShadow,
});

export const getHrStyle = (colors: any) => ({
  margin: "46px 0",
  borderTop: `1px solid ${colors.borderColor}`,
});

export const getListWrapperStyle = () => ({
  paddingLeft: 0,
  margin: "18px 0",
});

export const getHighlightStyle = (colors: any) => ({
  background: colors.highlightBg,
  borderRadius: 4,
  padding: "2px 4px",
  textShadow: colors.textShadow,
});

// Hook for all style-related logic
export function useLetterStyles(isDark: boolean) {
  const colors = COLOR_CONFIGS[isDark ? "dark" : "light"];
  
  const inkOptions = useMemo(() => ({
    paragraph: createInkOptions(colors.inkColor, INK_OPTIONS_BASE.paragraph),
    list: createInkOptions(colors.inkColor, INK_OPTIONS_BASE.list),
    bullet: createInkOptions(colors.bulletColor, INK_OPTIONS_BASE.bullet),
    heading: createInkOptions(colors.headingColor, INK_OPTIONS_BASE.heading),
    strong: createInkOptions(colors.headingColor, INK_OPTIONS_BASE.strong),
    emphasis: createInkOptions(colors.fadedInkColor, INK_OPTIONS_BASE.emphasis),
  }), [colors]);

  const paragraphStyle = useMemo(() => getParagraphStyle(colors), [colors]);
  const strongStyle = useMemo(() => getStrongStyle(colors), [colors]);
  const emphasisStyle = useMemo(() => getEmphasisStyle(colors), [colors]);
  const listItemStyle = useMemo(() => getListItemStyle(colors), [colors]);
  const bulletStyle = useMemo(() => getBulletStyle(), []);
  const blockquoteStyle = useMemo(() => getBlockquoteStyle(colors), [colors]);
  const hrStyle = useMemo(() => getHrStyle(colors), [colors]);
  const listWrapperStyle = useMemo(() => getListWrapperStyle(), []);

  const getHeadingStyleForLevel = useCallback((level: number, isLevel1: boolean) => 
    getHeadingStyle(level, colors, isLevel1), [colors]);

  return {
    colors,
    inkOptions,
    paragraphStyle,
    strongStyle,
    emphasisStyle,
    listItemStyle,
    bulletStyle,
    blockquoteStyle,
    hrStyle,
    listWrapperStyle,
    getHeadingStyleForLevel,
  };
}
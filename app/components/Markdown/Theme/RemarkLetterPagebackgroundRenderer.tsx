"use client";

import React, { memo, useMemo } from "react";

/* =========================
   STATIC CONSTANTS
========================= */

export const BACKGROUND_CONFIGS = Object.freeze({
  light: Object.freeze({
    paperColor: "#f5efe3",
    borderColor: "rgba(70,40,20,0.14)",
    shadowColor: "0 20px 70px rgba(80,40,10,0.18)",
    gradientOverlay: "linear-gradient(140deg, rgba(255,255,255,0.10), transparent 35%)",
  }),
  dark: Object.freeze({
    paperColor: "#171310",
    borderColor: "rgba(255,255,255,0.06)",
    shadowColor: "0 24px 80px rgba(0,0,0,0.5)",
    gradientOverlay: "linear-gradient(140deg, rgba(0,0,0,0.16), transparent 35%)",
  }),
});

export const BACKGROUND_TEXTURE = "/images/letter2.png";

/* =========================
   STYLE GENERATORS
========================= */

export interface LetterBackgroundStyles {
  letter: React.CSSProperties;
  cinematicOverlay: React.CSSProperties;
  seal: React.CSSProperties;
}

export const getLetterBackgroundStyles = (
  isDark: boolean,
  headingColor: string
): LetterBackgroundStyles => {
  const config = BACKGROUND_CONFIGS[isDark ? "dark" : "light"];

  return {
    letter: {
      position: "relative" as const,
      overflow: "hidden" as const,
      maxWidth: 980,
      margin: "0 auto",
      padding: "74px 78px 88px 78px",
      borderRadius: 8,
      backgroundColor: config.paperColor,
      backgroundImage: `url("${BACKGROUND_TEXTURE}")`,
      backgroundSize: "330%",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      boxShadow: config.shadowColor,
      border: `1px solid ${config.borderColor}`,
      contain: "layout paint style" as const,
    },
    cinematicOverlay: {
      position: "absolute" as const,
      inset: 0,
      pointerEvents: "none" as const,
      background: config.gradientOverlay,
    },
    seal: {
      position: "absolute" as const,
      top: 28,
      left: 38,
      width: 62,
      height: 62,
      borderRadius: "50%",
      border: `3px solid ${headingColor}`,
      opacity: 0.14,
      pointerEvents: "none" as const,
    },
  };
};

/* =========================
   BACKGROUND RENDERER COMPONENT
========================= */

export interface RemarkLetterPageBackgroundRendererProps {
  isDark?: boolean;
  headingColor: string;
  children: React.ReactNode;
}

const RemarkLetterPageBackgroundRenderer = memo(function RemarkLetterPageBackgroundRenderer({
  isDark = false,
  headingColor,
  children,
}: RemarkLetterPageBackgroundRendererProps) {
  const styles = useMemo(
    () => getLetterBackgroundStyles(isDark, headingColor),
    [isDark, headingColor]
  );

  return (
    <div style={styles.letter}>
      <div style={styles.cinematicOverlay} />
      <div style={styles.seal} />
      {children}
    </div>
  );
});

RemarkLetterPageBackgroundRenderer.displayName = "RemarkLetterPageBackgroundRenderer";

export default RemarkLetterPageBackgroundRenderer;
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
      overflow: "visible" as const, // hidden -> visible 변경 (잘림 방지)
      maxWidth: 980,
      margin: "0 auto",
      padding: "74px 78px 88px 78px",
      borderRadius: 8,
      backgroundColor: config.paperColor,
      backgroundImage: `url("${BACKGROUND_TEXTURE}")`,
      backgroundSize: "cover", // 330% -> cover 변경 (전체 커버)
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center", // center -> center center (명확하게)
      boxShadow: config.shadowColor,
      border: `1px solid ${config.borderColor}`,
      // contain 속성 제거 (크기 제한 해제)
    },
    cinematicOverlay: {
      position: "absolute" as const,
      inset: 0,
      pointerEvents: "none" as const,
      background: config.gradientOverlay,
      borderRadius: 8, // letter와 동일한 border-radius 적용
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
      zIndex: 1, // z-index 추가
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
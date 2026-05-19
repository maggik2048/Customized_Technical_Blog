// PunchFilterOverlay.tsx
"use client";

import { useCastShadowFilter } from "@/app/context/CastShadowFilterContext";

export default function PunchFilterOverlay() {
  const { filterOn } = useCastShadowFilter();

  if (!filterOn) return null;

  return (
    <>
      {/* MAIN PUNCH */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 4,

          backdropFilter: `
            contrast(1.38)
            saturate(1.28)
            brightness(0.96)
          `,

          WebkitBackdropFilter: `
            contrast(1.38)
            saturate(1.28)
            brightness(0.96)
          `,
        }}
      />

      {/* HARD LIGHT BOOST */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 5,

          background: `
            linear-gradient(
              135deg,
              rgba(255,255,255,0.03) 0%,
              rgba(255,255,255,0.00) 30%,
              rgba(70,90,180,0.08) 58%,
              rgba(0,0,0,0.18) 100%
            )
          `,

          mixBlendMode: "hard-light",
          opacity: 0.2,
        }}
      />

      {/* SHADOW CLAMP */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 6,

          background: `
            radial-gradient(
              circle at center,
              transparent 34%,
              rgba(0,0,0,0.12) 68%,
              rgba(0,0,0,0.34) 100%
            )
          `,

          mixBlendMode: "multiply",
        }}
      />

      {/* EDGE DENSITY */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 7,

          background: "rgba(0,0,0,0.00)",

          mixBlendMode: "overlay",

          filter: `
            contrast(1.2)
            saturate(1.1)
          `,
        }}
      />

      {/* CALM FILTER (NO BLUR, CLEAN LUXURY GRADE) */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 8,

          /* soft white lift + slight desaturation */
          background: `
            radial-gradient(
              circle at center,
              rgba(255,255,255,0.22) 0%,
              rgba(255,255,255,0.10) 45%,
              rgba(245,245,250,0.28) 100%
            )
          `,

          mixBlendMode: "screen",
          opacity: 0.48,

          /* NO BLUR ANYMORE */
          backdropFilter: `
            brightness(1.14)
            contrast(0.93)
            saturate(0.86)
          `,

          WebkitBackdropFilter: `
            brightness(1.14)
            contrast(0.93)
            saturate(0.86)
          `,
        }}
      />
    </>
  );
}
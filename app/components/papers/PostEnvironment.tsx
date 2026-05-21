"use client";

import React from "react";
import { useDarkMode } from "@/app/context/DarkModeContext";

import DarkModeContextButtonRenderer from "@/app/context/DarkModeContextButtonRenderer";
import DrawingPenButton from "@/app/Graphics/DrawingNotation/DrawingPenButton";

export default function PostEnvironment({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mode } = useDarkMode();

  const isDark = mode === "dark";

  const bgImage = isDark
    ? "/images/horizon.jpg"
    : "/images/mathdraw0.png";

  return (
    <>
      {/* BASE BACKGROUND */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url("${bgImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "scale(1.02)",
          zIndex: -5,
        }}
      />

      {/* INVERT LAYER (BOTTOM ONLY) */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url("${bgImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "scale(1.02)",
          filter: `
            invert(1)
            hue-rotate(192deg)
            saturate(1.25)
            contrast(1.10)
            brightness(0.93)
            sepia(0.03)
          `,
          opacity: 0.92,
          zIndex: -4,
          pointerEvents: "none",
          maskImage: `
            linear-gradient(
              to bottom,
              transparent 0%,
              rgba(0,0,0,0.14) 36%,
              rgba(0,0,0,0.40) 50%,
              rgba(0,0,0,0.74) 66%,
              rgba(0,0,0,0.96) 84%,
              rgba(0,0,0,1) 100%
            )
          `,
          WebkitMaskImage: `
            linear-gradient(
              to bottom,
              transparent 0%,
              rgba(0,0,0,0.14) 36%,
              rgba(0,0,0,0.40) 50%,
              rgba(0,0,0,0.74) 66%,
              rgba(0,0,0,0.96) 84%,
              rgba(0,0,0,1) 100%
            )
          `,
        }}
      />

      {/* SKY BLUE ATMOSPHERE */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: `
            linear-gradient(
              to top,
              rgba(160,215,255,0.22) 0%,
              rgba(150,205,255,0.16) 18%,
              rgba(170,225,255,0.10) 36%,
              transparent 60%
            )
          `,
          mixBlendMode: "screen",
          zIndex: -3,
          pointerEvents: "none",
        }}
      />

      {/* GOLD ATMOSPHERE */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: `
            linear-gradient(
              to bottom,
              rgba(255,235,170,0.16) 0%,
              rgba(255,225,140,0.10) 20%,
              rgba(255,215,120,0.05) 38%,
              transparent 58%
            )
          `,
          mixBlendMode: "screen",
          zIndex: -2,
          pointerEvents: "none",
        }}
      />

      {/* FILM SHADE */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: `
            linear-gradient(
              to top,
              rgba(0,0,0,0.22) 0%,
              rgba(0,0,0,0.10) 18%,
              rgba(0,0,0,0.03) 34%,
              transparent 52%
            )
          `,
          zIndex: -1,
          pointerEvents: "none",
        }}
      />

      {/* GLOBAL UI LAYER */}
      <DarkModeContextButtonRenderer />

      {/* TOPMOST FLOATING ACTION BUTTON */}
      <DrawingPenButton />

      {children}
    </>
  );
}
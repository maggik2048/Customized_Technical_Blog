// CalculatorGraphVintageTheme.tsx
"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
};

export default function CalculatorGraphVintageTheme({
  children,
  title = "ASTRAL MECHANICA",
  onClose,
}: Props) {
  return (
    <div
      style={{
        width: 1480,
        maxWidth: "96vw",
        padding: 34,
        borderRadius: 42,

        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",

        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",

        /* medieval steel + arcane blue */
        background: `
          linear-gradient(
            145deg,
            rgba(34,38,52,0.82) 0%,
            rgba(18,22,32,0.90) 45%,
            rgba(10,12,18,0.94) 100%
          )
        `,

        border: "1px solid rgba(180,210,255,0.14)",

        boxShadow: `
          0px 40px 120px rgba(0,0,0,0.52),
          inset 0px 1px 0px rgba(255,255,255,0.05),
          inset 0px 0px 80px rgba(120,170,255,0.05)
        `,
      }}
    >
      {/* BACKGROUND GLOW */}

      <div
        style={{
          position: "absolute",
          inset: -200,

          background: `
            radial-gradient(
              circle at top left,
              rgba(120,170,255,0.12),
              transparent 35%
            ),
            radial-gradient(
              circle at bottom right,
              rgba(180,220,255,0.08),
              transparent 40%
            )
          `,

          pointerEvents: "none",
        }}
      />

      {/* METAL TEXTURE */}

      <div
        style={{
          position: "absolute",
          inset: 0,

          opacity: 0.045,
          pointerEvents: "none",

          backgroundImage: `
            repeating-linear-gradient(
              135deg,
              rgba(255,255,255,0.08) 0px,
              rgba(255,255,255,0.08) 1px,
              transparent 1px,
              transparent 6px
            )
          `,
        }}
      />

      {/* BORDER ORNAMENT */}

      <div
        style={{
          position: "absolute",
          inset: 10,

          borderRadius: 32,

          border: "1px solid rgba(200,220,255,0.08)",

          pointerEvents: "none",

          boxShadow: `
            inset 0 0 30px rgba(255,255,255,0.02)
          `,
        }}
      />

      {/* CORNER DECORATIONS */}

      {[
        { top: 18, left: 18 },
        { top: 18, right: 18 },
        { bottom: 18, left: 18 },
        { bottom: 18, right: 18 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 42,
            height: 42,

            border: "1px solid rgba(180,220,255,0.18)",
            borderRadius: 12,

            background: `
              linear-gradient(
                145deg,
                rgba(255,255,255,0.03),
                rgba(255,255,255,0.01)
              )
            `,

            boxShadow: `
              inset 0 0 12px rgba(255,255,255,0.03)
            `,

            ...pos,
          }}
        />
      ))}

      {/* HEADER */}

      <div
        style={{
          position: "relative",

          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.34em",

            color: "rgba(210,230,255,0.68)",

            fontFamily: `
              Cinzel,
              Trajan Pro,
              ui-serif,
              Georgia
            `,

            textShadow: `
              0 0 12px rgba(120,170,255,0.35)
            `,
          }}
        >
          {title}
        </div>

        <button
          onClick={onClose}
          style={{
            width: 36,
            height: 36,

            borderRadius: "50%",

            border: "1px solid rgba(200,220,255,0.18)",

            background: `
              linear-gradient(
                to bottom,
                rgba(255,255,255,0.08),
                rgba(0,0,0,0.22)
              )
            `,

            color: "#dce8ff",

            cursor: "pointer",

            fontSize: 18,

            backdropFilter: "blur(10px)",

            boxShadow: `
              inset 0px 1px 0px rgba(255,255,255,0.08),
              0 0 14px rgba(120,170,255,0.12)
            `,

            transition: "all 0.18s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow =
              "0 0 18px rgba(150,200,255,0.22)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 0 14px rgba(120,170,255,0.12)";
          }}
        >
          ×
        </button>
      </div>

      {/* DIVIDER */}

      <div
        style={{
          height: 1,
          marginBottom: 28,

          background: `
            linear-gradient(
              to right,
              transparent,
              rgba(180,210,255,0.18),
              transparent
            )
          `,
        }}
      />

      {/* CONTENT */}

      <div
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
        {children}
      </div>
    </div>
  );
}
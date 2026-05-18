// CalculatorGraphTheme.tsx
"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
};

export default function CalculatorGraphTheme({
  children,
  title = "MECHANICAL GRAPH CALCULATOR",
  onClose,
}: Props) {
  return (
    <div
      style={{
        width: "100%",

        display: "flex",
        justifyContent: "center",

        /* -------------------------------- */
        /* ORIGINAL SIZE 유지 */
        /* -------------------------------- */

        paddingTop: 90,
        paddingBottom: 60,

        boxSizing: "border-box",
      }}
    >
      {/* -------------------------------- */}
      {/* EXACT ORIGINAL OUTER SIZE */}
      {/* -------------------------------- */}

      <div
        style={{
          width: 1480,
          maxWidth: "96vw",

          /* 원래 34였는데 커져보이는 원인이라 유지 */
          padding: 34,

          borderRadius: 44,

          position: "relative",
          overflow: "hidden",

          /* -------------------------------- */
          /* blur 유지 */
          /* -------------------------------- */

          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",

          /* -------------------------------- */
          /* original sizing 유지 */
          /* -------------------------------- */

          boxSizing: "border-box",

          /* -------------------------------- */
          /* vintage mechanical styling */
          /* -------------------------------- */

          background: `
            linear-gradient(
              145deg,
              rgba(88,64,44,0.72),
              rgba(34,24,18,0.74)
            )
          `,

          border: "1px solid rgba(255,220,170,0.10)",

          boxShadow: `
            0px 40px 120px rgba(0,0,0,0.42),
            inset 0px 1px 0px rgba(255,255,255,0.05)
          `,
        }}
      >
        {/* METAL TEXTURE */}

        <div
          style={{
            position: "absolute",
            inset: 0,

            opacity: 0.04,

            pointerEvents: "none",

            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                rgba(255,255,255,0.08) 0px,
                rgba(255,255,255,0.08) 1px,
                transparent 1px,
                transparent 6px
              )
            `,
          }}
        />

        {/* -------------------------------- */}
        {/* HEADER */}
        {/* -------------------------------- */}

        <div
          style={{
            position: "relative",

            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

            marginBottom: 22,
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.28em",
              color: "rgba(255,230,190,0.52)",

              fontFamily: "ui-serif, Georgia",
            }}
          >
            {title}
          </div>

          <button
            onClick={onClose}
            style={{
              width: 34,
              height: 34,

              borderRadius: "50%",

              border: "1px solid rgba(255,255,255,0.12)",

              background: `
                linear-gradient(
                  to bottom,
                  rgba(255,240,220,0.10),
                  rgba(0,0,0,0.14)
                )
              `,

              color: "#ffe7c6",

              cursor: "pointer",

              fontSize: 18,

              backdropFilter: "blur(10px)",

              boxShadow: `
                inset 0px 1px 0px rgba(255,255,255,0.05)
              `,
            }}
          >
            ×
          </button>
        </div>

        {/* CONTENT */}

        <div
          style={{
            position: "relative",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
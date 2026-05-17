"use client";

import React from "react";

export default function SidebarOpenCloseMotion({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,

        width: 390,
        height: "100vh",

        overflowY: "auto",
        isolation: "isolate",

        padding: "40px 22px",

        background: `
          linear-gradient(
            rgba(10,10,10,0.46),
            rgba(10,10,10,0.72)
          ),
          url('/images/covers/sidebarbg_marble.jpg')
        `,

        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

        /**
         * FIXED MASK (shifted + cleaner falloff)
         * - fade starts later (around 82%)
         * - stronger final cutoff (avoid white line)
         */
        WebkitMaskImage: `
          linear-gradient(
            to right,
            black 0%,
            black 82%,
            rgba(0,0,0,0.75) 88%,
            rgba(0,0,0,0.35) 92%,
            rgba(0,0,0,0.00) 94%,
            transparent 100%
          )
        `,
        maskImage: `
          linear-gradient(
            to right,
            black 0%,
            black 82%,
            rgba(0,0,0,0.65) 88%,
            rgba(0,0,0,0.35) 92%,
            rgba(0,0,0,0.04) 94%,
            transparent 100%
          )
        `,

        transform: open
          ? "translate3d(0, 0, 0)"
          : "translate3d(-92%, 0, 0)",

        transition:
          "transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)",

        willChange: "transform",

        boxShadow: open
          ? "10px 0 40px rgba(0,0,0,0.55)"
          : "10px 0 40px rgba(0,0,0,0.25)",

        zIndex: 50,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 200,
          height: "100%",
          pointerEvents: "none",

          background: `
            linear-gradient(
              to left,
              rgba(255,255,255,0.06) 0%,
              rgba(255,255,255,0.02) 40%,
              rgba(255,255,255,0.00) 75%
            )
          `,

          mixBlendMode: "screen",
          zIndex: 2,
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 240,
          height: "100%",
          pointerEvents: "none",

          background: `
            linear-gradient(
              to left,
              rgba(10,10,10,0.22) 0%,
              rgba(10,10,10,0.12) 45%,
              rgba(10,10,10,0.05) 75%,
              rgba(10,10,10,0.00) 100%
            )
          `,

          mixBlendMode: "multiply",
          zIndex: 1,
        }}
      />

      <div style={{ position: "relative", zIndex: 3 }}>
        {children}
      </div>
    </aside>
  );
}
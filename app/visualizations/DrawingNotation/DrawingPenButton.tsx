"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function DrawingPenButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.14, rotate: -4 }}
      whileTap={{ scale: 0.96 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 18,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: "fixed",
        right: 28,
        bottom: 28,
        zIndex: 9999,
        cursor: "pointer",
        padding: 12,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 560,
          isolation: "isolate",
        }}
      >
        {/* BASE IMAGE */}
        <img
          src="/images/drawmarks/fountainPen2.png"
          alt="drawing pen button"
          style={{
            width: "100%",
            height: "auto",
            userSelect: "none",
            pointerEvents: "none",
            filter: "drop-shadow(0 18px 26px rgba(0,0,0,0.55))",
          }}
        />

        {/* =========================
            HOVER OFF STATE (original inverted image stack)
           ========================= */}
        {!hovered && (
          <>
            <img
              src="/images/drawmarks/fountainPen2.png"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "auto",
                pointerEvents: "none",
                userSelect: "none",
                filter: `
                  invert(1)
                  contrast(2.2)
                  brightness(0.75)
                  saturate(2)
                `,
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 20%, black 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 20%, black 100%)",
              }}
            />

            <img
              src="/images/drawmarks/fountainPen2.png"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "auto",
                pointerEvents: "none",
                userSelect: "none",
                filter: `
                  invert(1)
                  contrast(3)
                  brightness(0.6)
                `,
                maskImage:
                  "linear-gradient(to right, transparent 40%, black 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 40%, black 100%)",
              }}
            />
          </>
        )}

        {/* =========================
            HOVER ON STATE (FIXED: keep IMAGE alpha intact)
           ========================= */}
        {hovered && (
          <>
            <img
              src="/images/drawmarks/fountainPen2.png"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "auto",
                pointerEvents: "none",
                userSelect: "none",

                /* stronger invert version but STILL image-based */
                filter: `
                  invert(1)
                  hue-rotate(210deg)
                  saturate(2.2)
                  contrast(1.6)
                  brightness(0.75)
                `,

                opacity: 0.95,

                /* IMPORTANT: same alpha-safe mask approach */
                maskImage:
                  "linear-gradient(to right, transparent 10%, black 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 10%, black 100%)",
              }}
            />

            <img
              src="/images/drawmarks/fountainPen2.png"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "auto",
                pointerEvents: "none",
                userSelect: "none",

                filter: `
                  invert(1)
                  contrast(2)
                  brightness(0.6)
                `,

                opacity: 0.75,

                maskImage:
                  "linear-gradient(to right, transparent 45%, black 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 45%, black 100%)",
              }}
            />
          </>
        )}
      </div>
    </motion.div>
  );
}
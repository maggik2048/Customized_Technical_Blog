"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function PenAnnotationButton() {
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
        {/* ========================================
            BASE IMAGE
        ======================================== */}
        <motion.img
          src="/images/drawmarks/fountainPen2.png"
          alt="pen annotation button"
          animate={{
            filter: hovered
              ? "drop-shadow(0 22px 34px rgba(0,0,0,0.62)) brightness(1.08) saturate(1.05)"
              : "drop-shadow(0 18px 26px rgba(0,0,0,0.55))",
          }}
          transition={{
            duration: 0.22,
            ease: "easeOut",
          }}
          style={{
            width: "100%",
            height: "auto",
            userSelect: "none",
            pointerEvents: "none",
            display: "block",
          }}
        />

        {/* ========================================
            HOVER OFF ONLY
            (partial inversion effect)
        ======================================== */}
        {!hovered && (
          <>
            {/* SOFT INVERT */}
            <motion.img
              src="/images/drawmarks/fountainPen2.png"
              alt="soft invert layer"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "auto",

                userSelect: "none",
                pointerEvents: "none",

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

            {/* HARD RIGHT INVERT */}
            <motion.img
              src="/images/drawmarks/fountainPen2.png"
              alt="hard invert layer"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "auto",

                userSelect: "none",
                pointerEvents: "none",

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
      </div>
    </motion.div>
  );
}
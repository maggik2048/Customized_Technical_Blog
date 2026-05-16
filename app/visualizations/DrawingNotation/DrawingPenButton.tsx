"use client";

import React from "react";
import { motion } from "framer-motion";

export default function DrawingPenButton() {
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
        {/* =========================
            1. BASE IMAGE (0% invert)
        ========================== */}
        <img
          src="/images/drawmarks/fountainPen2.png"
          alt="drawing pen button"
          style={{
            width: "100%",
            height: "auto",
            userSelect: "none",
            pointerEvents: "none",
            filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.55))",
          }}
        />

        {/* =========================
            2. MID INVERSION (starts early)
        ========================== */}
        <img
          src="/images/drawmarks/fountainPen2.png"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "auto",
            pointerEvents: "none",

            filter: `
              invert(1)
              contrast(2.0)
              brightness(0.75)
              saturate(1.8)
            `,

            opacity: 1,

            //  중간부터 시작 (soft transition)
            maskImage:
              "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.001) 38%, rgba(0,0,0,1) 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,1) 100%)",
          }}
        />

        {/* =========================
            3. HARD INVERSION (right side dominance)
        ========================== */}
        <img
          src="/images/drawmarks/fountainPen2.png"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "auto",
            pointerEvents: "none",

            filter: `
              invert(1)
              contrast(3)
              brightness(0.6)
              saturate(2.2)
            `,

            opacity: 1,

            // 🔥 오른쪽 끝 완전 네거티브
            maskImage:
              "linear-gradient(to right, rgba(0,0,0,0) 45%, rgba(0,0,0,1) 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, rgba(0,0,0,0) 45%, rgba(0,0,0,1) 100%)",
          }}
        />

        {/* =========================
            4. EDGE BOOST (forces full flip feeling)
        ========================== */}
        <div
          style={{
            position: "absolute",
            inset: 0,

            background:
              "linear-gradient(to right, transparent 50%, rgba(255,255,255,0.35) 75%, rgba(0,0,0,0.9) 100%)",

            mixBlendMode: "difference",
            pointerEvents: "none",
          }}
        />
      </div>
    </motion.div>
  );
}
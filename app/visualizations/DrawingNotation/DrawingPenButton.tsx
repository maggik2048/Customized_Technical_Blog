"use client";

import React from "react";
import { motion } from "framer-motion";

export default function DrawingPenButton() {
  return (
    <motion.div
      initial={{ scale: 1, rotate: 0 }}
      whileHover={{
        scale: 1.12,
        rotate: -3,
      }}
      whileTap={{
        scale: 0.96,
      }}
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

        // 클릭 영역 확장 (UX 개선)
        padding: 12,
      }}
    >
      <img
        src="/images/drawmarks/fountainPen2.png"
        alt="drawing pen button"
        style={{
          width: 560,
          height: "auto",

          // 버튼 느낌 강화
          filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.4))",

          userSelect: "none",
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}
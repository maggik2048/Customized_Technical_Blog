// @/components/PunchFilterOverlay.tsx
"use client";

import { motion } from "framer-motion";

type Props = {
  visible?: boolean;
};

export default function PunchFilterOverlay({
  visible = true,
}: Props) {
  return (
    <>
      {/* 전체 punch tone */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{
          duration: 0.45,
          ease: "easeOut",
        }}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 8,

          // 핵심
          backdropFilter: `
            saturate(1.18)
            contrast(1.08)
            brightness(1.06)
          `,

          WebkitBackdropFilter: `
            saturate(1.18)
            contrast(1.08)
            brightness(1.06)
          `,
        }}
      />

      {/* 하이라이트 bloom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 0.18 : 0 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9,

          background: `
            radial-gradient(
              circle at center,
              rgba(255,255,255,0.16) 0%,
              rgba(255,255,255,0.06) 35%,
              rgba(255,255,255,0) 70%
            )
          `,

          mixBlendMode: "screen",
        }}
      />

      {/* 미세 컬러 punch */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 0.12 : 0 }}
        transition={{
          duration: 0.45,
        }}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 10,

          background: `
            linear-gradient(
              180deg,
              rgba(255,140,80,0.08),
              rgba(255,255,255,0)
            )
          `,

          mixBlendMode: "overlay",
        }}
      />
    </>
  );
}
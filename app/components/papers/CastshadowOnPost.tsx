// @/components/CastshadowOnPost.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  side: "left" | "right" | "center";
  visible?: boolean;
};

export default function CastshadowOnPost({
  side,
  visible = true,
}: Props) {
  const shadowSrc =
    side === "left"
      ? "/images/shadow/leftshadow.png"
      : side === "right"
      ? "/images/shadow/rightshadow.png"
      : "/images/shadow/centershadow.png";

  // 중앙 방향으로 자연스럽게 fade
  const edgeFadeMask =
    side === "left"
      ? `
        linear-gradient(
          to right,
          rgba(0,0,0,1) 0%,
          rgba(0,0,0,1) 62%,
          rgba(0,0,0,0.85) 72%,
          rgba(0,0,0,0.45) 82%,
          rgba(0,0,0,0.12) 92%,
          rgba(0,0,0,0) 100%
        )
      `
      : side === "right"
      ? `
        linear-gradient(
          to left,
          rgba(0,0,0,1) 0%,
          rgba(0,0,0,1) 62%,
          rgba(0,0,0,0.85) 72%,
          rgba(0,0,0,0.45) 82%,
          rgba(0,0,0,0.12) 92%,
          rgba(0,0,0,0) 100%
        )
      `
      : "none";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      style={{
        position: "fixed",

        top: 0,
        bottom: 0,

        pointerEvents: "none",

        zIndex: 5,

        overflow: "hidden",

        willChange: "opacity",

        // cinematic depth 유지
        mixBlendMode: "multiply",

        ...(side === "left"
          ? {
              left: 0,
              width: "50%",
            }
          : side === "right"
          ? {
              right: 0,
              width: "50%",
            }
          : {
              left: 0,
              right: 0,
              width: "100%",
            }),
      }}
    >
      <Image
        src={shadowSrc}
        alt={`${side}-shadow`}
        fill
        priority
        draggable={false}
        style={{
          objectFit: "cover",

          userSelect: "none",

          opacity: 0.9,

          // 핵심:
          // 중앙 방향 끝부분만 자연스럽게 fade
          maskImage: edgeFadeMask,

          WebkitMaskImage:
            edgeFadeMask,
        }}
      />
    </motion.div>
  );
}
// @/components/CastshadowOnPost.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  side: "left" | "right";
  visible?: boolean;
};

export default function CastshadowOnPost({
  side,
  visible = true,
}: Props) {
  const shadowSrc =
    side === "left"
      ? "/images/shadow/leftshadow.png"
      : "/images/shadow/rightshadow.png";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 999,

        // 핵심
        mixBlendMode: "multiply",

        // GPU 가속
        willChange: "opacity, transform",
      }}
    >
      <Image
        src={shadowSrc}
        alt={`${side}-shadow`}
        fill
        priority
        draggable={false}
        style={{
          objectFit: "contain",
          userSelect: "none",
        }}
      />
    </motion.div>
  );
}
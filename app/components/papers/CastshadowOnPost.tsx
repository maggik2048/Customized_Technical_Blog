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

        top: 0,
        bottom: 0,

        // 왼쪽 shadow 는 왼쪽 절반만
        ...(side === "left"
          ? {
              left: 0,
              width: "50%",
            }
          : {
              right: 0,
              width: "50%",
            }),

        pointerEvents: "none",

        zIndex: 5,

        overflow: "hidden",

        mixBlendMode: "multiply",

        willChange: "opacity",
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
        }}
      />
    </motion.div>
  );
}
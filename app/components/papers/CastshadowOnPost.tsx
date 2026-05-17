"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useCastShadowFilter } from "@/app/context/CastShadowFilterContext";

type Props = {
  side: "left" | "right" | "center";
  visible?: boolean;
};

export default function CastshadowOnPost({
  side,
  visible = true,
}: Props) {
  const { shadowOn } = useCastShadowFilter();

  const shouldShow = visible && shadowOn;

  const shadowSrc =
    side === "left"
      ? "/images/shadow/leftshadow.png"
      : side === "right"
      ? "/images/shadow/rightshadow.png"
      : "/images/shadow/centershadow.png";

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
      animate={{ opacity: shouldShow ? 1 : 0 }}
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
        mixBlendMode: "multiply",

        ...(side === "left"
          ? { left: 0, width: "50%" }
          : side === "right"
          ? { right: 0, width: "50%" }
          : { left: 0, right: 0, width: "100%" }),
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
          maskImage: edgeFadeMask,
          WebkitMaskImage: edgeFadeMask,
        }}
      />
    </motion.div>
  );
}
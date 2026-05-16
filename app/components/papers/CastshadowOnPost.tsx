// @/components/CastshadowOnPost.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  side: "left" | "right" | "center"; // 'center' 타입을 추가하여 확장성을 확보합니다.
  visible?: boolean;
};

export default function CastshadowOnPost({
  side,
  visible = true,
}: Props) {
  // side 값에 따라 사용할 섀도우 이미지 매핑 (나중에 중앙용 이미지 경로를 넣으시면 됩니다)
  const shadowSrc =
    side === "left"
      ? "/images/shadow/leftshadow.png"
      : side === "right"
      ? "/images/shadow/rightshadow.png"
      : "/images/shadow/centershadow.png"; // <- 중앙용 다른 섀도우 이미지 경로

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
        pointerEvents: "none",
        zIndex: 5,
        overflow: "hidden",
        mixBlendMode: "multiply",
        willChange: "opacity",

        // side 스타일에 따른 위치 및 너비 분기
        ...(side === "left"
          ? { left: 0, width: "50%" }
          : side === "right"
          ? { right: 0, width: "50%" }
          : { left: 0, right: 0, width: "100%" }), // center일 때는 전체를 채우도록 설정
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
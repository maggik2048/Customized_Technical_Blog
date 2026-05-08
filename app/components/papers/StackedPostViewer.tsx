"use client";

import { motion } from "framer-motion";
import PDFPage from "@/app/post/[id]/PDFPage";

type Props = {
  posts: any[];
  index: number;
  onChangeIndex: (i: number) => void;
};

export default function StackedPostViewer({
  posts,
  index,
  onChangeIndex,
}: Props) {
  const STACK_OFFSET = -520;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        marginTop: 40,
        height: "100vh",

        transform: `translateX(${STACK_OFFSET}px)`,

        willChange: "transform",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      }}
    >
      {posts.map((post, i) => {
        const offset = i - index;

        if (Math.abs(offset) > 3) return null;

        const isCurrent = offset === 0;

        const style =
          offset === 0
            ? {
                x: 0,
                y: 0,
                scale: 1,
                rotate: 0,
                opacity: 1,
                zIndex: 30,
              }
            : offset === -1
            ? {
                x: -520,
                y: -40,
                scale: 0.9,
                rotate: -3,
                opacity: 1,
                zIndex: 20,
              }
            : offset === 1
            ? {
                x: 520,
                y: -40,
                scale: 0.9,
                rotate: 3,
                opacity: 1,
                zIndex: 20,
              }
            : offset < 0
            ? {
                x: -700,
                y: -60,
                scale: 0.85,
                rotate: -4,
                opacity: 0,
                zIndex: 10,
              }
            : {
                x: 700,
                y: -60,
                scale: 0.85,
                rotate: 4,
                opacity: 0,
                zIndex: 10,
              };

        const isLeft = offset < 0;
        const isRight = offset > 0;

        return (
          <motion.div
            key={post.id}
            animate={style}
            transition={{
              type: "spring",
              stiffness: 70,
              damping: 26,
              mass: 0.9,
            }}
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",

              cursor: isCurrent ? "default" : "pointer",

              willChange: "transform, opacity",

              transformStyle: "preserve-3d",

              backfaceVisibility: "hidden",

              WebkitBackfaceVisibility: "hidden",

              WebkitFontSmoothing: "antialiased",

              contain: "layout paint style",

              // 핵심
              // 가운데쪽으로 갈수록 투명해짐
              maskImage: isLeft
                ? `
                  linear-gradient(
                    to right,
                    rgba(0,0,0,1) 0%,
                    rgba(0,0,0,1) 45%,
                    rgba(0,0,0,0.85) 60%,
                    rgba(0,0,0,0.55) 72%,
                    rgba(0,0,0,0.25) 82%,
                    rgba(0,0,0,0.08) 92%,
                    rgba(0,0,0,0) 100%
                  )
                `
                : isRight
                ? `
                  linear-gradient(
                    to left,
                    rgba(0,0,0,1) 0%,
                    rgba(0,0,0,1) 45%,
                    rgba(0,0,0,0.85) 60%,
                    rgba(0,0,0,0.55) 72%,
                    rgba(0,0,0,0.25) 82%,
                    rgba(0,0,0,0.08) 92%,
                    rgba(0,0,0,0) 100%
                  )
                `
                : "none",

              WebkitMaskImage: isLeft
                ? `
                  linear-gradient(
                    to right,
                    rgba(0,0,0,1) 0%,
                    rgba(0,0,0,1) 45%,
                    rgba(0,0,0,0.85) 60%,
                    rgba(0,0,0,0.55) 72%,
                    rgba(0,0,0,0.25) 82%,
                    rgba(0,0,0,0.08) 92%,
                    rgba(0,0,0,0) 100%
                  )
                `
                : isRight
                ? `
                  linear-gradient(
                    to left,
                    rgba(0,0,0,1) 0%,
                    rgba(0,0,0,1) 45%,
                    rgba(0,0,0,0.85) 60%,
                    rgba(0,0,0,0.55) 72%,
                    rgba(0,0,0,0.25) 82%,
                    rgba(0,0,0,0.08) 92%,
                    rgba(0,0,0,0) 100%
                  )
                `
                : "none",

              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",

              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
            }}
            onClick={() => onChangeIndex(i)}
          >
            <PDFPage
              data={post}
              isStandalone={false}
              isActive={isCurrent}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
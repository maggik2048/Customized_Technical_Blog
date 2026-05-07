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
                zIndex: 3,
              }
            : offset === -1
            ? {
                x: -520,
                y: -40,
                scale: 0.9,
                rotate: -3,
                opacity: 0.7,
                zIndex: 2,
              }
            : offset === 1
            ? {
                x: 520,
                y: -40,
                scale: 0.9,
                rotate: 3,
                opacity: 0.7,
                zIndex: 2,
              }
            : offset < 0
            ? {
                x: -700,
                y: -60,
                scale: 0.85,
                rotate: -4,
                opacity: 0,
                zIndex: 1,
              }
            : {
                x: 700,
                y: -60,
                scale: 0.85,
                rotate: 4,
                opacity: 0,
                zIndex: 1,
              };

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
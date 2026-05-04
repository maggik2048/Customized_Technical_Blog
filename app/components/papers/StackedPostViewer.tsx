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
  const STACK_OFFSET = -520; //  여기 값만 바꾸면 전체 이동량 조절 가능

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        marginTop: 40,
        height: "100vh",
        transform: `translateX(${STACK_OFFSET}px)`, // 핵심
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
              stiffness: 90,
              damping: 18,
            }}
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              cursor: isCurrent ? "default" : "pointer",
            }}
            onClick={() => onChangeIndex(i)}
          >
            <PDFPage data={post} isStandalone={false} />
          </motion.div>
        );
      })}
    </div>
  );
}
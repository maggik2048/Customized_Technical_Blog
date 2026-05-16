// @/components/StackedPostViewer.tsx
"use client";

import { motion } from "framer-motion";
import PDFPage from "@/app/post/[id]/PDFPage";
import ViewportGuard from "./ViewportGuard";
import CastshadowOnPost from "./CastshadowOnPost";

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
  // 중앙 정렬 기준
  const STACK_OFFSET = -520;

  return (
    <>
      <ViewportGuard maxWidth="1400px">
        <motion.div
          animate={{ x: STACK_OFFSET }}
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            marginTop: 40,
            height: "100vh",

            willChange: "transform",

            transformStyle: "preserve-3d",
          }}
        >
          {posts.map((post, i) => {
            const offset = i - index;

            // 너무 먼 카드 제거
            if (Math.abs(offset) > 3) return null;

            const isCurrent = offset === 0;
            const isLeft = offset < 0;
            const isRight = offset > 0;

            const style = getPostStyle(offset);

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

                  cursor: isCurrent
                    ? "default"
                    : "pointer",

                  willChange:
                    "transform, opacity",

                  transformStyle:
                    "preserve-3d",

                  backfaceVisibility:
                    "hidden",

                  WebkitBackfaceVisibility:
                    "hidden",

                  overflow: "hidden",

                  // 좌우 잘리는 마스크
                  maskImage: getMaskGradient(
                    isLeft,
                    isRight
                  ),

                  WebkitMaskImage:
                    getMaskGradient(
                      isLeft,
                      isRight
                    ),
                }}
                onClick={() =>
                  onChangeIndex(i)
                }
              >
                <PDFPage
                  data={post}
                  isStandalone={false}
                  isActive={isCurrent}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </ViewportGuard>

      {/* 화면 고정 shadow overlay */}

      {posts[index - 1] && (
        <CastshadowOnPost
          side="left"
        />
      )}

      {posts[index + 1] && (
        <CastshadowOnPost
          side="right"
        />
      )}
    </>
  );
}

// 카드 스타일
function getPostStyle(offset: number) {
  if (offset === 0) {
    return {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      opacity: 1,
      zIndex: 30,
    };
  }

  if (offset === -1) {
    return {
      x: -520,
      y: -40,
      scale: 0.9,
      rotate: -3,
      opacity: 1,
      zIndex: 20,
    };
  }

  if (offset === 1) {
    return {
      x: 520,
      y: -40,
      scale: 0.9,
      rotate: 3,
      opacity: 1,
      zIndex: 20,
    };
  }

  return offset < 0
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
}

// 카드 가장자리 마스크
function getMaskGradient(
  isLeft: boolean,
  isRight: boolean
) {
  if (isLeft) {
    return `
      linear-gradient(
        to right,
        rgba(0,0,0,1) 45%,
        rgba(0,0,0,0) 100%
      )
    `;
  }

  if (isRight) {
    return `
      linear-gradient(
        to left,
        rgba(0,0,0,1) 45%,
        rgba(0,0,0,0) 100%
      )
    `;
  }

  return "none";
}
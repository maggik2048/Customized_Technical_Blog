// @/components/StackedPostViewer.tsx
"use client";

import { motion } from "framer-motion";
import PDFPage from "@/app/post/[id]/PDFPage";
import ViewportGuard from "./ViewportGuard"; // 위에서 만든 가드 임포트

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
  // 사용자가 보고 싶은 중앙 정렬 기준 (필요시 조정)
  const STACK_OFFSET = -520; 

  return (
    <ViewportGuard maxWidth="1400px"> {/* 👈 여기서 문서가 보일 전체 영역을 제한합니다 */}
      <motion.div
        animate={{ x: STACK_OFFSET }} // 부모가 아닌 이 컨테이너가 움직이며 가드 안에서 짤립니다.
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
          if (Math.abs(offset) > 3) return null;

          const isCurrent = offset === 0;
          const isLeft = offset < 0;
          const isRight = offset > 0;

          // 스타일 설정 (기존 로직 유지)
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
                cursor: isCurrent ? "default" : "pointer",
                willChange: "transform, opacity",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",

                // 마스크 효과 (뚝 끊기는 느낌을 주려면 gradient의 stop point를 조절하세요)
                maskImage: getMaskGradient(isLeft, isRight),
                WebkitMaskImage: getMaskGradient(isLeft, isRight),
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
      </motion.div>
    </ViewportGuard>
  );
}

// 헬퍼 함수: 코드 가독성을 위해 스타일 로직 분리
function getPostStyle(offset: number) {
  if (offset === 0) return { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, zIndex: 30 };
  if (offset === -1) return { x: -520, y: -40, scale: 0.9, rotate: -3, opacity: 1, zIndex: 20 };
  if (offset === 1) return { x: 520, y: -40, scale: 0.9, rotate: 3, opacity: 1, zIndex: 20 };
  return offset < 0 
    ? { x: -700, y: -60, scale: 0.85, rotate: -4, opacity: 0, zIndex: 10 }
    : { x: 700, y: -60, scale: 0.85, rotate: 4, opacity: 0, zIndex: 10 };
}

function getMaskGradient(isLeft: boolean, isRight: boolean) {
  if (isLeft) return `linear-gradient(to right, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)`;
  if (isRight) return `linear-gradient(to left, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)`;
  return "none";
}
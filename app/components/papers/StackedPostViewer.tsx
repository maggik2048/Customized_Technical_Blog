"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import PDFPage from "@/app/post/[id]/PDFPage";
import ViewportGuard from "./ViewportGuard";
import CastshadowOnPost from "./CastshadowOnPost";
import PunchFilterOverlay from "./PunchFilterOverlay";
import {
  getPostStyle,
  springTransition,
} from "./StackedPostAnimation";

type Props = {
  posts: any[];
  index: number;
  onChangeIndex: (i: number) => void;
  onToggle3D?: (imagePath?: string) => void;
  currentImage?: string;
};

const LEFT_MASK = "linear-gradient(to right, rgba(0,0,0,1) 45%, rgba(0,0,0,0))";
const RIGHT_MASK = "linear-gradient(to left, rgba(0,0,0,1) 45%, rgba(0,0,0,0))";

// 🔥 FIX: Use React.CSSProperties type for BASE_STYLE
const BASE_STYLE: React.CSSProperties = {
  position: "absolute" as const,
  left: "50%",
  transform: "translateX(-50%)",
  willChange: "transform, opacity",
  transformStyle: "preserve-3d" as const,
  backfaceVisibility: "hidden" as const,
  WebkitBackfaceVisibility: "hidden" as const,
  overflow: "visible" as const,
};

export default function StackedPostViewer({
  posts,
  index,
  onChangeIndex,
  onToggle3D,
  currentImage,
}: Props) {
  const STACK_OFFSET = -520;

  // posts 배열에서 현재 인덱스 기준으로 이전, 현재, 다음 포스트 추출
  const prev = posts[index - 1];
  const current = posts[index];
  const next = posts[index + 1];

  const animLeft = useMemo(() => getPostStyle(-1), []);
  const animCenter = useMemo(() => getPostStyle(0), []);
  const animRight = useMemo(() => getPostStyle(1), []);

  // 현재 포스트가 없으면 렌더링하지 않음
  if (!current) {
    return <div style={{ padding: "40px", textAlign: "center" }}>No post to display</div>;
  }

  return (
    <>
      {/* 🆕 3D 토글 버튼 */}
      {onToggle3D && currentImage && (
        <button
          onClick={() => onToggle3D(currentImage)}
          style={{
            position: "fixed",
            bottom: "180px",
            right: "40px",
            zIndex: 99999,
            padding: "14px 24px",
            background: "rgba(0, 0, 0, 0.85)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.background = "rgba(30, 30, 30, 0.95)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.85)";
          }}
        >
          <span style={{ fontSize: "20px" }}>🌊</span>
          3D 보기
        </button>
      )}

      <ViewportGuard maxWidth="1400px">
        <motion.div
          animate={{
            x: STACK_OFFSET,
          }}
          style={{
            position: "relative" as const,
            display: "flex",
            justifyContent: "center",
            marginTop: 40,
            height: "100vh",
            willChange: "transform",
            transformStyle: "preserve-3d" as const,
            perspective: 1800,
            overflow: "visible" as const,
          }}
        >
          {/* LEFT - 이전 포스트 */}
          {prev && (
            <motion.div
              key={prev.id}
              animate={animLeft}
              transition={springTransition}
              style={{
                ...BASE_STYLE,
                cursor: "pointer",
                zIndex: 20,
                opacity: 0.92,
                filter: "grayscale(0.42) saturate(0.45)",
                maskImage: LEFT_MASK,
                WebkitMaskImage: LEFT_MASK,
              }}
              onClick={() => {
                const prevIndex = index - 1;
                if (prevIndex >= 0) {
                  onChangeIndex(prevIndex);
                }
              }}
            >
              <PDFPage
                data={prev}
                isStandalone={false}
                isActive={false}
                globalIndex={prev.__globalIndex}
                localIndex={prev.__localIndex}
                localTotal={prev.__localTotal}
              />
            </motion.div>
          )}

          {/* CENTER - 현재 포스트 */}
          {current && (
            <motion.div
              key={current.id}
              animate={animCenter}
              transition={springTransition}
              style={{
                ...BASE_STYLE,
                cursor: "default",
                zIndex: 100,
                opacity: 1,
                isolation: "isolate",
                maskImage: "none",
                WebkitMaskImage: "none",
              }}
            >
              <PDFPage
                data={current}
                isStandalone={false}
                isActive={true}
                globalIndex={current.__globalIndex}
                localIndex={current.__localIndex}
                localTotal={current.__localTotal}
              />
            </motion.div>
          )}

          {/* RIGHT - 다음 포스트 */}
          {next && (
            <motion.div
              key={next.id}
              animate={animRight}
              transition={springTransition}
              style={{
                ...BASE_STYLE,
                cursor: "pointer",
                zIndex: 20,
                opacity: 0.92,
                filter: "grayscale(0.42) saturate(0.45)",
                maskImage: RIGHT_MASK,
                WebkitMaskImage: RIGHT_MASK,
              }}
              onClick={() => {
                const nextIndex = index + 1;
                if (nextIndex < posts.length) {
                  onChangeIndex(nextIndex);
                }
              }}
            >
              <PDFPage
                data={next}
                isStandalone={false}
                isActive={false}
                globalIndex={next.__globalIndex}
                localIndex={next.__localIndex}
                localTotal={next.__localTotal}
              />
            </motion.div>
          )}
        </motion.div>
      </ViewportGuard>

      {prev && <CastshadowOnPost side="left" />}
      {next && <CastshadowOnPost side="right" />}
      <PunchFilterOverlay />
    </>
  );
}
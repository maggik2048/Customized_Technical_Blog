"use client";

import { motion } from "framer-motion";

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
};

export default function StackedPostViewer({
  posts,
  index,
  onChangeIndex,
}: Props) {
  const STACK_OFFSET = -520;

  const prev = posts[index - 1];
  const current = posts[index];
  const next = posts[index + 1];

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
            perspective: 1800,
          }}
        >
          {/* LEFT */}
          {prev && (
            <motion.div
              key={prev.id}
              animate={getPostStyle(-1)}
              transition={springTransition}
              style={getBaseStyle(false, true, false)}
              onClick={() => onChangeIndex(index - 1)}
            >
              <PDFPage data={prev} isStandalone={false} isActive={false} />
            </motion.div>
          )}

          {/* CENTER */}
          {current && (
            <motion.div
              key={current.id}
              animate={getPostStyle(0)}
              transition={springTransition}
              style={getBaseStyle(true, false, false)}
            >
              <PDFPage data={current} isStandalone={false} isActive={true} />
            </motion.div>
          )}

          {/* RIGHT */}
          {next && (
            <motion.div
              key={next.id}
              animate={getPostStyle(1)}
              transition={springTransition}
              style={getBaseStyle(false, false, true)}
              onClick={() => onChangeIndex(index + 1)}
            >
              <PDFPage data={next} isStandalone={false} isActive={false} />
            </motion.div>
          )}
        </motion.div>
      </ViewportGuard>

      {/* shadow layering 유지 */}
      {prev && <CastshadowOnPost side="left" />}
      {next && <CastshadowOnPost side="right" />}

      <PunchFilterOverlay />
    </>
  );
}

/* ========================= */
/* BASE STYLE (유지 그대로) */
/* ========================= */

function getBaseStyle(
  isCurrent: boolean,
  isLeft: boolean,
  isRight: boolean
) {
  return {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",

    cursor: isCurrent ? "default" : "pointer",

    willChange: "transform, opacity",
    transformStyle: "preserve-3d" as const,
    backfaceVisibility: "hidden" as const,
    WebkitBackfaceVisibility: "hidden" as const,

    overflow: "hidden",

    isolation: isCurrent ? "isolate" : undefined,

    zIndex: isCurrent ? 100 : 20,

    filter: isCurrent
      ? "none"
      : "grayscale(0.42) saturate(0.45)",

    opacity: isCurrent ? 1 : 0.92,

    maskImage: getMaskGradient(isLeft, isRight),
    WebkitMaskImage: getMaskGradient(isLeft, isRight),
  };
}

/* ========================= */
/* MASK (그대로 유지) */
/* ========================= */

function getMaskGradient(isLeft: boolean, isRight: boolean) {
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
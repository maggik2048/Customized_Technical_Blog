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
};

const LEFT_MASK =
  "linear-gradient(to right, rgba(0,0,0,1) 45%, rgba(0,0,0,0))";

const RIGHT_MASK =
  "linear-gradient(to left, rgba(0,0,0,1) 45%, rgba(0,0,0,0))";

const BASE_STYLE = {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  willChange: "transform, opacity",
  transformStyle: "preserve-3d" as const,
  backfaceVisibility: "hidden" as const,
  WebkitBackfaceVisibility: "hidden" as const,
  overflow: "hidden",
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

  const animLeft = useMemo(() => getPostStyle(-1), []);
  const animCenter = useMemo(() => getPostStyle(0), []);
  const animRight = useMemo(() => getPostStyle(1), []);

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
              onClick={() => onChangeIndex(index - 1)}
            >
              <PDFPage data={prev} isStandalone={false} isActive={false} />
            </motion.div>
          )}

          {/* CENTER */}
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
              <PDFPage data={current} isStandalone={false} isActive={true} />
            </motion.div>
          )}

          {/* RIGHT */}
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
              onClick={() => onChangeIndex(index + 1)}
            >
              <PDFPage data={next} isStandalone={false} isActive={false} />
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
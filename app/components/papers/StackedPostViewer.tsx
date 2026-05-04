"use client";

import { motion } from "framer-motion";
import PDFPage from "@/app/post/[id]/PDFPage";

export default function StackedPostViewer({ current, prev, next }: any) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        marginTop: 40,
      }}
    >
      {/*  현재 글 */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
        <PDFPage data={current} isStandalone={false} />
      </motion.div>

      {/*  이전 글 (왼쪽 뒤) */}
      {prev && (
        <div
          style={{
            position: "absolute",
            left: "50%",
          }}
        >
          <motion.div
            initial={{
              x: -500,
              y: -40,
              scale: 0.9,
              rotate: -3,
              opacity: 0,
            }}
            animate={{
              x: -540,
              y: -60,
              scale: 0.9,
              rotate: -3,
              opacity: 0.4,
            }}
            transition={{ duration: 0.5 }}
            style={{
              transform: "translateX(-50%)", //  중앙 기준 보정
              zIndex: 1,
              pointerEvents: "none",
            }}
          >
            <PDFPage data={prev} isStandalone={false} />
          </motion.div>
        </div>
      )}

      {/*  다음 글 (오른쪽 뒤) */}
      {next && (
        <div
          style={{
            position: "absolute",
            left: "50%",
          }}
        >
          <motion.div
            initial={{
              x: 200,
              y: -40,
              scale: 0.9,
              rotate: 3,
              opacity: 0,
            }}
            animate={{
              x: 140,
              y: -60,
              scale: 0.9,
              rotate: 3,
              opacity: 0.4,
            }}
            transition={{ duration: 0.5 }}
            style={{
              transform: "translateX(-50%)", //  중앙 기준 보정
              zIndex: 1,
              pointerEvents: "none",
            }}
          >
            <PDFPage data={next} isStandalone={false} />
          </motion.div>
        </div>
      )}
    </div>
  );
}
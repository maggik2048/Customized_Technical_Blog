"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PDFPage from "@/app/post/[id]/PDFPage";

export default function StackedPostViewer({ current, prev, next }: any) {
  //  배열 구조로 변경
  const posts = [prev, current, next].filter(Boolean);

  // current 위치를 index로 잡기
  const initialIndex = prev ? 1 : 0;
  const [index, setIndex] = useState(initialIndex);

  const goPrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const goNext = () => {
    if (index < posts.length - 1) setIndex(index + 1);
  };

  //  핵심: 위치 계산
  const getStyle = (i: number) => {
    const offset = i - index;

    if (offset === 0) {
      return {
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        opacity: 1,
        zIndex: 2,
      };
    }

    if (offset === -1) {
      return {
        x: -540,
        y: -60,
        scale: 0.9,
        rotate: -3,
        opacity: 0.4,
        zIndex: 1,
      };
    }

    if (offset === 1) {
      return {
        x: 140,
        y: -60,
        scale: 0.9,
        rotate: 3,
        opacity: 0.4,
        zIndex: 1,
      };
    }

    return { opacity: 0 };
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        marginTop: 40,
      }}
    >
      {posts.map((post, i) => {
        const style = getStyle(i);

        return (
          <motion.div
            key={post.id}
            animate={style}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: style.zIndex,
              cursor: i !== index ? "pointer" : "default",
            }}
            onClick={() => {
              if (i < index) goPrev();
              if (i > index) goNext();
            }}
          >
            <PDFPage data={post} isStandalone={false} />
          </motion.div>
        );
      })}
    </div>
  );
}
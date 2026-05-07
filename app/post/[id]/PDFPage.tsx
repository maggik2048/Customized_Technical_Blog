"use client";

import React from "react";

import { Bona_Nova_SC } from "next/font/google";
import { Cormorant_SC } from "next/font/google";

import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";

import "katex/dist/katex.min.css";

import { motion } from "framer-motion";

import PostAdminActions from "@/app/admin/PostAdminActions";

import { markdownComponents } from "@/lib/markdownComponents";
import { sciFiMarkdownComponents } from "@/app/components/Markdown/SciFiMarkdownComponents";

import { useDarkMode } from "@/app/context/DarkModeContext";

import { getHeaderImage } from "@/lib/getHeaderImage";

import { visualizationRegistry } from "@/lib/visualizationRegistry";

import { remarkCarattere } from "@/lib/remarkCarattere";

import NotepageLines from "@/app/components/markdown/NotepageLines";

import RemarkPageRenderer from "@/app/components/Markdown/remarkPageRenderer";

/* 새 코드블럭 */
import CodeBlockWithCopy from "@/app/components/Markdown/CodeBlockWithCopy";

/* 프레임 */
import PaperDecorFrame from "@/app/components/papers/PaperDecorFrame";

type Props = {
  data: any;
  isActive?: boolean;
  isStandalone?: boolean;
};

/* 헤더 전용 폰트 */
const bonaNova = Bona_Nova_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const cormorant = Cormorant_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function PDFPage({
  data,
  isActive = true,
}: Props) {
  const { mode } = useDarkMode();

  const isDark = mode === "dark";

  const headerImage = getHeaderImage(data);

  const textColor = isDark ? "#eee" : "#111";

  /* 헤더 높이 */
  const HEADER_HEIGHT = 560;

  const pageStyle: React.CSSProperties = {
    width: 860,

    margin: "40px auto",

    position: "relative",

    transform: "scale(1)",

    transformOrigin: "top left",

    background: isDark
      ? "rgba(60,60,60,0.6)"
      : "rgba(255,255,255,0.72)",

    backdropFilter: "none",

    paddingLeft: 64,
    paddingRight: 64,

    borderRadius: 12,

    overflow: "hidden",

    boxShadow: isDark
      ? "0 8px 30px rgba(0,0,0,0.6)"
      : "0 8px 30px rgba(0,0,0,0.15)",
  };

  const markdownProps = {
    remarkPlugins: [remarkMath, remarkGfm, remarkCarattere],

    rehypePlugins: [rehypeKatex, rehypeRaw],

    components: {
      ...markdownComponents,

      ...(isDark ? sciFiMarkdownComponents : {}),

      code: CodeBlockWithCopy,
    },
  };

  return (
    <motion.div
      style={{
        color: textColor,

        willChange: "transform, opacity",

        transformStyle: "preserve-3d",

        backfaceVisibility: "hidden",
      }}
    >
      {/* 현재 페이지일때만 full decor */}
      <PaperDecorFrame enabled={isActive}>
        <div style={pageStyle}>
          {/* HEADER */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: HEADER_HEIGHT,

              overflow: "hidden",
            }}
          >
            {/* 헤더 이미지 */}
            <img
              src={headerImage}
              style={{
                width: "100%",
                height: "100%",

                objectFit: "cover",

                objectPosition: "center center",

                transform: "scale(1.02)",
              }}
            />

            {/* TOP DARK VIGNETTE + BOTTOM WHITE FADE */}
            <div
              style={{
                position: "absolute",
                inset: 0,

                background: isDark
                  ? `
                    linear-gradient(
                      to bottom,
                      rgba(0,0,0,0.82) 0%,
                      rgba(0,0,0,0.38) 22%,
                      rgba(0,0,0,0.08) 48%,
                      rgba(20,20,20,0.22) 68%,
                      rgba(30,30,30,0.82) 100%
                    )
                  `
                  : `
                    linear-gradient(
                      to bottom,
                      rgba(0,0,0,0.58) 0%,
                      rgba(0,0,0,0.18) 24%,
                      rgba(255,255,255,0) 68%,
                      rgba(255,255,255,0.78) 95%,
                      rgba(255,255,255,1) 100%
                    )
                  `,
              }}
            />

            {/* 추가 soft glow */}
            <div
              style={{
                position: "absolute",
                inset: 0,

                background: `
                  radial-gradient(
                    circle at top,
                    rgba(255,255,255,0.08),
                    transparent 60%
                  )
                `,

                mixBlendMode: "screen",

                pointerEvents: "none",
              }}
            />

            {/* TITLE */}
            <div
              style={{
                position: "absolute",
                bottom: 38,
                left: 48,
                right: 48,

                color: "#fff",
              }}
            >
              <h1
                className={cormorant.className}
                style={{
                  fontSize: 42,

                  margin: 0,

                  lineHeight: 1.08,

                  letterSpacing: "0.02em",

                  textShadow: "0 3px 18px rgba(0,0,0,0.55)",
                }}
              >
                {data.title}
              </h1>
            </div>

            {/* ADMIN */}
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 40,
              }}
            >
              <PostAdminActions postId={data.id} />
            </div>
          </div>

          {/* CONTENT */}
          <div style={{ paddingTop: HEADER_HEIGHT }}>
            <NotepageLines>
              {(() => {
                const regex = /\[([A-Za-z_][A-Za-z0-9_]*)\]/g;

                const codeBlocks: string[] = [];

                const protectedContent = data.content.replace(
                  /```[\s\S]*?```/g,
                  (match: string) => {
                    codeBlocks.push(match);

                    return `__CODE_BLOCK_${
                      codeBlocks.length - 1
                    }__`;
                  }
                );

                const parts = protectedContent.split(regex);

                const restore = (text: string) =>
                  text.replace(
                    /__CODE_BLOCK_(\d+)__/g,
                    (_, i) => codeBlocks[Number(i)]
                  );

                return parts.map((part: string, i: number) => {
                  const Component = visualizationRegistry[part];

                  if (Component) {
                    return (
                      <div key={i}>
                        <Component />
                      </div>
                    );
                  }

                  return (
                    <RemarkPageRenderer
                      key={i}
                      markdownComponents={markdownComponents}
                      sciFiMarkdownComponents={
                        sciFiMarkdownComponents
                      }
                      isDark={isDark}
                      CodeBlock={CodeBlockWithCopy}
                    >
                      {restore(part)}
                    </RemarkPageRenderer>
                  );
                });
              })()}
            </NotepageLines>
          </div>
        </div>
      </PaperDecorFrame>
    </motion.div>
  );
}
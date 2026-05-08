"use client";

import React from "react";

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

import CodeBlockWithCopy from "@/app/components/Markdown/CodeBlockWithCopy";

import PaperDecorFrame from "@/app/components/papers/PaperDecorFrame";

type Props = {
  data: any;
  isActive?: boolean;
  isStandalone?: boolean;
};

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

  const HEADER_HEIGHT = 560;

  const pageStyle: React.CSSProperties = {
    width: 860,

    margin: "40px auto",

    position: "relative",

    background: isDark
      ? "rgba(60,60,60,0.6)"
      : "rgba(255,255,255,0.72)",

    paddingLeft: 64,
    paddingRight: 64,

    borderRadius: 12,

    overflow: "hidden",

    boxShadow: isDark
      ? "0 8px 30px rgba(0,0,0,0.6)"
      : "0 8px 30px rgba(0,0,0,0.15)",
  };

  return (
    <motion.div
      style={{
        color: textColor,
      }}
    >
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
            {/* HEADER IMAGE */}
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

            {/* OVERLAY */}
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

                  textShadow:
                    "0 3px 18px rgba(0,0,0,0.55)",
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
          <div
            style={{
              paddingTop: HEADER_HEIGHT - 36,
            }}
          >
            {/* 🔥 INTRO */}
            <div
              style={{
                display: "flex",

                alignItems: "center",

                justifyContent: "flex-start",

                gap: 28,

                marginTop: 28,

                marginBottom: 34,
              }}
            >
              {/* GOLDEN RATIO IMAGE */}
              <img
                src="/images/headers/goldenratio.jpg"
                alt="golden ratio"
                style={{
                  width: 160,

                  height: 160,

                  objectFit: "contain",

                  opacity: isDark ? 0.9 : 0.82,

                  flexShrink: 0,
                }}
              />

              {/* METADATA */}
              <div
                style={{
                  display: "flex",

                  flexDirection: "column",

                  justifyContent: "center",

                  gap: 12,

                  fontSize: 15,

                  lineHeight: 1.7,

                  letterSpacing: "0.08em",

                  color: isDark
                    ? "rgba(120,180,255,0.95)"
                    : "rgba(40,90,180,0.95)",

                  textTransform: "uppercase",

                  fontFamily:
                    "'Courier New', monospace",
                }}
              >
                {/* CREATED AT */}
                <div>
                  <span
                    style={{
                      fontWeight: 700,

                      marginRight: 8,
                    }}
                  >
                    Created At:
                  </span>

                  {data.created_at
                    ? new Date(
                        data.created_at
                      ).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "Unknown"}
                </div>

                {/* CATEGORY */}
                {data.category && (
                  <div>
                    <span
                      style={{
                        fontWeight: 700,

                        marginRight: 8,
                      }}
                    >
                      Category:
                    </span>

                    {data.category}
                  </div>
                )}

                {/* DOCUMENT NUMBER */}
                {data.documentNumber && (
                  <div>
                    <span
                      style={{
                        fontWeight: 700,

                        marginRight: 8,
                      }}
                    >
                      Document:
                    </span>

                    #{data.documentNumber}
                  </div>
                )}
              </div>
            </div>

            {/* BODY */}
            <NotepageLines>
              {(() => {
                const regex =
                  /\[([A-Za-z_][A-Za-z0-9_]*)\]/g;

                const codeBlocks: string[] = [];

                const protectedContent =
                  data.content.replace(
                    /```[\s\S]*?```/g,
                    (match: string) => {
                      codeBlocks.push(match);

                      return `__CODE_BLOCK_${
                        codeBlocks.length - 1
                      }__`;
                    }
                  );

                const parts =
                  protectedContent.split(regex);

                const restore = (text: string) =>
                  text.replace(
                    /__CODE_BLOCK_(\d+)__/g,
                    (_, i) =>
                      codeBlocks[Number(i)]
                  );

                return parts.map(
                  (part: string, i: number) => {
                    const Component =
                      visualizationRegistry[part];

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
                        markdownComponents={
                          markdownComponents
                        }
                        sciFiMarkdownComponents={
                          sciFiMarkdownComponents
                        }
                        isDark={isDark}
                        CodeBlock={
                          CodeBlockWithCopy
                        }
                      >
                        {restore(part)}
                      </RemarkPageRenderer>
                    );
                  }
                );
              })()}
            </NotepageLines>
          </div>
        </div>
      </PaperDecorFrame>
    </motion.div>
  );
}
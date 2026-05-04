"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";

import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import PostAdminActions from "@/app/admin/PostAdminActions";
import { markdownComponents } from "@/lib/markdownComponents";
import { sciFiMarkdownComponents } from "@/app/components/Markdown/SciFiMarkdownComponents";
import { useDarkMode } from "@/app/context/DarkModeContext";
import { getHeaderImage } from "@/lib/getHeaderImage";
import { visualizationRegistry } from "@/lib/visualizationRegistry";
import { remarkCarattere } from "@/lib/remarkCarattere";

/* ---------------- CodeBlock ---------------- */

function CodeBlock({ inline, className, children }: any) {
  const text = String(children);
  const match = /language-(\w+)/.exec(className || "");

  if (inline || (text.length < 80 && !text.includes("\n"))) {
    return (
      <code
        style={{
          background: "#222",
          color: "#eee",
          padding: "1px 4px",
          borderRadius: 4,
        }}
      >
        {children}
      </code>
    );
  }

  return (
    <motion.div
      animate={{ backgroundColor: "#121212" }}
      transition={{ duration: 0.3 }}
      style={{
        borderRadius: 6,
        overflowX: "auto",
      }}
    >
      <SyntaxHighlighter
        style={oneDark}
        language={match?.[1] || "text"}
        PreTag="div"
      >
        {text.replace(/\n$/, "")}
      </SyntaxHighlighter>
    </motion.div>
  );
}

/* ---------------- PDF PAGE ---------------- */

export default function PDFPage({ data }: any) {
  const { mode } = useDarkMode();
  const isDark = mode === "dark";

  const headerImage = getHeaderImage(data);
  const textColor = isDark ? "#eee" : "#111";

  const lineHeight = 28;

  const HEADER_HEIGHT = 260;

  const pageStyle: React.CSSProperties = {
    width: 860,
    margin: "40px auto",
    position: "relative",

    background: isDark
      ? "rgba(60,60,60,0.6)"
      : "rgba(255,255,255,0.7)",

    backdropFilter: "blur(6px)",

    paddingLeft: 64,
    paddingRight: 64,
    borderRadius: 12,

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
      code: CodeBlock,
    },
  };

  return (
    <motion.div style={{ color: textColor }}>
      <div style={pageStyle}>
        {/* HEADER */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: HEADER_HEIGHT,
            zIndex: 2,
          }}
        >
          <img
            src={headerImage}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4))",
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 40,
              color: "#fff",
            }}
          >
            <h1 style={{ fontSize: 36, margin: 0 }}>{data.title}</h1>
          </div>

          <div style={{ position: "absolute", top: 10, right: 40 }}>
            <PostAdminActions postId={data.id} />
          </div>
        </div>

        {/* CONTENT */}
        <div
          style={{
            paddingTop: HEADER_HEIGHT - 20 + 25, // ✔ 핵심: 여기 줄여서 간격 좁힘
            position: "relative",
            lineHeight: `${lineHeight}px`,
          }}
        >
          {/* 노트 라인 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `repeating-linear-gradient(
                to bottom,
                transparent,
                transparent ${lineHeight - 1}px,
                ${
                  isDark
                    ? "rgba(255,255,255,0.25)"
                    : "rgba(120,85,40,0.25)"
                } ${lineHeight}px
              )`,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* CONTENT */}
          <div style={{ position: "relative", zIndex: 1 }}>
            {(() => {
              const regex = /\[([A-Za-z_][A-Za-z0-9_]*)\]/g;
              const codeBlocks: string[] = [];

              const protectedContent = data.content.replace(
                /```[\s\S]*?```/g,
                (match: string) => {
                  codeBlocks.push(match);
                  return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
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

                if (Component) return <Component key={i} />;

                return (
                  <ReactMarkdown key={i} {...markdownProps}>
                    {restore(part)}
                  </ReactMarkdown>
                );
              });
            })()}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
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

/* 🔥 추가 */
import NotepageLines from "@/app/components/markdown/NotepageLines";

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
      style={{ borderRadius: 6, overflowX: "auto" }}
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

  const pageStyle: React.CSSProperties = {
    width: 860,
    margin: "40px auto",
    position: "relative",
    transform: "scale(1)",
    transformOrigin: "top left",

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
            height: 260,
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

        {/* CONTENT WRAPPED (핵심 수정) */}
        <div style={{ paddingTop: 260 }}>
          <NotepageLines>
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

                if (Component) {
                  return (
                    <div key={i}>
                      <Component />
                    </div>
                  );
                }

                return (
                  <ReactMarkdown key={i} {...markdownProps}>
                    {restore(part)}
                  </ReactMarkdown>
                );
              });
            })()}
          </NotepageLines>
        </div>
      </div>
    </motion.div>
  );
}
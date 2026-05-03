"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";

import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, prism } from "react-syntax-highlighter/dist/esm/styles/prism";

import PostAdminActions from "@/app/components/PostAdminActions";
import { markdownComponents } from "@/lib/markdownComponents";
import { useDarkMode } from "@/app/context/DarkModeContext";
import { getHeaderImage } from "@/lib/getHeaderImage";
import { visualizationRegistry } from "@/lib/visualizationRegistry";
import { remarkCarattere } from "@/lib/remarkCarattere";

/* ---------------- styles ---------------- */

const customLight = {
  ...prism,
  'code[class*="language-"]': {
    ...prism['code[class*="language-"]'],
    fontWeight: 510,
  },
  comment: { ...prism.comment, fontWeight: 500 },
  keyword: { ...prism.keyword, fontWeight: 600 },
  string: { ...prism.string, fontWeight: 600 },
};

const btnStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 4,
  cursor: "pointer",
};

/* ---------------- Interactive ---------------- */

function InteractiveWrapper({ children }: any) {
  return (
    <div
      style={{
        background: "rgba(0,0,0,0.85)",
        color: "#fff",
        padding: 20,
        margin: "24px 0",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      {children}
    </div>
  );
}

/* ---------------- CodeBlock ---------------- */

function CodeBlock({ inline, className, children, codeDark }: any) {
  const text = String(children);
  const match = /language-(\w+)/.exec(className || "");

  if (inline || (text.length < 80 && !text.includes("\n"))) {
    return (
      <code
        style={{
          background: codeDark ? "#222" : "#ddd",
          color: codeDark ? "#eee" : "#111",
          padding: "1px 4px",
          borderRadius: 4,
        }}
      >
        {children}
      </code>
    );
  }

  const bgColor = codeDark ? "#121212" : "#eaeaea";
  const borderColor =
    codeDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)";

  return (
    <motion.div
      animate={{
        backgroundColor: bgColor,
        color: codeDark ? "#eee" : "#111",
      }}
      transition={{ duration: 0.4 }}
      style={{
        borderRadius: 6,
        overflowX: "auto",
        border: `1px solid ${borderColor}`,
      }}
    >
      <SyntaxHighlighter
        style={codeDark ? oneDark : customLight}
        language={match?.[1] || "text"}
        PreTag="div"
      >
        {text.replace(/\n$/, "")}
      </SyntaxHighlighter>
    </motion.div>
  );
}

/* ---------------- Header ---------------- */

function HeaderWithTitle({ src, title, date, children }: any) {
  return (
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
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
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
        <h1 style={{ fontSize: 36, margin: 0 }}>{title}</h1>
        {date && (
          <p style={{ marginTop: 4, fontSize: 14, opacity: 0.85 }}>
            {date}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}

/* ---------------- PDF PAGE ---------------- */

const SCALE = 1.25;

export default function PDFPage({ data }: any) {
  const { mode, toggle } = useDarkMode();
  const [codeDark, setCodeDark] = useState(false);

  const headerImage = getHeaderImage(data);

  const bgImage =
    mode === "dark" ? "/images/detroit.jpg" : "/images/medimath.jpeg";

  const textColor = mode === "dark" ? "#eee" : "#111";

  const pageStyle: React.CSSProperties = {
    width: 860,
    minHeight: 1100,
    margin: "40px auto",
    position: "relative",
    transform: `scale(${SCALE})`,
    transformOrigin: "top left",

    background: "rgba(255,255,255,0.7)",  // 거의 완전 흰색
    backdropFilter: "blur(4px)",           // 살짝 유리 느낌 
    paddingLeft: 64,
    paddingRight: 64,

    borderRadius: 12,
    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
  };

  const markdownProps = {
    remarkPlugins: [remarkMath, remarkGfm, remarkCarattere],
    rehypePlugins: [rehypeKatex, rehypeRaw],
    components: {
      ...markdownComponents,
      code: (props: any) => (
        <CodeBlock {...props} codeDark={codeDark} />
      ),
    },
  };

  return (
    <>
      {/* BACKGROUND */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url("${bgImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
        }}
      />

      <motion.div
        style={{
          minHeight: "100vh",
          padding: 40,
          color: textColor,
        }}
      >
        <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
          <button onClick={toggle} style={btnStyle}>
            Toggle Dark Mode
          </button>

          <button
            onClick={() => setCodeDark(v => !v)}
            style={btnStyle}
          >
            Toggle Code Dark
          </button>
        </div>

        <div style={pageStyle}>
          <HeaderWithTitle
            src={headerImage}
            title={data.title}
            date={
              data.project_date
                ? new Date(data.project_date).toLocaleString("ko-KR")
                : ""
            }
          >
            <div style={{ position: "absolute", top: 10, right: 40 }}>
              <PostAdminActions postId={data.id} />
            </div>
          </HeaderWithTitle>

          {/*  핵심 수정 부분 */}
          <div style={{ paddingTop: 260 }}>
            {(() => {
              //  1. regex 수정 (숫자 제외)
              const regex = /\[([A-Za-z_][A-Za-z0-9_]*)\]/g;

              //  2. 코드블록 보호
              const codeBlocks: string[] = [];

              const protectedContent = data.content.replace(
                /```[\s\S]*?```/g,
                (match: string) => {
                  codeBlocks.push(match);
                  return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
                }
              );

              //  3. split 유지
              const parts = protectedContent.split(regex);

              //  4. 복원
              const restore = (text: string) =>
                text.replace(
                  /__CODE_BLOCK_(\d+)__/g,
                  (_, i) => codeBlocks[Number(i)]
                );

              return parts.map((part: string, i: number) => {
                const Component = visualizationRegistry[part];

                if (Component) {
                  return (
                    <InteractiveWrapper key={i}>
                      <Component />
                    </InteractiveWrapper>
                  );
                }

                return (
                  <ReactMarkdown key={i} {...markdownProps}>
                    {restore(part)}
                  </ReactMarkdown>
                );
              });
            })()}
          </div>
        </div>
      </motion.div>
    </>
  );
}
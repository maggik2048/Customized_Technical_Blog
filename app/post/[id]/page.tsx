"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";

import PostAdminActions from "@/app/components/PostAdminActions";
import { markdownComponents } from "@/lib/markdownComponents";
import { useDarkMode } from "@/app/context/DarkModeContext";
import { getHeaderImage } from "@/lib/getHeaderImage";
import { visualizationRegistry } from "@/lib/visualizationRegistry";

/* ---------------------- 스타일 ---------------------- */

const customLight = {
  ...prism,
  'code[class*="language-"]': { ...prism['code[class*="language-"]'], fontWeight: 510 },
  comment: { ...prism.comment, fontWeight: 500 },
  keyword: { ...prism.keyword, fontWeight: 600 },
  string: { ...prism.string, fontWeight: 600 },
};

const btnStyle = { padding: "6px 12px", borderRadius: 4, cursor: "pointer" };

/* ---------------------- Interactive Wrapper (핵심) ---------------------- */

function InteractiveWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#000",
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

/* ---------------------- Code Block ---------------------- */

function CodeBlock({ inline, className, children, codeDark }: any) {
  const text = String(children);
  const match = /language-(\w+)/.exec(className || "");

  if (inline || (text.length < 80 && !text.includes("\n"))) {
    return (
      <code
        style={{
          background: codeDark ? "#222" : "#ccc",
          color: codeDark ? "#eee" : "#111",
          padding: "1px 4px",
          borderRadius: 4,
        }}
      >
        {children}
      </code>
    );
  }

  const bgColor = codeDark ? "#121212" : "#e0e0e0";
  const borderColor = codeDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.18)";

  return (
    <motion.div
      animate={{ backgroundColor: bgColor, color: codeDark ? "#eee" : "#111" }}
      transition={{ duration: 0.5 }}
      style={{ borderRadius: 6, overflowX: "auto", border: `1px solid ${borderColor}` }}
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

/* ---------------------- Header ---------------------- */

function HeaderWithTitle({
  src,
  title,
  date,
  children,
}: {
  src: string;
  title: string;
  date?: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 260, zIndex: 0 }}>
      <img src={src} alt="header" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4))" }} />
      <div style={{ position: "absolute", bottom: 20, left: 40, color: "#fff" }}>
        <h1 style={{ fontSize: 36, margin: 0 }}>{title}</h1>
        {date && <p style={{ marginTop: 4, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{date}</p>}
      </div>
      {children}
    </motion.div>
  );
}

/* ---------------------- Page ---------------------- */

export default function PostPage() {
  const { id } = useParams() as { id: string };
  const { mode: pageMode, toggle: togglePageMode } = useDarkMode();

  const [codeDark, setCodeDark] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return setLoading(false);

    supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data: post, error }) => {
        if (!error) setData(post);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (!data) return <div style={{ padding: 40 }}>Post not found</div>;

  const displayDate = data.project_date ?? data.created_at;
  const headerImage = getHeaderImage(data);

  const bgImage = pageMode === "dark" ? "/images/tri3.jpg" : "/images/geo2.jpg";
  const textColor = pageMode === "dark" ? "#eee" : "#111";

  return (
    <motion.div
      style={{
        padding: 40,
        minHeight: "100vh",
        position: "relative",
        backgroundSize: "1500px 1500px",
        backgroundRepeat: "repeat",
        backgroundPosition: "top left",
        color: textColor,
      }}
      animate={{ backgroundImage: `url("${bgImage}")` }}
      transition={{ duration: 0.5 }}
      className="document-font"
    >
      {/* 버튼 */}
      <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
        <button onClick={togglePageMode} style={btnStyle}>
          Toggle Dark Mode (Whole)
        </button>
        <button onClick={() => setCodeDark(!codeDark)} style={btnStyle}>
          Toggle Code Dark
        </button>
      </div>

      {/* 헤더 */}
      <HeaderWithTitle
        src={headerImage}
        title={data.title}
        date={displayDate ? new Date(displayDate).toLocaleString("ko-KR") : ""}
      >
        <div style={{ position: "absolute", top: 10, right: 40 }}>
          <PostAdminActions postId={id} />
        </div>
      </HeaderWithTitle>

      {/* 본문 */}
      <div style={{ marginTop: 260 }}>
        {(() => {
          const regex = /\[(\w+)\]/g;
          const parts = data.content.split(regex);

          const markdownProps = {
            remarkPlugins: [remarkMath, remarkGfm],
            rehypePlugins: [rehypeKatex, rehypeRaw],
            components: {
              ...markdownComponents,
              code: (props: any) => <CodeBlock {...props} codeDark={codeDark} />,
            },
          };

          return parts.map((part: string, i: number) => {
            const Component = visualizationRegistry[part];

            /* ---------------- 핵심 변경 ---------------- */
            if (Component) {
              return (
                <InteractiveWrapper key={i}>
                  <Component />
                </InteractiveWrapper>
              );
            }

            return (
              <ReactMarkdown key={i} {...markdownProps}>
                {part}
              </ReactMarkdown>
            );
          });
        })()}
      </div>
    </motion.div>
  );
}
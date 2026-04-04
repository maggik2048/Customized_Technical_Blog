"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
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

// 🔹 Light 모드 코드 블록 커스텀 스타일
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

export default function PostPage() {
  const params = useParams();
  const id = params?.id as string;

  const { mode: pageMode, toggle: togglePageMode } = useDarkMode();
  const [codeDark, setCodeDark] = useState(false);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      const { data: post, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) setData(post);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (!data) return <div style={{ padding: 40 }}>Post not found</div>;

  const displayDate = data.project_date ?? data.created_at;
  const headerImage = getHeaderImage(data);

  return (
    <motion.div
      style={{
        padding: 40,
        minHeight: "100vh",
        position: "relative", // 🔥 핵심
        backgroundSize: "1500px 1500px",
        backgroundRepeat: "repeat",
        backgroundPosition: "top left",
      }}
      animate={{
        backgroundImage:
          pageMode === "dark"
            ? 'url("/images/tri3.jpg")'
            : 'url("/images/geo2.jpg")',
        color: pageMode === "dark" ? "#eee" : "#111",
      }}
      transition={{ duration: 0.5 }}
      className="document-font"
    >
      {/* 🔘 버튼 (헤더 위) */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          gap: 16,
          marginBottom: 12,
        }}
      >
        <button
          onClick={togglePageMode}
          style={{
            padding: "6px 12px",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Toggle Dark Mode (Whole)
        </button>

        <button
          onClick={() => setCodeDark(!codeDark)}
          style={{
            padding: "6px 12px",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Toggle Dark Code Snippet
        </button>
      </div>

      {/* 🔥 FULL HEADER (absolute) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 260,
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <img
          src={headerImage}
          alt="header"
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
      </motion.div>

      {/* 🔥 내용 전체를 아래로 밀기 */}
      <div style={{ marginTop: 260 }}>
        {/* 기존 헤더 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <div>
            <h1 style={{ fontSize: 32 }}>{data.title}</h1>
            <p style={{ color: "#888", marginTop: 8 }}>
              {displayDate
                ? new Date(displayDate).toLocaleString("ko-KR")
                : ""}
            </p>
          </div>
          <PostAdminActions postId={id} />
        </div>

        {/* 본문 */}
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          components={{
            ...markdownComponents,
            code({ inline, className, children }) {
              const match = /language-(\w+)/.exec(className || "");
              if (inline) return <code>{children}</code>;

              return (
                <motion.div
                  animate={{
                    backgroundColor: codeDark ? "#1e1e1e" : "#f3f4f6",
                    color: codeDark ? "#eee" : "#111",
                  }}
                  transition={{ duration: 0.5 }}
                  style={{
                    borderRadius: 6,
                    overflowX: "auto",
                    border: codeDark
                      ? "1px solid rgba(255,255,255,0.255)"
                      : "1px solid rgba(0,0,0,0.18)",
                  }}
                >
                  <SyntaxHighlighter
                    style={codeDark ? oneDark : customLight}
                    language={match?.[1] || "text"}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </motion.div>
              );
            },
          }}
        >
          {data.content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
}
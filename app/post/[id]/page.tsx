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

  return (
    <motion.div
      style={{
        padding: 40,
        minHeight: "100vh",
        backgroundSize: "1500px 1500px",    // 이미지 반복 크기 조절
        backgroundRepeat: "repeat",       // 반복
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
      {/* 🔘 버튼 두 개 */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
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

      {/* 헤더 + 우측 버튼 */}
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
            {displayDate ? new Date(displayDate).toLocaleString("ko-KR") : ""}
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
                style={{ borderRadius: 6, overflowX: "auto" }}
              >
                <SyntaxHighlighter
                  style={codeDark ? oneDark : prism}
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
    </motion.div>
  );
}
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

import PostAdminActions from "@/app/components/PostAdminActions";
import { markdownComponents } from "@/lib/markdownComponents";
import { useDarkMode } from "@/app/context/DarkModeContext"; // RootLayout와 연동된 전체 페이지 DarkMode

export default function PostPage() {
  const params = useParams();
  const id = params?.id as string;

  // 1️⃣ 전체 페이지 DarkMode (RootLayout Context)
  const { mode: pageMode, toggle: togglePageMode } = useDarkMode();

  // 2️⃣ 코드 스니펫 전용 DarkMode
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
    <div
      style={{
        padding: 40,
        background: pageMode === "dark" ? "#1e1e1e" : "#fff",
        color: pageMode === "dark" ? "#eee" : "#111",
        minHeight: "100vh",
      }}
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
              <SyntaxHighlighter
                style={codeDark ? oneDark : prism} // 코드 블록 전용 상태
                language={match?.[1] || "text"}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
          },
        }}
      >
        {data.content}
      </ReactMarkdown>
    </div>
  );
}
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
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// 🔥 추가
import PostAdminActions from "@/app/components/PostAdminActions";

// external registry
import { markdownComponents } from "@/lib/markdownComponents";

export default function PostPage() {
  const params = useParams();
  const id = params?.id as string;

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
    <div style={{ padding: 40 }}>
      {/* 🔥 헤더 + 우측 버튼 */}
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

        {/* 🔥 여기 핵심 */}
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

            if (inline) {
              return (
                <code
                  style={{
                    background: "#eee",
                    padding: "2px 6px",
                    borderRadius: 4,
                  }}
                >
                  {children}
                </code>
              );
            }

            return (
              <SyntaxHighlighter
                style={oneDark}
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
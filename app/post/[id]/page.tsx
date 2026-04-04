"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// ✅ Torus (이름 통일)
import TorusWithNormals from "../../visualizations/TorusWithNormals";

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

      console.log("post:", post);
      console.log("error:", error);

      if (!error) {
        setData(post);
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (!data) return <div style={{ padding: 40 }}>Post not found</div>;

  return (
    <div style={{ padding: 40 }}>
      {/* 제목 */}
      <h1 style={{ fontSize: 32 }}>{data.title}</h1>

      {/* Markdown */}
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
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

      {/* 🔥 Torus 영역 */}
      <div
        style={{
          width: 600,
          height: 400,
          marginTop: 40,
          border: "1px solid #ccc",
        }}
      >
        <TorusWithNormals />
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

export default function LatestPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Failed to fetch latest posts:", error);
        setLoading(false);
        return;
      }

      setPosts(data as Post[]);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (posts.length === 0) return <div>아직 작성된 글이 없습니다.</div>;

  return (
    <div style={{ marginTop: 60 }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>최신 글</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {posts.map((post) => (
          <div key={post.id} style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16 }}>
            <Link href={`/post/${post.id}`}>
              <h3 style={{ cursor: "pointer", color: "#1e40af" }}>{post.title}</h3>
            </Link>
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {post.content.slice(0, 150) + (post.content.length > 150 ? "..." : "")}
            </ReactMarkdown>
            <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
              카테고리: {post.category} | {new Date(post.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
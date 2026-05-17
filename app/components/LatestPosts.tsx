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
        console.error(error);
        setLoading(false);
        return;
      }

      setPosts(data as Post[]);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (posts.length === 0) return <div>There are No Posts yet.</div>;

  return (
    <div style={{ marginTop: 60 }}>
      <h2
        style={{
          fontSize: 28,
          marginBottom: 20,
          color: "#d4af37",
          letterSpacing: "1px",
          fontWeight: 600,
          textShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
      >
        Recent Archives
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                position: "relative",

                padding: "22px",

                borderRadius: "10px",

                // 📜 종이 느낌
                background:
                  "linear-gradient(145deg, rgba(248,244,230,0.92), rgba(235,225,205,0.88))",

                border: "1px solid rgba(120,100,60,0.28)",

                boxShadow: `
                  0 6px 20px rgba(0,0,0,0.22),
                  inset 0 1px 0 rgba(255,255,255,0.45)
                `,

                backdropFilter: "blur(2px)",

                transition: "all 0.25s ease",

                cursor: "pointer",

                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-3px) scale(1.01)";
                e.currentTarget.style.boxShadow = `
                  0 10px 28px rgba(0,0,0,0.28),
                  inset 0 1px 0 rgba(255,255,255,0.55)
                `;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0px) scale(1)";
                e.currentTarget.style.boxShadow = `
                  0 6px 20px rgba(0,0,0,0.22),
                  inset 0 1px 0 rgba(255,255,255,0.45)
                `;
              }}
            >
              {/* 오래된 종이 질감 */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.08,
                  pointerEvents: "none",
                  backgroundImage: `
                    radial-gradient(#000 0.5px, transparent 0.5px)
                  `,
                  backgroundSize: "8px 8px",
                }}
              />

              <h3
                style={{
                  color: "#111111",
                  marginBottom: 14,
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  lineHeight: 1.3,

                  // 살짝 럭셔리 archive 느낌
                  fontFamily:
                    "'Times New Roman', 'Georgia', serif",
                }}
              >
                {post.title}
              </h3>

              <div
                style={{
                  color: "#2b2b2b",
                  lineHeight: 1.75,
                  fontSize: 15,

                  fontFamily:
                    "'Georgia', 'Times New Roman', serif",
                }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    img({ src, alt, ...props }) {
                      return (
                        <img
                          src={src}
                          alt={alt}
                          style={{
                            maxHeight: 300,
                            width: "auto",
                            maxWidth: "100%",
                            display: "block",
                            margin: "12px 0",
                            borderRadius: 4,
                            border:
                              "1px solid rgba(80,60,30,0.15)",
                          }}
                          {...props}
                        />
                      );
                    },
                  }}
                >
                  {post.content.slice(0, 150) +
                    (post.content.length > 150 ? "..." : "")}
                </ReactMarkdown>
              </div>

              <div
                style={{
                  marginTop: 18,
                  fontSize: 12,
                  color: "#7a5c1f",
                  letterSpacing: "0.6px",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Archive · {post.category} ·{" "}
                {new Date(post.created_at).toLocaleDateString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
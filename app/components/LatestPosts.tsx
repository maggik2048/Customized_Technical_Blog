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

  if (posts.length === 0) {
    return <div>There are No Posts yet.</div>;
  }

  return (
    <div style={{ marginTop: 60 }}>
      <h2
        style={{
          fontSize: 28,
          marginBottom: 20,

          color: "#ffffff",

          letterSpacing: "0.08em",

          fontWeight: 700,

          textShadow:
            "0 2px 6px rgba(0,0,0,0.75), 0 -1px 0 rgba(255,255,255,0.08)",
        }}
      >
        Recent Archives
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            style={{
              textDecoration: "none",
            }}
          >
            <div
              style={{
                position: "relative",

                borderRadius: 8,

                padding: "18px 20px",

                overflow: "hidden",

                cursor: "pointer",

                border: "1px solid rgba(255,255,255,0.12)",

                transition: "all 0.28s ease",

                minHeight: 120,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateX(8px) scale(1.01)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateX(0px) scale(1)";
              }}
            >
              {/* BACKGROUND INVERSION LAYER */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,

                  background:
                    "rgba(165, 170, 185, 0.18)",

                  backdropFilter:
                    "invert(1) brightness(0.88) blur(2px)",

                  WebkitBackdropFilter:
                    "invert(1) brightness(0.88) blur(2px)",
                }}
              />

              {/* NOISE TEXTURE */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,

                  opacity: 0.06,

                  pointerEvents: "none",

                  backgroundImage: `
                    radial-gradient(#ffffff 0.6px, transparent 0.6px)
                  `,

                  backgroundSize: "8px 8px",
                }}
              />

              {/* LEFT SPINE */}
              <div
                style={{
                  position: "absolute",

                  left: 0,
                  top: 0,
                  bottom: 0,

                  width: 2,

                  background:
                    "rgba(220,225,235,0.55)",
                }}
              />

              {/* CONTENT */}
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {/* TITLE */}
                <h3
                  style={{
                    color: "#ffffff",

                    marginBottom: 10,

                    fontSize: 20,

                    fontWeight: 700,

                    letterSpacing: "0.03em",

                    lineHeight: 1.3,

                    textShadow:
                      "0 2px 4px rgba(0,0,0,0.80), 0 -1px 0 rgba(255,255,255,0.10)",

                    fontFamily:
                      "'Times New Roman', 'Georgia', serif",
                  }}
                >
                  {post.title}
                </h3>

                {/* PREVIEW */}
                <div
                  style={{
                    color: "rgba(255,255,255,0.78)",

                    lineHeight: 1.7,

                    fontSize: 14,

                    overflow: "hidden",

                    textShadow:
                      "0 1px 3px rgba(0,0,0,0.70)",

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
                              maxHeight: 240,

                              width: "auto",

                              maxWidth: "100%",

                              display: "block",

                              margin: "10px 0",

                              borderRadius: 4,

                              border:
                                "1px solid rgba(255,255,255,0.12)",
                            }}
                            {...props}
                          />
                        );
                      },
                    }}
                  >
                    {post.content.slice(0, 150) +
                      (post.content.length > 150
                        ? "..."
                        : "")}
                  </ReactMarkdown>
                </div>

                {/* META */}
                <div
                  style={{
                    marginTop: 16,

                    fontSize: 11,

                    color: "rgba(255,255,255,0.62)",

                    letterSpacing: "0.08em",

                    textTransform: "uppercase",

                    textShadow:
                      "0 1px 2px rgba(0,0,0,0.60)",

                    fontWeight: 600,
                  }}
                >
                  Archive · {post.category} ·{" "}
                  {new Date(
                    post.created_at
                  ).toLocaleDateString()}
                </div>
              </div>

              {/* EDGE LIGHT */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,

                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.25)",

                  pointerEvents: "none",
                }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
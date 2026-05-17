"use client";

import Link from "next/link";
import PostTitleRenderer from "./PostTitleRenderer";

export default function CategoryPostBoxRenderer({
  posts,
}: {
  posts: any[];
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        maxWidth: 1020,
      }}
    >
      {posts.map((post) => {
        const contentLength = post.content?.length ?? 0;

        const isSimple = contentLength < 3000;

        return (
          <Link key={post.id} href={`/post/${post.id}`}>
            <div
              style={{
                position: "relative",
                height: 46,
                borderRadius: 6,
                padding: "8px 16px",
                cursor: "pointer",
                overflow: "hidden",
                transition: "all 0.28s ease",

                border: isSimple
                  ? "none"
                  : "1px solid rgba(255,255,255,0.12)",

                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(8px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0px)";
              }}
            >
              {/* BACKGROUND (card only) */}
              {!isSimple && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(165, 170, 185, 0.25)",
                    backdropFilter: "invert(1) brightness(0.9)",
                    WebkitBackdropFilter: "invert(1) brightness(0.9)",
                  }}
                />
              )}

              {/* LEFT SPINE (card only) */}
              {!isSimple && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    background: "rgba(220, 225, 235, 0.55)",
                  }}
                />
              )}

              {/* TITLE (always same typography) */}
              <div
                style={{
                  position: "relative",
                  fontSize: 15,
                  color: isSimple
                    ? "rgba(40,40,40,0.85)"
                    : "#ffffff",
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textShadow:
                    "0 2px 3px rgba(0,0,0,0.80), 0 -1px 0 rgba(255,255,255,0.12)",
                  fontWeight: 600,
                }}
              >
                <PostTitleRenderer text={post.title} />
              </div>

              {/* META ( FIX: ALWAYS SHOW DATE) */}
              <div
                style={{
                  position: "relative",
                  fontSize: 10,

                  color: isSimple
                    ? "rgba(60,60,60,0.55)"
                    : "rgba(255,255,255,0.65)",

                  letterSpacing: "0.06em",

                  textShadow:
                    isSimple
                      ? "none"
                      : "0 1px 2px rgba(0,0,0,0.60)",
                }}
              >
                {new Date(post.created_at).toLocaleDateString()}
              </div>

              {/* EDGE LIGHT (card only) */}
              {!isSimple && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.20)",
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
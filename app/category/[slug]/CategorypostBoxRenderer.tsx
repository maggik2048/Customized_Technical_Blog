"use client";

import Link from "next/link";

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
        gap: 10,
        maxWidth: 1020,
      }}
    >
      {posts.map((post) => (
        <Link key={post.id} href={`/post/${post.id}`}>
          <div
            style={{
              position: "relative",
              height: 54,
              borderRadius: 6,
              padding: "10px 18px",
              cursor: "pointer",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.12)",
              transition: "all 0.28s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(8px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateX(0px)";
            }}
          >
            {/* BACKGROUND LAYER (INVERTED FEEL) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(165, 170, 185, 0.25)",
                backdropFilter: "invert(1) brightness(0.9)",
                WebkitBackdropFilter: "invert(1) brightness(0.9)",
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
                background: "rgba(220, 225, 235, 0.55)",
              }}
            />

            {/* TITLE */}
            <div
              style={{
                position: "relative",
                fontSize: 16,
                color: "#ffffff",
                letterSpacing: "0.02em",
                marginBottom: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textShadow:
                  "0 2px 3px rgba(0,0,0,0.80), 0 -1px 0 rgba(255,255,255,0.12)",
                fontWeight: 600,
              }}
            >
              {post.title}
            </div>

            {/* META */}
            <div
              style={{
                position: "relative",
                fontSize: 11,
                color: "rgba(255,255,255,0.65)",
                letterSpacing: "0.06em",
                textShadow: "0 1px 2px rgba(0,0,0,0.60)",
              }}
            >
              {new Date(post.created_at).toLocaleDateString()}
            </div>

            {/* EDGE LIGHT */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.20)",
                pointerEvents: "none",
              }}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
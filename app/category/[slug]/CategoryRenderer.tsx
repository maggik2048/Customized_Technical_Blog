"use client";

import Link from "next/link";

export default function CategoryRenderer({
  posts,
  slug,
}: {
  posts: any[];
  slug: string;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 60,
        position: "relative",
        overflow: "hidden",
        fontFamily: "serif",
        color: "rgba(245,239,228,0.78)",
      }}
    >
      {/* BACKGROUND (same editorial language as sidebar) */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: "url('/images/mathdraw0.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",

          filter: "contrast(1.2) brightness(0.45) saturate(0.7)",

          transform: "scale(1.05)",
          zIndex: -3,
        }}
      />

      {/* DARK EDITORIAL OVERLAY (SidebarBook tone match) */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -2,
          background: `
            linear-gradient(
              180deg,
              rgba(10,10,10,0.35),
              rgba(10,10,10,0.85)
            ),
            radial-gradient(
              circle at 30% 20%,
              rgba(255,220,140,0.05),
              rgba(0,0,0,0.95)
            )
          `,
        }}
      />

      {/* subtle grain layer */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          opacity: 0.05,
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/noise.png')",
        }}
      />

      {/* HEADER (sidebar typography consistency) */}
      <div
        style={{
          marginBottom: 42,
        }}
      >
        <div
          style={{
            fontSize: 14,
            letterSpacing: "0.25em",
            color: "rgba(220,190,120,0.6)",
            marginBottom: 10,
          }}
        >
          ARCHIVE CATEGORY
        </div>

        <h1
          style={{
            fontSize: 44,
            letterSpacing: "0.12em",
            color: "#dbcaa0",
            margin: 0,
            textShadow: "0 0 18px rgba(255,220,140,0.08)",
          }}
        >
          {slug.toUpperCase()}
        </h1>
      </div>

      {/* LIST (BOOK-SPINE STYLE like SidebarBook) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {posts.map((post, i) => (
          <Link key={post.id} href={`/post/${post.id}`}>
            <div
              style={{
                position: "relative",
                height: 78,

                borderRadius: 6,

                padding: "14px 22px",

                cursor: "pointer",

                background: "rgba(20,20,20,0.45)",

                border: "1px solid rgba(220,190,120,0.18)",

                backdropFilter: "blur(6px)",

                transition: "all 0.28s ease",

                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(8px)";
                e.currentTarget.style.borderColor =
                  "rgba(240,210,140,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0px)";
                e.currentTarget.style.borderColor =
                  "rgba(220,190,120,0.18)";
              }}
            >
              {/* LEFT GOLD SPINE LINE (SidebarBook motif) */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  background: "rgba(201,168,97,0.6)",
                }}
              />

              {/* TITLE */}
              <div
                style={{
                  fontSize: 18,
                  color: "#e8ddc2",
                  letterSpacing: "0.02em",
                  marginBottom: 4,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {post.title}
              </div>

              {/* META (blue-gray like before but refined) */}
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(160,180,200,0.75)",
                  letterSpacing: "0.06em",
                }}
              >
                {new Date(post.created_at).toLocaleDateString()}
              </div>

              {/* subtle vignette edge */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.4)",
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
"use client";

import Link from "next/link";

export default function CategoryRenderer({
  posts,
  slug,
}: {
  posts: any[];
  slug: string;
}) {
  const bgImage = "/images/mathdraw3.png";

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 60,
        position: "relative",
        overflow: "hidden",
        fontFamily: "serif",
        color: "rgba(40,40,40,0.78)",
      }}
    >
      {/* BASE BACKGROUND */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url("${bgImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "scale(1.02)",
          zIndex: -6,
        }}
      />

      {/* INVERT LAYER */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url("${bgImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "scale(1.02)",

          filter: `
            invert(1)
            hue-rotate(200deg)
            saturate(1.6)
            contrast(1.15)
            brightness(0.88)
            sepia(0.05)
          `,

          opacity: 0.92,
          zIndex: -5,
          pointerEvents: "none",

          maskImage: `
            linear-gradient(
              to right,
              transparent 0%,
              rgba(0,0,0,0.12) 30%,
              rgba(0,0,0,0.35) 48%,
              rgba(0,0,0,0.70) 68%,
              rgba(0,0,0,0.92) 85%,
              rgba(0,0,0,1) 100%
            )
          `,

          WebkitMaskImage: `
            linear-gradient(
              to right,
              transparent 0%,
              rgba(0,0,0,0.12) 30%,
              rgba(0,0,0,0.35) 48%,
              rgba(0,0,0,0.70) 68%,
              rgba(0,0,0,0.92) 85%,
              rgba(0,0,0,1) 100%
            )
          `,
        }}
      />

      {/*  #50557A LIGHTEN CLAMP LAYER */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -4,
          pointerEvents: "none",

          background: `
            linear-gradient(
              to right,
              rgba(255,255,255,0.02) 0%,
              rgba(220,225,240,0.10) 25%,
              rgba(170,180,210,0.18) 45%,
              rgba(120,130,170,0.30) 70%,
              rgba(107, 110, 135, 0.55) 100%
            )
          `,

          mixBlendMode: "lighten",
        }}
      />

      {/* DEPTH FOCUS */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -3,
          pointerEvents: "none",
          background: `
            radial-gradient(
              circle at 85% 50%,
              rgba(80, 85, 122, 0.35),
              transparent 60%
            )
          `,
          mixBlendMode: "screen",
        }}
      />

      {/* GRAIN */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -2,
          opacity: 0.07,
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/noise.png')",
        }}
      />

      {/* HEADER */}
      <div style={{ marginBottom: 42 }}>
        <div
          style={{
            fontSize: 14,
            letterSpacing: "0.25em",
            color: "rgba(90,90,90,0.7)",
            marginBottom: 10,
          }}
        >
          ARCHIVE CATEGORY
        </div>

        <h1
          style={{
            fontSize: 44,
            letterSpacing: "0.12em",
            color: "rgba(50,50,50,0.85)",
            margin: 0,
            textShadow: "0 0 18px rgba(255,255,255,0.25)",
          }}
        >
          {slug.toUpperCase()}
        </h1>
      </div>

      {/* LIST */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 1020,
        }}
      >
        {posts.map((post) => (
          <Link key={post.id} href={`/post/${post.id}`}>
            <div
              style={{
                position: "relative",
                height: 64,
                borderRadius: 6,
                padding: "12px 18px",
                cursor: "pointer",

                background: "rgba(245,245,245,0.55)",
                border: "1px solid rgba(120,120,120,0.25)",
                backdropFilter: "blur(8px)",

                transition: "all 0.28s ease",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(8px)";
                e.currentTarget.style.borderColor =
                  "rgba(120,120,120,0.45)";
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.65)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0px)";
                e.currentTarget.style.borderColor =
                  "rgba(120,120,120,0.25)";
                e.currentTarget.style.background =
                  "rgba(245,245,245,0.55)";
              }}
            >
              {/* LEFT SPINE */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  background: "rgba(80, 85, 122, 0.65)",
                }}
              />

              {/* TITLE */}
              <div
                style={{
                  fontSize: 17,
                  color: "rgba(40,40,40,0.9)",
                  letterSpacing: "0.02em",
                  marginBottom: 3,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {post.title}
              </div>

              {/* META */}
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(80,80,80,0.7)",
                  letterSpacing: "0.06em",
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
                    "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.08)",
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
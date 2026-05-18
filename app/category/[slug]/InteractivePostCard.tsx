"use client";

import Link from "next/link";
import { useState } from "react";

import PostTitleRenderer from "./PostTitleRenderer";
import CategoryPostBoxIndex from "./CategoryPostBoxIndex";

export default function InteractivePostCard({
  post,
  categoryIndex,
  globalIndex,
  VizComponent,
  vizKey,
}: any) {
  const [active, setActive] = useState(false);

  return (
    <Link
      href={`/post/${post.id}`}
      style={{
        textDecoration: "none",
      }}
    >
      <div
        style={{
          position: "relative",

          width: "100%",
          height: 500,

          overflow: "hidden",

          borderRadius: 20,

          background:
            "linear-gradient(180deg, rgba(10,10,12,0.96), rgba(0,0,0,0.98))",

          border: active
            ? "1px solid rgba(255,255,255,0.20)"
            : "1px solid rgba(255,255,255,0.08)",

          transition:
            "transform 0.45s ease, border 0.35s ease",

          cursor: "pointer",

          transform: active
            ? "translateY(-4px)"
            : "translateY(0px)",
        }}
        onMouseEnter={() => {
          setActive(true);
        }}
        onMouseLeave={() => {
          setActive(false);
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              transform: active
                ? "scale(1)"
                : "scale(0.72)",

              transition:
                "transform 0.6s cubic-bezier(.2,.8,.2,1)",

              pointerEvents: active ? "auto" : "none",
            }}
          >
            <div
              style={{
                width: 1400,
                height: 900,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <VizComponent />
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,

            background: active
              ? `
                linear-gradient(
                  to top,
                  rgba(0,0,0,0.62),
                  rgba(0,0,0,0.08),
                  rgba(0,0,0,0.38)
                )
              `
              : `
                linear-gradient(
                  to top,
                  rgba(0,0,0,0.82),
                  rgba(0,0,0,0.24),
                  rgba(0,0,0,0.48)
                )
              `,

            transition: "all 0.4s ease",

            zIndex: 2,

            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",

            top: 18,
            right: 18,

            zIndex: 10,

            padding: "6px 12px",

            borderRadius: 999,

            fontSize: 11,
            fontWeight: 700,

            letterSpacing: "0.08em",

            background: active
              ? "rgba(255,255,255,0.16)"
              : "rgba(255,255,255,0.08)",

            color: "white",

            backdropFilter: "blur(10px)",

            border:
              "1px solid rgba(255,255,255,0.12)",

            transition: "all 0.3s ease",
          }}
        >
          {active ? "INTERACTIVE LIVE" : vizKey}
        </div>

        <div
          style={{
            position: "absolute",
            top: 18,
            left: 18,
            zIndex: 10,
          }}
        >
          <CategoryPostBoxIndex
            categoryIndex={categoryIndex}
            globalIndex={globalIndex}
            isSimple={false}
          />
        </div>

        <div
          style={{
            position: "absolute",

            left: 30,
            bottom: 30,
            right: 30,

            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: active ? 32 : 28,

              lineHeight: 1.08,

              fontWeight: 800,

              color: "white",

              transition: "all 0.35s ease",

              textShadow:
                "0 6px 18px rgba(0,0,0,0.82)",

              marginBottom: 12,
            }}
          >
            <PostTitleRenderer text={post.title} />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,

              color: "rgba(255,255,255,0.72)",

              fontSize: 12,

              letterSpacing: "0.08em",
            }}
          >
            <span>
              {new Date(
                post.created_at
              ).toLocaleDateString()}
            </span>

            <span>•</span>

            <span>
              Hover to activate interaction
            </span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,

            borderRadius: 20,

            boxShadow: active
              ? `
                inset 0 1px 0 rgba(255,255,255,0.18),
                inset 0 -1px 0 rgba(0,0,0,0.32),
                0 0 40px rgba(255,255,255,0.08)
              `
              : `
                inset 0 1px 0 rgba(255,255,255,0.08),
                inset 0 -1px 0 rgba(0,0,0,0.28)
              `,

            transition: "all 0.35s ease",

            pointerEvents: "none",

            zIndex: 12,
          }}
        />
      </div>
    </Link>
  );
}
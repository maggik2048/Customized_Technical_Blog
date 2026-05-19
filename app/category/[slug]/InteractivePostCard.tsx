"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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

  const CARD_HEIGHT = 320;

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  const [stageSize, setStageSize] = useState({
    width: 1400,
    height: 900,
  });

  const STAGE_OFFSET_X = 20;
  const STAGE_OFFSET_Y = 16;

  useEffect(() => {
    function updateScale() {
      if (!viewportRef.current) return;

      const rect = viewportRef.current.getBoundingClientRect();

      const width = rect.width;
      const height = rect.height;

      setStageSize({ width, height });

      const viewportWidth = width - STAGE_OFFSET_X * 2;
      const viewportHeight = height - STAGE_OFFSET_Y * 2;

      const baseWidth = 1400;
      const baseHeight = 900;

      const sx = viewportWidth / baseWidth;
      const sy = viewportHeight / baseHeight;

      const fitted = Math.min(sx, sy);

      setScale(active ? fitted : fitted * 0.92);
    }

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, [active]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: CARD_HEIGHT,

        display: "flex",
        flexDirection: "row",

        borderRadius: 24,
        overflow: "hidden",

        // 더 투명한 유리 느낌
        background: `
          linear-gradient(
            180deg,
            rgba(255,255,255,0.06),
            rgba(255,255,255,0.02)
          )
        `,

        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",

        border: active
          ? "1px solid rgba(255,255,255,0.16)"
          : "1px solid rgba(255,255,255,0.08)",

        boxShadow: active
          ? `
            0 20px 80px rgba(0,0,0,0.22),
            inset 0 1px 0 rgba(255,255,255,0.12)
          `
          : `
            0 10px 40px rgba(0,0,0,0.16),
            inset 0 1px 0 rgba(255,255,255,0.06)
          `,

        transition: "all 0.45s ease",
        transform: active
          ? "translateY(-6px) scale(1.01)"
          : "translateY(0px) scale(1)",

        // 핵심
        opacity: active ? 1 : 0.88,
      }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {/* subtle glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(
              circle at top left,
              rgba(255,255,255,0.12),
              transparent 40%
            )
          `,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* LEFT */}
      <div
        style={{
          width: "35%",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 20,
        }}
      >
        <div>
          <CategoryPostBoxIndex
            categoryIndex={categoryIndex}
            globalIndex={globalIndex}
            isSimple={false}
          />

          <div
            style={{
              marginTop: 18,
              fontSize: 20,
              fontWeight: 800,
              color: "rgba(255,255,255,0.96)",
              lineHeight: 1.12,
              textShadow: "0 2px 12px rgba(0,0,0,0.25)",
            }}
          >
            <PostTitleRenderer text={post.title} />
          </div>
        </div>

        <div
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.58)",
            letterSpacing: "0.08em",
          }}
        >
          {new Date(post.created_at).toLocaleDateString()}
        </div>
      </div>

      {/* RIGHT TV SCREEN */}
      <div
        ref={viewportRef}
        style={{
          width: "65%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* stage */}
        <div
          style={{
            position: "absolute",
            left: STAGE_OFFSET_X,
            top: STAGE_OFFSET_Y,

            width: stageSize.width,
            height: stageSize.height,

            transform: `scale(${scale})`,
            transformOrigin: "top left",

            transition:
              "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",

            pointerEvents: active ? "auto" : "none",

            opacity: active ? 1 : 0.82,
          }}
        >
          <VizComponent />
        </div>

        {/* overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,

            background: active
              ? `
                linear-gradient(
                  to bottom,
                  rgba(255,255,255,0.02),
                  rgba(0,0,0,0.28)
                )
              `
              : `
                linear-gradient(
                  to bottom,
                  rgba(255,255,255,0.03),
                  rgba(0,0,0,0.42)
                )
              `,

            pointerEvents: "none",
          }}
        />

        {/* glass fade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
              linear-gradient(
                135deg,
                rgba(255,255,255,0.08),
                transparent 30%,
                transparent 70%,
                rgba(255,255,255,0.04)
              )
            `,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />

        {/* badge */}
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,

            padding: "6px 12px",
            borderRadius: 999,

            fontSize: 11,
            color: "white",

            background: "rgba(255,255,255,0.08)",

            border: "1px solid rgba(255,255,255,0.10)",

            backdropFilter: "blur(12px)",

            zIndex: 50,
          }}
        >
          {active ? "LIVE" : vizKey}
        </div>

        {/* link */}
        {!active && (
          <Link
            href={`/post/${post.id}`}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 60,
            }}
          />
        )}
      </div>
    </div>
  );
}
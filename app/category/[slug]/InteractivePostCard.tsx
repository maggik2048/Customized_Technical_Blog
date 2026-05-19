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

        // base glass
        background: `
          linear-gradient(
            180deg,
            rgba(255,255,255,0.05),
            rgba(255,255,255,0.02)
          )
        `,

        // 핵심:
        // 평소에는 blur 거의 없음
        // hover 시 확 blur
        backdropFilter: active
          ? "blur(22px) saturate(140%)"
          : "blur(0px) saturate(100%)",

        WebkitBackdropFilter: active
          ? "blur(22px) saturate(140%)"
          : "blur(0px) saturate(100%)",

        border: active
          ? "1px solid rgba(255,255,255,0.16)"
          : "1px solid rgba(255,255,255,0.08)",

        boxShadow: active
          ? `
            0 24px 90px rgba(0,0,0,0.28),
            inset 0 1px 0 rgba(255,255,255,0.12)
          `
          : `
            0 10px 40px rgba(0,0,0,0.16),
            inset 0 1px 0 rgba(255,255,255,0.04)
          `,

        transition:
          "backdrop-filter 0.55s ease, transform 0.45s ease, box-shadow 0.45s ease, border 0.45s ease, opacity 0.45s ease",

        transform: active
          ? "translateY(-6px) scale(1.01)"
          : "translateY(0px) scale(1)",

        opacity: active ? 1 : 0.9,
      }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {/* glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,

          background: `
            radial-gradient(
              circle at top left,
              rgba(255,255,255,0.10),
              transparent 42%
            )
          `,

          opacity: active ? 1 : 0.5,

          transition: "opacity 0.5s ease",

          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* LEFT DESCRIPTION */}
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

              textShadow:
                "0 2px 14px rgba(0,0,0,0.28)",
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

      {/* RIGHT INTERACTION SCREEN */}
      <div
        ref={viewportRef}
        style={{
          width: "65%",
          position: "relative",
          overflow: "hidden",

          // 핵심:
          // 평소엔 좀 더 어둡게
          background: active
            ? "rgba(0,0,0,0.18)"
            : "rgba(0,0,0,0.36)",

          transition: "background 0.45s ease",
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
              "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease",

            pointerEvents: active ? "auto" : "none",

            // 평소엔 살짝 죽여놓음
            opacity: active ? 1 : 0.72,

            filter: active
              ? "brightness(1)"
              : "brightness(0.72)",
          }}
        >
          <VizComponent />
        </div>

        {/* dark cinematic overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,

            background: active
              ? `
                linear-gradient(
                  to bottom,
                  rgba(0,0,0,0.12),
                  rgba(0,0,0,0.34)
                )
              `
              : `
                linear-gradient(
                  to bottom,
                  rgba(0,0,0,0.22),
                  rgba(0,0,0,0.56)
                )
              `,

            transition: "background 0.45s ease",

            pointerEvents: "none",
          }}
        />

        {/* glass reflection */}
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

            opacity: active ? 1 : 0.7,

            transition: "opacity 0.45s ease",

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

            background: active
              ? "rgba(255,255,255,0.12)"
              : "rgba(255,255,255,0.06)",

            border:
              "1px solid rgba(255,255,255,0.10)",

            backdropFilter: active
              ? "blur(14px)"
              : "blur(0px)",

            transition: "all 0.4s ease",

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
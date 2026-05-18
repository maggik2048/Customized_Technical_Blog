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

  // 🔥 TV 느낌: 세로 줄이고 가로 강조
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

      // 🔥 핵심 변경: TV / 와이드 느낌 (가로 기준)
      const fitted = sx;

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

        borderRadius: 22,
        overflow: "hidden",

        background: `
          linear-gradient(
            180deg,
            rgba(18,18,22,0.78),
            rgba(8,8,10,0.82)
          )
        `,

        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",

        border: active
          ? "1px solid rgba(255,255,255,0.18)"
          : "1px solid rgba(255,255,255,0.08)",

        boxShadow: active
          ? "0 18px 60px rgba(0,0,0,0.30)"
          : "0 10px 32px rgba(0,0,0,0.20)",

        transition: "all 0.35s ease",
        transform: active ? "translateY(-4px)" : "translateY(0px)",
      }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {/* ================= LEFT ================= */}
      <div
        style={{
          width: "35%",
          padding: 18,
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
              marginTop: 16,
              fontSize: 20,
              fontWeight: 800,
              color: "white",
              lineHeight: 1.1,
            }}
          >
            <PostTitleRenderer text={post.title} />
          </div>
        </div>

        <div
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.08em",
          }}
        >
          {new Date(post.created_at).toLocaleDateString()}
        </div>
      </div>

      {/* ================= RIGHT (TV SCREEN) ================= */}
      <div
        ref={viewportRef}
        style={{
          width: "65%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* STAGE */}
        <div
          style={{
            position: "absolute",
            left: STAGE_OFFSET_X,
            top: STAGE_OFFSET_Y,

            width: stageSize.width,
            height: stageSize.height,

            transform: `scale(${scale})`,
            transformOrigin: "top left",
            transition: "transform 0.6s ease",

            pointerEvents: active ? "auto" : "none",
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
              ? "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))"
              : "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))",
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
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.1)",
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
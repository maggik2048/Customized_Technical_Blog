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

  /*
    card sizing
  */

  const CARD_HEIGHT = 500;

  /*
    bottom metadata/title area
  */

  const CONTENT_RESERVED_HEIGHT = 140;

  /*
    interaction virtual stage
  */

  const STAGE_WIDTH = 1400;
  const STAGE_HEIGHT = 900;

  /*
    핵심:
    top-left anchor 유지하되
    너무 구석에 붙지 않도록 padding offset 추가

    interaction 내부 toolbar / math UI visibility 유지
    +
    viewport composition을 좀 더 cinematic하게 중앙쪽으로 이동
  */

  const STAGE_OFFSET_X = 36;
  const STAGE_OFFSET_Y = 28;

  const viewportRef =
    useRef<HTMLDivElement | null>(null);

  const [scale, setScale] = useState(1);

  useEffect(() => {
    function updateScale() {
      if (!viewportRef.current) return;

      const rect =
        viewportRef.current.getBoundingClientRect();

      /*
        offset 제외한 실 viewport 기준 계산
      */

      const viewportWidth =
        rect.width - STAGE_OFFSET_X * 2;

      const viewportHeight =
        rect.height - STAGE_OFFSET_Y * 2;

      const sx =
        viewportWidth / STAGE_WIDTH;

      const sy =
        viewportHeight / STAGE_HEIGHT;

      /*
        cover-fit 유지
      */

      const fitted = Math.max(sx, sy);

      setScale(active ? fitted : fitted * 0.94);
    }

    updateScale();

    window.addEventListener(
      "resize",
      updateScale
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateScale
      );
    };
  }, [active]);

  return (
    <div
      style={{
        position: "relative",

        width: "100%",
        height: CARD_HEIGHT,

        overflow: "hidden",

        borderRadius: 22,

        /*
          완전 black 제거
          translucent glass-like base
        */

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
          ? `
            0 18px 60px rgba(0,0,0,0.30),
            inset 0 1px 0 rgba(255,255,255,0.08)
          `
          : `
            0 10px 32px rgba(0,0,0,0.20),
            inset 0 1px 0 rgba(255,255,255,0.04)
          `,

        transition:
          "transform 0.45s ease, border 0.35s ease, box-shadow 0.35s ease",

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
      {/* ============================================
          inactive navigation
      ============================================ */}

      {!active && (
        <Link
          href={`/post/${post.id}`}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 70,
          }}
        />
      )}

      {/* ============================================
          INTERACTION VIEWPORT
      ============================================ */}

      <div
        ref={viewportRef}
        style={{
          position: "absolute",

          top: 0,
          left: 0,
          right: 0,
          bottom: CONTENT_RESERVED_HEIGHT,

          overflow: "hidden",

          zIndex: 1,
        }}
      >
        {/* 
          핵심:

          top-left anchor 유지
          +
          offset padding 적용

          => interaction UI 안 잘리고
             너무 corner에 붙지도 않음
        */}

        <div
          style={{
            position: "absolute",

            left: STAGE_OFFSET_X,
            top: STAGE_OFFSET_Y,

            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,

            transform: `scale(${scale})`,

            transformOrigin: "top left",

            transition:
              "transform 0.7s cubic-bezier(.2,.8,.2,1)",

            pointerEvents: active
              ? "auto"
              : "none",

            willChange: "transform",
          }}
        >
          <VizComponent />
        </div>
      </div>

      {/* ============================================
          ATMOSPHERIC OVERLAY
      ============================================ */}

      <div
        style={{
          position: "absolute",
          inset: 0,

          /*
            완전 opaque 제거
          */

          background: active
            ? `
              linear-gradient(
                to bottom,
                rgba(0,0,0,0.18),
                rgba(0,0,0,0.02) 18%,
                rgba(0,0,0,0.08) 52%,
                rgba(0,0,0,0.58)
              )
            `
            : `
              linear-gradient(
                to bottom,
                rgba(0,0,0,0.30),
                rgba(0,0,0,0.08) 24%,
                rgba(0,0,0,0.16) 55%,
                rgba(0,0,0,0.70)
              )
            `,

          transition: "all 0.45s ease",

          zIndex: 10,

          pointerEvents: "none",
        }}
      />

      {/* ============================================
          subtle noise/light layer
      ============================================ */}

      <div
        style={{
          position: "absolute",
          inset: 0,

          background: `
            radial-gradient(
              circle at top left,
              rgba(255,255,255,0.05),
              transparent 42%
            )
          `,

          zIndex: 11,

          pointerEvents: "none",
        }}
      />

      {/* ============================================
          BADGE
      ============================================ */}

      <div
        style={{
          position: "absolute",

          top: 18,
          right: 18,

          zIndex: 40,

          padding: "7px 14px",

          borderRadius: 999,

          fontSize: 11,
          fontWeight: 700,

          letterSpacing: "0.08em",

          background: active
            ? "rgba(255,255,255,0.14)"
            : "rgba(255,255,255,0.07)",

          color: "white",

          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",

          border:
            "1px solid rgba(255,255,255,0.10)",

          transition: "all 0.3s ease",
        }}
      >
        {active ? "INTERACTIVE LIVE" : vizKey}
      </div>

      {/* ============================================
          INDEX
      ============================================ */}

      <div
        style={{
          position: "absolute",

          top: 18,
          left: 18,

          zIndex: 40,
        }}
      >
        <CategoryPostBoxIndex
          categoryIndex={categoryIndex}
          globalIndex={globalIndex}
          isSimple={false}
        />
      </div>

      {/* ============================================
          CONTENT
      ============================================ */}

      <div
        style={{
          position: "absolute",

          left: 34,
          right: 34,
          bottom: 28,

          zIndex: 40,
        }}
      >
        <div
          style={{
            fontSize: active ? 34 : 30,

            lineHeight: 1.04,

            fontWeight: 800,

            color: "white",

            transition:
              "font-size 0.35s ease, transform 0.35s ease",

            textShadow:
              "0 8px 24px rgba(0,0,0,0.72)",

            marginBottom: 14,
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

      {/* ============================================
          EDGE LIGHT
      ============================================ */}

      <div
        style={{
          position: "absolute",

          inset: 0,

          borderRadius: 22,

          boxShadow: active
            ? `
              inset 0 1px 0 rgba(255,255,255,0.14),
              inset 0 -1px 0 rgba(0,0,0,0.18),
              0 0 42px rgba(255,255,255,0.04)
            `
            : `
              inset 0 1px 0 rgba(255,255,255,0.06),
              inset 0 -1px 0 rgba(0,0,0,0.18)
            `,

          transition: "all 0.35s ease",

          pointerEvents: "none",

          zIndex: 60,
        }}
      />
    </div>
  );
}
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
    card size
  */

  const CARD_HEIGHT = 500;

  /*
    bottom content reservation
  */

  const CONTENT_RESERVED_HEIGHT = 140;

  /*
    virtual interaction stage
  */

  const STAGE_WIDTH = 1400;
  const STAGE_HEIGHT = 900;

  /*
    중요:

    interaction component들 대부분은
    좌상단 기준 absolute UI를 가짐

    그래서 이전 center-cover 방식은
    좌상단 control UI가 잘려버림

    지금은:
    LEFT-TOP ANCHORED COVER 전략 사용

    => scale은 유지하되
       origin을 left-top으로 고정
       interaction toolbar/math ui가 항상 보임
  */

  const viewportRef =
    useRef<HTMLDivElement | null>(null);

  const [scale, setScale] = useState(1);

  useEffect(() => {
    function updateScale() {
      if (!viewportRef.current) return;

      const rect =
        viewportRef.current.getBoundingClientRect();

      const viewportWidth = rect.width;

      const viewportHeight =
        rect.height;

      /*
        cover-fit
      */

      const sx =
        viewportWidth / STAGE_WIDTH;

      const sy =
        viewportHeight / STAGE_HEIGHT;

      const fitted = Math.max(sx, sy);

      /*
        inactive:
        살짝 zoom-out

        active:
        immersive
      */

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

        background:
          "linear-gradient(180deg, rgba(10,10,12,0.98), rgba(0,0,0,1))",

        border: active
          ? "1px solid rgba(255,255,255,0.20)"
          : "1px solid rgba(255,255,255,0.08)",

        transition:
          "transform 0.45s ease, border 0.35s ease",

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
          핵심 수정:

          center 정렬 제거

          left-top anchor 사용

          => interaction 내부 toolbar,
             math panel,
             control ui 보존
        */}

        <div
          style={{
            position: "absolute",

            left: 0,
            top: 0,

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

          background: active
            ? `
              linear-gradient(
                to bottom,
                rgba(0,0,0,0.28),
                rgba(0,0,0,0.04) 18%,
                rgba(0,0,0,0.12) 52%,
                rgba(0,0,0,0.88)
              )
            `
            : `
              linear-gradient(
                to bottom,
                rgba(0,0,0,0.48),
                rgba(0,0,0,0.14) 24%,
                rgba(0,0,0,0.24) 55%,
                rgba(0,0,0,0.94)
              )
            `,

          transition: "all 0.45s ease",

          zIndex: 10,

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
            ? "rgba(255,255,255,0.16)"
            : "rgba(255,255,255,0.08)",

          color: "white",

          backdropFilter: "blur(12px)",

          border:
            "1px solid rgba(255,255,255,0.12)",

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
              "0 8px 24px rgba(0,0,0,0.85)",

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

            color: "rgba(255,255,255,0.74)",

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
              inset 0 1px 0 rgba(255,255,255,0.16),
              inset 0 -1px 0 rgba(0,0,0,0.28),
              0 0 42px rgba(255,255,255,0.06)
            `
            : `
              inset 0 1px 0 rgba(255,255,255,0.08),
              inset 0 -1px 0 rgba(0,0,0,0.24)
            `,

          transition: "all 0.35s ease",

          pointerEvents: "none",

          zIndex: 60,
        }}
      />
    </div>
  );
}
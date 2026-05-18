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
    핵심:
    실제 interaction component 내부의
    nested UI / math renderer / absolute layer 들까지
    정상 렌더되도록 isolate 제거 + scale viewport만 적용
  */

  const stageRef = useRef<HTMLDivElement | null>(null);

  const [scale, setScale] = useState(0.72);

  /*
    interaction 내부 전체 UI를
    preview viewport에 "cover-fit" 시키기 위한 dynamic scaling
  */

  useEffect(() => {
    function updateScale() {
      if (!stageRef.current) return;

      const parent =
        stageRef.current.parentElement;

      if (!parent) return;

      const pw = parent.clientWidth;
      const ph = parent.clientHeight;

      /*
        interaction 원본 virtual stage
      */

      const virtualWidth = 1400;
      const virtualHeight = 900;

      /*
        contain-fit 계산
      */

      const sx = pw / virtualWidth;
      const sy = ph / virtualHeight;

      /*
        preview에서는 살짝 zoom-out
        active에서는 full interaction scale
      */

      const fitted = Math.min(sx, sy);

      setScale(active ? fitted : fitted * 0.82);
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

        cursor: active ? "default" : "pointer",

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
      {/* ====================================================
          LINK OVERLAY
          inactive 상태에서만 클릭
      ==================================================== */}

      {!active && (
        <Link
          href={`/post/${post.id}`}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 40,
          }}
        />
      )}

      {/* ====================================================
          INTERACTION VIEWPORT
      ==================================================== */}

      <div
        style={{
          position: "absolute",
          inset: 0,

          overflow: "hidden",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 
          중요:
          transform scale만 적용하고
          isolate / contain / clipping 안함

          => 내부 nested math renderer,
             absolute overlay,
             portals 느낌 UI 다 살림
        */}

        <div
          ref={stageRef}
          style={{
            width: 1400,
            height: 900,

            position: "relative",

            transform: `scale(${scale})`,

            transformOrigin: "center center",

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

      {/* ====================================================
          OVERLAY
      ==================================================== */}

      <div
        style={{
          position: "absolute",
          inset: 0,

          background: active
            ? `
              linear-gradient(
                to top,
                rgba(0,0,0,0.58),
                rgba(0,0,0,0.04),
                rgba(0,0,0,0.30)
              )
            `
            : `
              linear-gradient(
                to top,
                rgba(0,0,0,0.84),
                rgba(0,0,0,0.18),
                rgba(0,0,0,0.44)
              )
            `,

          transition: "all 0.4s ease",

          zIndex: 4,

          pointerEvents: "none",
        }}
      />

      {/* ====================================================
          TOP RIGHT BADGE
      ==================================================== */}

      <div
        style={{
          position: "absolute",

          top: 18,
          right: 18,

          zIndex: 20,

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

      {/* ====================================================
          INDEX
      ==================================================== */}

      <div
        style={{
          position: "absolute",
          top: 18,
          left: 18,
          zIndex: 20,
        }}
      >
        <CategoryPostBoxIndex
          categoryIndex={categoryIndex}
          globalIndex={globalIndex}
          isSimple={false}
        />
      </div>

      {/* ====================================================
          CONTENT
      ==================================================== */}

      <div
        style={{
          position: "absolute",

          left: 30,
          bottom: 30,
          right: 30,

          zIndex: 20,
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

      {/* ====================================================
          EDGE LIGHT
      ==================================================== */}

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

          zIndex: 30,
        }}
      />
    </div>
  );
}
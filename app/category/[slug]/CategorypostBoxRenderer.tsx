"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";

import PostTitleRenderer from "./PostTitleRenderer";
import CategoryPostBoxIndex from "./CategoryPostBoxIndex";

/* =========================================================
   VISUALIZATION REGISTRY
========================================================= */

const SatProjection = dynamic(
  () => import("@/app/visualizations/SatProjection"),
  { ssr: false }
);

const Torus = dynamic(
  () => import("@/app/visualizations/TorusWithNormals"),
  { ssr: false }
);

const ModelSlot = dynamic(
  () => import("@/app/visualizations/ModelSlot"),
  { ssr: false }
);

const DrawingOverlay = dynamic(
  () =>
    import(
      "@/app/visualizations/DrawingNotation/DrawingOverlay"
    ),
  { ssr: false }
);

const Lidar = dynamic(
  () =>
    import(
      "@/app/visualizations/SphericalToCartesianCoordinates"
    ),
  { ssr: false }
);

const visualizationRegistry: Record<string, any> = {
  SAT: SatProjection,
  TORUS: Torus,
  MODEL: ModelSlot,

  ANNOTATE: (props: any) => (
    <DrawingOverlay
      width={800}
      height={500}
      {...props}
    />
  ),

  LIDAR: Lidar,
};

/* =========================================================
   TOKEN PARSER
========================================================= */

function extractVisualization(content?: string) {
  if (!content) return null;

  const match = content.match(
    /\[(SAT|TORUS|MODEL|ANNOTATE|LIDAR)\]/
  );

  return match?.[1] ?? null;
}

/* =========================================================
   INTERACTIVE PREVIEW CARD
========================================================= */

function InteractivePostCard({
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

          border:
            active
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
        {/* =================================================
            VISUALIZATION CONTAINER
        ================================================= */}

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
          {/* 
             핵심:
             scale down 해서 "cover" 느낌으로 맞춤
             overflow hidden 내부에서 전체 scene 유지
          */}

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

        {/* =================================================
            GLASS OVERLAY
        ================================================= */}

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

        {/* =================================================
            ACTIVE BADGE
        ================================================= */}

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

        {/* =================================================
            INDEX
        ================================================= */}

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

        {/* =================================================
            CONTENT
        ================================================= */}

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

        {/* =================================================
            EDGE LIGHT
        ================================================= */}

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

/* =========================================================
   MAIN RENDERER
========================================================= */

export default function CategoryPostBoxRenderer({
  posts,
  allPosts,
}: {
  posts: any[];
  allPosts?: any[];
}) {
  const safeAllPosts = Array.isArray(allPosts)
    ? allPosts
    : [];

  const globalIndexMap = new Map(
    safeAllPosts
      .slice()
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      )
      .map((post, i) => [post.id, i + 1])
  );

  /*
    visualization posts first
  */

  const sortedPosts = [...posts].sort((a, b) => {
    const aHasViz = !!extractVisualization(a.content);
    const bHasViz = !!extractVisualization(b.content);

    if (aHasViz && !bHasViz) return -1;
    if (!aHasViz && bHasViz) return 1;

    return (
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
    );
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",

        gap: 16,

        maxWidth: 1020,
      }}
    >
      {sortedPosts.map((post, index) => {
        const contentLength =
          post.content?.length ?? 0;

        const vizKey = extractVisualization(
          post.content
        );

        const VizComponent = vizKey
          ? visualizationRegistry[vizKey]
          : null;

        const isInteractive = !!VizComponent;

        const isSimple =
          !isInteractive && contentLength < 3000;

        const categoryIndex = index + 1;

        const globalIndex =
          globalIndexMap.get(post.id) ??
          categoryIndex;

        /*
          INTERACTIVE
        */

        if (isInteractive) {
          return (
            <InteractivePostCard
              key={post.id}
              post={post}
              categoryIndex={categoryIndex}
              globalIndex={globalIndex}
              VizComponent={VizComponent}
              vizKey={vizKey}
            />
          );
        }

        /*
          REGULAR POSTS
        */

        return (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
          >
            <div
              style={{
                position: "relative",

                height: 46,

                borderRadius: 6,

                padding: "8px 16px 8px 52px",

                cursor: "pointer",

                overflow: "hidden",

                transition: "all 0.28s ease",

                border: isSimple
                  ? "none"
                  : "1px solid rgba(255,255,255,0.12)",

                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateX(8px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateX(0px)";
              }}
            >
              <CategoryPostBoxIndex
                categoryIndex={categoryIndex}
                globalIndex={globalIndex}
                isSimple={isSimple}
              />

              {!isSimple && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,

                    background:
                      "rgba(165,170,185,0.25)",

                    backdropFilter:
                      "invert(1) brightness(0.9)",

                    WebkitBackdropFilter:
                      "invert(1) brightness(0.9)",

                    zIndex: 0,
                  }}
                />
              )}

              {!isSimple && (
                <div
                  style={{
                    position: "absolute",

                    left: 0,
                    top: 0,
                    bottom: 0,

                    width: 2,

                    background:
                      "rgba(220,225,235,0.55)",

                    zIndex: 0,
                  }}
                />
              )}

              <div
                style={{
                  position: "relative",
                  zIndex: 5,

                  fontSize: 15,

                  color: isSimple
                    ? "rgba(40,40,40,0.85)"
                    : "#ffffff",

                  letterSpacing: "0.02em",

                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",

                  textShadow:
                    "0 2px 3px rgba(0,0,0,0.80)",

                  fontWeight: 600,
                }}
              >
                <PostTitleRenderer text={post.title} />
              </div>

              <div
                style={{
                  position: "relative",
                  zIndex: 5,

                  fontSize: 10,

                  color: isSimple
                    ? "rgba(60,60,60,0.55)"
                    : "rgba(255,255,255,0.65)",

                  letterSpacing: "0.06em",
                }}
              >
                {new Date(
                  post.created_at
                ).toLocaleDateString()}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
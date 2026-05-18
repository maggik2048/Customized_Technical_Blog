"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import PostTitleRenderer from "./PostTitleRenderer";
import CategoryPostBoxIndex from "./CategoryPostBoxIndex";

const visualizationRegistry: Record<string, any> = {
  SAT: dynamic(() => import("@/app/visualizations/SatProjection"), {
    ssr: false,
  }),

  TORUS: dynamic(
    () => import("@/app/visualizations/TorusWithNormals"),
    {
      ssr: false,
    }
  ),

  MODEL: dynamic(() => import("@/app/visualizations/ModelSlot"), {
    ssr: false,
  }),

  ANNOTATE: dynamic(
    () =>
      import(
        "@/app/visualizations/DrawingNotation/DrawingOverlay"
      ),
    {
      ssr: false,
    }
  ),

  LIDAR: dynamic(
    () =>
      import(
        "@/app/visualizations/SphericalToCartesianCoordinates"
      ),
    {
      ssr: false,
    }
  ),
};

function extractVisualization(content?: string) {
  if (!content) return null;

  const match = content.match(/\[(SAT|TORUS|MODEL|ANNOTATE|LIDAR)\]/);

  return match?.[1] ?? null;
}

export default function CategoryPostBoxRenderer({
  posts,
  allPosts,
}: {
  posts: any[];
  allPosts?: any[];
}) {
  const safeAllPosts = Array.isArray(allPosts) ? allPosts : [];

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
    인터랙션 포스트 우선 정렬
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
        const contentLength = post.content?.length ?? 0;

        const vizKey = extractVisualization(post.content);

        const VizComponent = vizKey
          ? visualizationRegistry[vizKey]
          : null;

        const isInteractive = !!VizComponent;

        const isSimple =
          !isInteractive && contentLength < 3000;

        const categoryIndex = index + 1;

        const globalIndex =
          globalIndexMap.get(post.id) ?? categoryIndex;

        /*
          인터랙션 포스트
        */
        if (isInteractive) {
          return (
            <Link
              key={post.id}
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

                  borderRadius: 18,

                  background:
                    "linear-gradient(180deg, rgba(20,20,25,0.92), rgba(8,8,10,0.98))",

                  border:
                    "1px solid rgba(255,255,255,0.08)",

                  cursor: "pointer",

                  transition:
                    "transform 0.35s ease, border 0.35s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-4px) scale(1.01)";

                  e.currentTarget.style.border =
                    "1px solid rgba(255,255,255,0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0px) scale(1)";

                  e.currentTarget.style.border =
                    "1px solid rgba(255,255,255,0.08)";
                }}
              >
                {/* VISUALIZATION */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,

                    opacity: 0.95,
                  }}
                >
                  <VizComponent />
                </div>

                {/* DARK OVERLAY */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,

                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0.15), rgba(0,0,0,0.45))",

                    zIndex: 2,
                  }}
                />

                {/* TOP META */}
                <div
                  style={{
                    position: "absolute",
                    top: 18,
                    left: 18,

                    zIndex: 5,
                  }}
                >
                  <CategoryPostBoxIndex
                    categoryIndex={categoryIndex}
                    globalIndex={globalIndex}
                    isSimple={false}
                  />
                </div>

                {/* TITLE */}
                <div
                  style={{
                    position: "absolute",

                    left: 28,
                    bottom: 28,

                    right: 28,

                    zIndex: 5,
                  }}
                >
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 800,

                      color: "#fff",

                      lineHeight: 1.15,

                      marginBottom: 10,

                      textShadow:
                        "0 4px 12px rgba(0,0,0,0.75)",
                    }}
                  >
                    <PostTitleRenderer text={post.title} />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,

                      fontSize: 12,

                      color: "rgba(255,255,255,0.72)",

                      letterSpacing: "0.08em",
                    }}
                  >
                    <span>{vizKey}</span>

                    <span>
                      {new Date(
                        post.created_at
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        }

        /*
          일반 포스트
        */
        return (
          <Link key={post.id} href={`/post/${post.id}`}>
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
              {/* INDEX */}
              <CategoryPostBoxIndex
                categoryIndex={categoryIndex}
                globalIndex={globalIndex}
                isSimple={isSimple}
              />

              {/* BACKGROUND */}
              {!isSimple && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "rgba(165, 170, 185, 0.25)",

                    backdropFilter:
                      "invert(1) brightness(0.9)",

                    WebkitBackdropFilter:
                      "invert(1) brightness(0.9)",

                    zIndex: 0,
                  }}
                />
              )}

              {/* LEFT SPINE */}
              {!isSimple && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    background:
                      "rgba(220, 225, 235, 0.55)",
                    zIndex: 0,
                  }}
                />
              )}

              {/* TITLE */}
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
                    "0 2px 3px rgba(0,0,0,0.80), 0 -1px 0 rgba(255,255,255,0.12)",

                  fontWeight: 600,
                }}
              >
                <PostTitleRenderer text={post.title} />
              </div>

              {/* META */}
              <div
                style={{
                  position: "relative",
                  zIndex: 5,

                  fontSize: 10,

                  color: isSimple
                    ? "rgba(60,60,60,0.55)"
                    : "rgba(255,255,255,0.65)",

                  letterSpacing: "0.06em",

                  textShadow: isSimple
                    ? "none"
                    : "0 1px 2px rgba(0,0,0,0.60)",
                }}
              >
                {new Date(
                  post.created_at
                ).toLocaleDateString()}
              </div>

              {/* EDGE LIGHT */}
              {!isSimple && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,

                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.20)",

                    pointerEvents: "none",

                    zIndex: 1,
                  }}
                />
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

import PostTitleRenderer from "./PostTitleRenderer";
import CategoryPostBoxIndex from "./CategoryPostBoxIndex";
import InteractivePostCard from "./InteractivePostCard";
import MetadataTagRenderer from "./metadataTagRenderer";

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
    import("@/app/visualizations/DrawingNotation/DrawingOverlay"),
  { ssr: false }
);

const Lidar = dynamic(
  () =>
    import("@/app/visualizations/SphericalToCartesianCoordinates"),
  { ssr: false }
);

const visualizationRegistry: Record<string, any> = {
  SAT: SatProjection,
  TORUS: Torus,
  MODEL: ModelSlot,
  ANNOTATE: (props: any) => (
    <DrawingOverlay width={800} height={500} {...props} />
  ),
  LIDAR: Lidar,
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

  const interactivePosts = sortedPosts.filter((post) =>
    !!extractVisualization(post.content)
  );

  const normalPosts = sortedPosts.filter(
    (post) => !extractVisualization(post.content)
  );

  const renderNormalPost = (post: any, index: number) => {
    const contentLength = post.content?.length ?? 0;
    const categoryIndex = index + 1;

    const globalIndex =
      globalIndexMap.get(post.id) ?? categoryIndex;

    const isSimple = contentLength < 3000;

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
              : "1px solid rgba(255,255,255,0.08)",
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateX(8px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateX(0px)";
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
                background: "rgba(165,170,185,0.14)",
                backdropFilter:
                  "invert(0.82) brightness(0.94) blur(2px)",
                WebkitBackdropFilter:
                  "invert(0.82) brightness(0.94) blur(2px)",
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
                background: "rgba(220,225,235,0.38)",
                zIndex: 0,
              }}
            />
          )}

          {!isSimple && <MetadataTagRenderer />}

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
              textShadow: "0 2px 3px rgba(0,0,0,0.80)",
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
            {new Date(post.created_at).toLocaleDateString()}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 24,
        maxWidth: 1020,
        width: "100%",
      }}
    >
      {/* LEFT: NORMAL POSTS */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        {normalPosts.map((post, index) =>
          renderNormalPost(post, index)
        )}
      </div>

      {/* RIGHT: INTERACTIVE POSTS */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        {interactivePosts.map((post, index) => {
          const vizKey = extractVisualization(post.content);
          const VizComponent = vizKey
            ? visualizationRegistry[vizKey]
            : null;

          const categoryIndex = index + 1;

          const globalIndex =
            globalIndexMap.get(post.id) ?? categoryIndex;

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
        })}
      </div>
    </div>
  );
}
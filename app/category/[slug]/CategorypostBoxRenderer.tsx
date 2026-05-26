"use client";

import Link from "next/link";

import PostTitleRenderer from "./PostTitleRenderer";
import CategoryPostBoxIndex from "./CategoryPostBoxIndex";
import MetadataTagRenderer from "./metadataTagRenderer";

import InteractionBoxLayout from "./InteractionBoxLayout";
import CategoryInsideLayout from "./CategoryInsideLayout";

import {
  visualizationRegistry,
  extractVisualization,
  partitionPostsByInteraction,
} from "./postInteractionMetadataCalculator";

export default function CategoryPostBoxRenderer({
  posts,
  allPosts,
  onSearch,
  currentQuery,
}: {
  posts: any[];
  allPosts?: any[];
  onSearch?: (value: string) => void;
  currentQuery?: string;
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

  const { interactivePosts, normalPosts } =
    partitionPostsByInteraction(sortedPosts);

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
            height: 54,
            borderRadius: 14,
            padding: "10px 18px 10px 58px",
            cursor: "pointer",
            overflow: "hidden",
            transition: "all 0.32s ease",
            background: "transparent",

            border: isSimple
              ? "1px solid rgba(0,0,0,0.06)"
              : "1px solid rgba(255,255,255,0.12)",

            boxShadow: isSimple
              ? `
                inset 0 1px 0 rgba(255,255,255,0.75),
                0 4px 18px rgba(0,0,0,0.04)
              `
              : `
                inset 0 1px 0 rgba(255,255,255,0.08),
                inset 0 0 0 1px rgba(255,255,255,0.03),
                0 6px 20px rgba(0,0,0,0.12)
              `,

            backdropFilter: !isSimple
              ? "blur(1.5px)"
              : "none",

            WebkitBackdropFilter: !isSimple
              ? "blur(1.5px)"
              : "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "translateX(10px) scale(1.012)";

            e.currentTarget.style.borderColor =
              isSimple
                ? "rgba(0,0,0,0.12)"
                : "rgba(255,255,255,0.18)";

            e.currentTarget.style.boxShadow = isSimple
              ? `
                inset 0 1px 0 rgba(255,255,255,0.85),
                0 10px 24px rgba(0,0,0,0.08)
              `
              : `
                inset 0 1px 0 rgba(255,255,255,0.10),
                inset 0 0 0 1px rgba(255,255,255,0.04),
                0 10px 26px rgba(0,0,0,0.18)
              `;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "translateX(0px) scale(1)";

            e.currentTarget.style.borderColor =
              isSimple
                ? "rgba(0,0,0,0.06)"
                : "rgba(255,255,255,0.12)";

            e.currentTarget.style.boxShadow = isSimple
              ? `
                inset 0 1px 0 rgba(255,255,255,0.75),
                0 4px 18px rgba(0,0,0,0.04)
              `
              : `
                inset 0 1px 0 rgba(255,255,255,0.08),
                inset 0 0 0 1px rgba(255,255,255,0.03),
                0 6px 20px rgba(0,0,0,0.12)
              `;
          }}
        >
          <CategoryPostBoxIndex
            categoryIndex={categoryIndex}
            globalIndex={globalIndex}
            isSimple={isSimple}
          />

          {!isSimple && (
            <>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 14,
                  pointerEvents: "none",
                  background: `
                    linear-gradient(
                      135deg,
                      rgba(255,255,255,0.025),
                      transparent 40%,
                      transparent 60%,
                      rgba(255,255,255,0.02)
                    )
                  `,
                }}
              />

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 14,
                  pointerEvents: "none",
                  border:
                    "1px solid rgba(255,255,255,0.03)",
                }}
              />
            </>
          )}

          {!isSimple && <MetadataTagRenderer />}

          <div
            style={{
              position: "relative",
              zIndex: 5,
              fontSize: 15,
              color: isSimple
                ? "rgba(35,35,35,0.88)"
                : "rgba(255,255,255,0.94)",
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textShadow: isSimple
                ? "none"
                : "0 1px 4px rgba(0,0,0,0.30)",
              fontWeight: 600,
            }}
          >
            <PostTitleRenderer text={post.title} />
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 5,
              marginTop: 2,
              fontSize: 10,
              color: isSimple
                ? "rgba(60,60,60,0.45)"
                : "rgba(255,255,255,0.50)",
              letterSpacing: "0.08em",
            }}
          >
            {new Date(
              post.created_at
            ).toLocaleDateString()}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <CategoryInsideLayout
      onSearch={onSearch}
      currentQuery={currentQuery}
      left={normalPosts.map((post, index) =>
        renderNormalPost(post, index)
      )}
      right={
        <InteractionBoxLayout
          posts={interactivePosts}
          globalIndexMap={globalIndexMap}
          visualizationRegistry={
            visualizationRegistry
          }
          extractVisualization={
            extractVisualization
          }
        />
      }
    />
  );
}
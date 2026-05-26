// CategoryPostBoxRenderer.tsx

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

function highlightText(
  text: string,
  query?: string
) {
  if (!query?.trim()) return text;

  const escaped = query.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const regex = new RegExp(
    `(${escaped})`,
    "gi"
  );

  return text
    .split(regex)
    .map((part, index) => {
      const matched =
        part.toLowerCase() ===
        query.toLowerCase();

      if (!matched) {
        return (
          <span key={index}>{part}</span>
        );
      }

      return (
        <span
          key={index}
          style={{
            color: "#ffd866",
            fontWeight: 700,
          }}
        >
          {part}
        </span>
      );
    });
}

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

  const sortedPosts = [...posts].sort(
    (a, b) => {
      const aHasViz = !!extractVisualization(
        a.content
      );

      const bHasViz = !!extractVisualization(
        b.content
      );

      if (aHasViz && !bHasViz) return -1;
      if (!aHasViz && bHasViz) return 1;

      return (
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
      );
    }
  );

  const {
    interactivePosts,
    normalPosts,
  } = partitionPostsByInteraction(
    sortedPosts
  );

  const renderNormalPost = (
    post: any,
    index: number
  ) => {
    const contentLength =
      post.content?.length ?? 0;

    const categoryIndex = index + 1;

    const globalIndex =
      globalIndexMap.get(post.id) ??
      categoryIndex;

    const isSimple = contentLength < 3000;

    const matchedIn =
      post.searchMeta?.matchedIn;

    const snippet =
      post.searchMeta?.snippet;

    return (
      <Link
        key={post.id}
        href={`/post/${post.id}`}
      >
        <div
          style={{
            position: "relative",
            minHeight: 74,
            borderRadius: 14,
            padding:
              "10px 18px 12px 58px",
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
          }}
        >
          <CategoryPostBoxIndex
            categoryIndex={categoryIndex}
            globalIndex={globalIndex}
            isSimple={isSimple}
          />

          {!isSimple && (
            <MetadataTagRenderer />
          )}

          {/* TITLE */}
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
              fontWeight: 600,
            }}
          >
            {highlightText(
              post.title,
              currentQuery
            )}
          </div>

          {/* SEARCH META */}
          {currentQuery &&
            matchedIn && (
              <div
                style={{
                  marginTop: 6,
                  fontSize: 11,
                  lineHeight: 1.5,
                  color:
                    "rgba(255,255,255,0.58)",
                  maxWidth: 620,
                }}
              >
                <div
                  style={{
                    marginBottom: 3,
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    color:
                      "rgba(255,255,255,0.34)",
                  }}
                >
                  MATCHED IN{" "}
                  {matchedIn.toUpperCase()}
                </div>

                <div>
                  {highlightText(
                    snippet,
                    currentQuery
                  )}
                </div>
              </div>
            )}

          {/* DATE */}
          <div
            style={{
              position: "relative",
              zIndex: 5,
              marginTop: 6,
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
      left={normalPosts.map(
        (post, index) =>
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
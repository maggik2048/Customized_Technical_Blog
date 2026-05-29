"use client";

import { useState } from "react";

import Link from "next/link";

import PostTitleRenderer from "./PostTitleRenderer";
import CategoryPostBoxIndex from "./CategoryPostBoxIndex";
import MetadataTagRenderer from "./metadataTagRenderer";

import InteractionBoxLayout from "./InteractionBoxLayout";
import CategoryInsideLayout from "./CategoryInsideLayout";

import CategoryPostBoxHoverRenderer from "./CategoryPostBoxHoverRenderer";

import {
  visualizationRegistry,
  extractVisualization,
  partitionPostsByInteraction,
} from "./postInteractionMetadataCalculator";

//
// MARKDOWN IMAGE EXTRACTOR
//
function extractFirstImage(
  markdown?: string
): string | null {
  if (!markdown) return null;

  const markdownMatch =
    markdown.match(
      /!\[.*?\]\((.*?)\)/
    );

  if (
    markdownMatch?.[1]
  ) {
    return markdownMatch[1];
  }

  const htmlMatch =
    markdown.match(
      /<img[^>]+src=["']([^"']+)["']/i
    );

  if (
    htmlMatch?.[1]
  ) {
    return htmlMatch[1];
  }

  return null;
}

function highlightText(
  text: string,
  query?: string,
  isSimple?: boolean
) {
  if (!query?.trim()) {
    return text;
  }

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
          <span key={index}>
            {part}
          </span>
        );
      }

      return (
        <span
          key={index}
          style={{
            color: isSimple
              ? "rgba(20,20,20,0.92)"
              : "#ffd866",

            fontWeight: 700,
          }}
        >
          {part}
        </span>
      );
    });
}

//
// CLEAN PREVIEW TEXT
//
function extractPreviewText(
  content?: string
) {
  if (!content) {
    return "";
  }

  return content
    .replace(
      /\!\[.*?\]\(.*?\)/g,
      ""
    )
    .replace(
      /<img[^>]*>/gi,
      ""
    )
    .replace(
      /[#>*`]/g,
      ""
    )
    .replace(
      /\[(.*?)\]\((.*?)\)/g,
      "$1"
    )
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

//
// POST ITEM
//
function CategoryPostItem({
  post,
  index,
  globalIndexMap,
  currentQuery,
}: {
  post: any;
  index: number;
  globalIndexMap: Map<
    any,
    number
  >;
  currentQuery?: string;
}) {
  const [hovered, setHovered] =
    useState(false);

  const contentLength =
    post.content?.length ?? 0;

  const categoryIndex =
    index + 1;

  const globalIndex =
    globalIndexMap.get(
      post.id
    ) ?? categoryIndex;

  const isSimple =
    contentLength < 3000;

  const matchedIn =
    post.searchMeta?.matchedIn;

  const snippet =
    post.searchMeta?.snippet;

  const score =
    typeof post.score ===
    "number"
      ? post.score.toFixed(2)
      : null;

  const expanded =
    !!currentQuery &&
    !!matchedIn;

  const previewImage =
    extractFirstImage(
      post.content
    );

  const hasImage =
    !!previewImage;

  const previewText =
    snippet ||
    extractPreviewText(
      post.content
    ).slice(0, 220);

  const minHeight = hasImage
    ? 162
    : expanded
    ? 92
    : 54;

  return (
    <Link
      key={post.id}
      href={`/post/${post.id}`}
    >
      <div
        style={{
          position: "relative",
          overflow: "visible",
        }}
      >
        <CategoryPostBoxHoverRenderer
          visible={hovered}
          isSimple={isSimple}
        />

        <div
          style={{
            position: "relative",

            minHeight,

            height: "auto",

            borderRadius: 14,

            padding:
              "10px 18px 12px 58px",

            cursor: "pointer",

            overflow: "hidden",

            transition:
              "all 0.32s ease",

            background:
              "transparent",

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

            backdropFilter:
              !isSimple
                ? "blur(1.5px)"
                : "none",

            WebkitBackdropFilter:
              !isSimple
                ? "blur(1.5px)"
                : "none",
          }}
          onMouseEnter={(e) => {
            setHovered(true);

            e.currentTarget.style.transform =
              "translateX(10px) scale(1.012)";

            e.currentTarget.style.borderColor =
              isSimple
                ? "rgba(0,0,0,0.12)"
                : "rgba(255,255,255,0.18)";

            e.currentTarget.style.boxShadow =
              isSimple
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
            setHovered(false);

            e.currentTarget.style.transform =
              "translateX(0px) scale(1)";

            e.currentTarget.style.borderColor =
              isSimple
                ? "rgba(0,0,0,0.06)"
                : "rgba(255,255,255,0.12)";

            e.currentTarget.style.boxShadow =
              isSimple
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
            categoryIndex={
              categoryIndex
            }
            globalIndex={
              globalIndex
            }
            isSimple={isSimple}
          />

          {!isSimple && (
            <>
              <div
                style={{
                  position:
                    "absolute",

                  inset: 0,

                  borderRadius: 14,

                  pointerEvents:
                    "none",

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
                  position:
                    "absolute",

                  inset: 0,

                  borderRadius: 14,

                  pointerEvents:
                    "none",

                  border:
                    "1px solid rgba(255,255,255,0.03)",
                }}
              />
            </>
          )}

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
                ? "rgba(20,20,20,0.92)"
                : "rgba(255,255,255,0.94)",

              letterSpacing:
                "0.02em",

              whiteSpace:
                "nowrap",

              overflow:
                "hidden",

              textOverflow:
                "ellipsis",

              textShadow:
                isSimple
                  ? "none"
                  : "0 1px 4px rgba(0,0,0,0.30)",

              fontWeight: 600,
            }}
          >
            <PostTitleRenderer
              text={post.title}
              highlight={
                currentQuery
              }
              isSimple={isSimple}
            />
          </div>

          {/* MEDIA ROW */}
          {hasImage ? (
            <div
              style={{
                position: "relative",
                zIndex: 5,

                marginTop: 10,

                display: "flex",

                gap: 12,

                alignItems:
                  "flex-start",
              }}
            >
              {/* THUMB */}
              <div
                style={{
                  width: 192,
                  height: 92,

                  flexShrink: 0,

                  borderRadius: 12,

                  overflow:
                    "hidden",

                  border: isSimple
                    ? "1px solid rgba(0,0,0,0.08)"
                    : "1px solid rgba(255,255,255,0.08)",

                  background: isSimple
                    ? "rgba(0,0,0,0.04)"
                    : "rgba(255,255,255,0.03)",

                  display: "flex",

                  alignItems: "center",

                  justifyContent:
                    "center",

                  padding: 6,
                }}
              >
                <img
                  src={previewImage}
                  alt={
                    post.title ??
                    "preview"
                  }
                  loading="lazy"
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",

                    objectFit:
                      "contain",

                    display:
                      "block",

                    transition:
                      "transform 0.35s ease",
                  }}
                />
              </div>

              {/* TEXT */}
              <div
                style={{
                  flex: 1,

                  minWidth: 0,

                  display: "flex",

                  flexDirection:
                    "column",

                  justifyContent:
                    "space-between",
                }}
              >
                {expanded && (
                  <div
                    style={{
                      display:
                        "flex",

                      alignItems:
                        "center",

                      gap: 8,

                      fontSize: 9,

                      letterSpacing:
                        "0.12em",

                      marginBottom: 6,

                      color: isSimple
                        ? "rgba(40,40,40,0.35)"
                        : "rgba(255,255,255,0.34)",
                    }}
                  >
                    <span>
                      MATCHED IN{" "}
                      {matchedIn.toUpperCase()}
                    </span>

                    {score && (
                      <span
                        style={{
                          padding:
                            "1px 6px",

                          borderRadius:
                            999,

                          background:
                            isSimple
                              ? "rgba(0,0,0,0.05)"
                              : "rgba(255,255,255,0.08)",

                          color:
                            isSimple
                              ? "rgba(20,20,20,0.62)"
                              : "rgba(255,255,255,0.72)",

                          fontWeight: 700,

                          letterSpacing:
                            "0.04em",
                        }}
                      >
                        SCORE {score}
                      </span>
                    )}
                  </div>
                )}

                <div
                  style={{
                    fontSize: 11,

                    lineHeight: 1.55,

                    color: isSimple
                      ? "rgba(50,50,50,0.60)"
                      : "rgba(255,255,255,0.62)",

                    overflow:
                      "hidden",

                    display:
                      "-webkit-box",

                    WebkitLineClamp: 5,

                    WebkitBoxOrient:
                      "vertical",
                  }}
                >
                  {highlightText(
                    previewText,
                    currentQuery,
                    isSimple
                  )}
                </div>
              </div>
            </div>
          ) : (
            expanded && (
              <div
                style={{
                  position:
                    "relative",

                  zIndex: 5,

                  marginTop: 6,

                  fontSize: 11,

                  lineHeight: 1.45,

                  color: isSimple
                    ? "rgba(50,50,50,0.58)"
                    : "rgba(255,255,255,0.58)",

                  overflow:
                    "hidden",

                  display:
                    "-webkit-box",

                  WebkitLineClamp: 3,

                  WebkitBoxOrient:
                    "vertical",
                }}
              >
                {highlightText(
                  previewText,
                  currentQuery,
                  isSimple
                )}
              </div>
            )
          )}

          {/* DATE */}
          <div
            style={{
              position: "relative",
              zIndex: 5,

              marginTop: 10,

              fontSize: 10,

              color: isSimple
                ? "rgba(60,60,60,0.45)"
                : "rgba(255,255,255,0.50)",

              letterSpacing:
                "0.08em",
            }}
          >
            {new Date(
              post.created_at
            ).toLocaleDateString()}
          </div>
        </div>
      </div>
    </Link>
  );
}

//
// MAIN
//
export default function CategoryPostBoxRenderer({
  posts,
  allPosts,
  onSearch,
  currentQuery,
}: {
  posts: any[];
  allPosts?: any[];
  onSearch?: (
    value: string
  ) => void;
  currentQuery?: string;
}) {
  const safeAllPosts =
    Array.isArray(allPosts)
      ? allPosts
      : [];

  const globalIndexMap =
    new Map(
      safeAllPosts
        .slice()
        .sort(
          (a, b) =>
            new Date(
              b.created_at
            ).getTime() -
            new Date(
              a.created_at
            ).getTime()
        )
        .map((post, i) => [
          post.id,
          i + 1,
        ])
    );

  const sortedPosts =
    !!currentQuery
      ? [...posts]
      : [...posts].sort(
          (a, b) => {
            const aHasViz =
              !!extractVisualization(
                a.content
              );

            const bHasViz =
              !!extractVisualization(
                b.content
              );

            if (
              aHasViz &&
              !bHasViz
            )
              return -1;

            if (
              !aHasViz &&
              bHasViz
            )
              return 1;

            return (
              new Date(
                b.created_at
              ).getTime() -
              new Date(
                a.created_at
              ).getTime()
            );
          }
        );

  const {
    interactivePosts,
    normalPosts,
  } =
    partitionPostsByInteraction(
      sortedPosts
    );

  return (
    <CategoryInsideLayout
      onSearch={onSearch}
      currentQuery={
        currentQuery
      }
      left={normalPosts.map(
        (post, index) => (
          <CategoryPostItem
            key={post.id}
            post={post}
            index={index}
            globalIndexMap={
              globalIndexMap
            }
            currentQuery={
              currentQuery
            }
          />
        )
      )}
      right={
        <InteractionBoxLayout
          posts={
            interactivePosts
          }
          globalIndexMap={
            globalIndexMap
          }
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
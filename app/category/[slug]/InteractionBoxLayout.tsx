// InteractionBoxLayout.tsx

"use client";

import React, { useMemo, useState } from "react";

import InteractivePostCard from "./InteractivePostCard";

export default function InteractionBoxLayout({
  posts,
  globalIndexMap,
  visualizationRegistry,
  extractVisualization,
}: any) {
  const sortedByContentLength = useMemo(() => {
    return [...posts].sort((a, b) => {
      const aLength = a.content?.length ?? 0;
      const bLength = b.content?.length ?? 0;

      return bLength - aLength;
    });
  }, [posts]);

  const mainPost = sortedByContentLength[0];

  const carouselPosts = sortedByContentLength.slice(1);

  const [carouselIndex, setCarouselIndex] = useState(0);

  const visibleCarouselPosts = carouselPosts.slice(
    carouselIndex,
    carouselIndex + 3
  );

  function renderInteractiveCard(
    post: any,
    index: number,
    compact = false
  ) {
    const vizKey =
      extractVisualization(post.content);

    const VizComponent = vizKey
      ? visualizationRegistry[vizKey]
      : null;

    const categoryIndex = index + 1;

    const globalIndex =
      globalIndexMap.get(post.id) ??
      categoryIndex;

    return (
      <div
        key={post.id}
        style={{
          width: "100%",

          minHeight: compact ? 140 : 220,
          maxHeight: compact ? 180 : 280,

          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",

          opacity: compact ? 0.88 : 1,

          transform: compact
            ? "scale(0.92)"
            : "scale(1)",

          transformOrigin: "top center",

          transition:
            "transform 0.28s ease, opacity 0.28s ease",
        }}
      >
        <InteractivePostCard
          post={post}
          categoryIndex={categoryIndex}
          globalIndex={globalIndex}
          VizComponent={VizComponent}
          vizKey={vizKey}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",

        display: "flex",

        justifyContent: "flex-start",

        paddingLeft: 390,
        paddingRight: 40,

        boxSizing: "border-box",

        flexShrink: 0,

        transform: "translateX(-120px)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,

          position: "relative",

          display: "flex",
          flexDirection: "column",

          gap: 42,
        }}
      >
        {/* MAIN INTERACTION */}
        {mainPost &&
          renderInteractiveCard(
            mainPost,
            0,
            false
          )}

        {/* CAROUSEL */}
        {carouselPosts.length > 0 && (
          <div
            style={{
              width: "100%",

              display: "flex",
              flexDirection: "column",

              gap: 18,
            }}
          >
            {/* CONTROLS */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  color:
                    "rgba(255,255,255,0.48)",
                }}
              >
                INTERACTION ARCHIVE
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <button
                  onClick={() => {
                    setCarouselIndex((prev) =>
                      Math.max(prev - 1, 0)
                    );
                  }}
                  style={{
                    border: "none",
                    background:
                      "rgba(255,255,255,0.08)",

                    color: "white",

                    width: 34,
                    height: 34,

                    borderRadius: 999,

                    cursor: "pointer",

                    fontSize: 16,
                  }}
                >
                  {"<"}
                </button>

                <button
                  onClick={() => {
                    setCarouselIndex((prev) =>
                      Math.min(
                        prev + 1,
                        Math.max(
                          carouselPosts.length - 3,
                          0
                        )
                      )
                    );
                  }}
                  style={{
                    border: "none",
                    background:
                      "rgba(255,255,255,0.08)",

                    color: "white",

                    width: 34,
                    height: 34,

                    borderRadius: 999,

                    cursor: "pointer",

                    fontSize: 16,
                  }}
                >
                  {">"}
                </button>
              </div>
            </div>

            {/* ROW */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",

                alignItems: "flex-start",

                gap: 10,

                width: "100%",
              }}
            >
              {visibleCarouselPosts.map(
                (post, index) => (
                  <div
                    key={post.id}
                    style={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {renderInteractiveCard(
                      post,
                      index + 1,
                      true
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
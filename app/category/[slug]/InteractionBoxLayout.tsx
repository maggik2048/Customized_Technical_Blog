"use client";

import React from "react";

import InteractivePostCard from "./InteractivePostCard";

export default function InteractionBoxLayout({
  posts,
  globalIndexMap,
  visualizationRegistry,
  extractVisualization,
}: any) {
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

          gap: 56,
        }}
      >
        {posts.map((post: any, index: number) => {
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
                minHeight: 220,
                maxHeight: 280,

                display: "flex",
                flexDirection: "row",
                alignItems: "stretch",
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
        })}
      </div>
    </div>
  );
}
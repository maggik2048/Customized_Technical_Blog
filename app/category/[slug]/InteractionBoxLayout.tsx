"use client";

import React, {
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import InteractivePostCard from "./InteractivePostCard";

const springTransition = {
  type: "spring",
  stiffness: 120,
  damping: 18,
};

export default function InteractionBoxLayout({
  posts,
  globalIndexMap,
  visualizationRegistry,
  extractVisualization,
}: any) {
  const sortedByLength = useMemo(() => {
    return [...posts].sort(
      (a, b) =>
        (b.content?.length ?? 0) -
        (a.content?.length ?? 0)
    );
  }, [posts]);

  const [activeIndex, setActiveIndex] =
    useState(0);

  const activePost =
    sortedByLength[activeIndex];

  const prevPost =
    sortedByLength[activeIndex - 1];

  const nextPost =
    sortedByLength[activeIndex + 1];

  if (!activePost) return null;

  const activeVizKey =
    extractVisualization(
      activePost.content
    );

  const ActiveVizComponent =
    activeVizKey
      ? visualizationRegistry[
          activeVizKey
        ]
      : null;

  const activeGlobalIndex =
    globalIndexMap.get(activePost.id) ??
    activeIndex + 1;

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

        overflow: "visible",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,

          position: "relative",

          display: "flex",
          flexDirection: "column",

          gap: 48,

          overflow: "visible",
        }}
      >
        {/* ========================= */}
        {/* MAIN INTERACTION */}
        {/* ========================= */}

        <div
          style={{
            width: "100%",
            position: "relative",
            zIndex: 20,
          }}
        >
          <InteractivePostCard
            post={activePost}
            categoryIndex={
              activeIndex + 1
            }
            globalIndex={
              activeGlobalIndex
            }
            VizComponent={
              ActiveVizComponent
            }
            vizKey={activeVizKey}
          />
        </div>

        {/* ========================= */}
        {/* STACKED VIEWER */}
        {/* ========================= */}

        <div
          style={{
            width: "100%",
            height: 220,

            position: "relative",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            overflow: "visible",
          }}
        >
          {/* LEFT */}
          {prevPost && (
            <motion.div
              animate={{
                x: -180,
                scale: 0.68,
                rotateY: 18,
                opacity: 0.72,
              }}
              transition={
                springTransition
              }
              onClick={() =>
                setActiveIndex(
                  activeIndex - 1
                )
              }
              style={{
                position: "absolute",

                width: 340,
                height: 190,

                cursor: "pointer",

                zIndex: 10,

                overflow: "hidden",

                borderRadius: 24,

                filter:
                  "grayscale(0.5) saturate(0.5)",

                boxShadow:
                  "0 20px 40px rgba(0,0,0,0.28)",

                transformStyle:
                  "preserve-3d",
              }}
            >
              <InteractivePostCard
                post={prevPost}
                categoryIndex={
                  activeIndex
                }
                globalIndex={
                  globalIndexMap.get(
                    prevPost.id
                  ) ?? activeIndex
                }
                VizComponent={
                  visualizationRegistry[
                    extractVisualization(
                      prevPost.content
                    )
                  ]
                }
                vizKey={extractVisualization(
                  prevPost.content
                )}
              />

              <div
                style={{
                  position: "absolute",
                  inset: 0,

                  background:
                    "linear-gradient(to right, rgba(0,0,0,0.05), rgba(0,0,0,0.52))",

                  pointerEvents: "none",
                }}
              />
            </motion.div>
          )}

          {/* CENTER PREVIEW */}
          <motion.div
            animate={{
              scale: 0.82,
              opacity: 0.9,
            }}
            transition={
              springTransition
            }
            style={{
              position: "absolute",

              width: 400,
              height: 210,

              borderRadius: 28,

              overflow: "hidden",

              zIndex: 30,

              boxShadow:
                "0 30px 60px rgba(0,0,0,0.32)",

              pointerEvents: "none",
            }}
          >
            <InteractivePostCard
              post={activePost}
              categoryIndex={
                activeIndex + 1
              }
              globalIndex={
                activeGlobalIndex
              }
              VizComponent={
                ActiveVizComponent
              }
              vizKey={activeVizKey}
            />
          </motion.div>

          {/* RIGHT */}
          {nextPost && (
            <motion.div
              animate={{
                x: 180,
                scale: 0.68,
                rotateY: -18,
                opacity: 0.72,
              }}
              transition={
                springTransition
              }
              onClick={() =>
                setActiveIndex(
                  activeIndex + 1
                )
              }
              style={{
                position: "absolute",

                width: 340,
                height: 190,

                cursor: "pointer",

                zIndex: 10,

                overflow: "hidden",

                borderRadius: 24,

                filter:
                  "grayscale(0.5) saturate(0.5)",

                boxShadow:
                  "0 20px 40px rgba(0,0,0,0.28)",

                transformStyle:
                  "preserve-3d",
              }}
            >
              <InteractivePostCard
                post={nextPost}
                categoryIndex={
                  activeIndex + 2
                }
                globalIndex={
                  globalIndexMap.get(
                    nextPost.id
                  ) ??
                  activeIndex + 2
                }
                VizComponent={
                  visualizationRegistry[
                    extractVisualization(
                      nextPost.content
                    )
                  ]
                }
                vizKey={extractVisualization(
                  nextPost.content
                )}
              />

              <div
                style={{
                  position: "absolute",
                  inset: 0,

                  background:
                    "linear-gradient(to left, rgba(0,0,0,0.05), rgba(0,0,0,0.52))",

                  pointerEvents: "none",
                }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
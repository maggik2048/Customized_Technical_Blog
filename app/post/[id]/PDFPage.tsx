"use client";

import React from "react";

import "katex/dist/katex.min.css";

import { motion } from "framer-motion";

import { markdownComponents } from "@/lib/markdownComponents";

import { useDarkMode } from "@/app/context/DarkModeContext";

import { getHeaderImage } from "@/lib/getHeaderImage";

import { visualizationRegistry } from "@/lib/visualizationRegistry";

import NotepageLines from "@/app/components/markdown/NotepageLines";

import MarkdownRendererCoordinator from "@/app/components/Markdown/MarkdownRendererCoordinator";

import CodeBlockThemeCoordinator from "@/app/components/Markdown/CodeBlockThemeCoordinator";

import MetadataPostalCode from "@/app/components/papers/MetadataPostalCode";

import PDFPageHeader from "./PDFPageHeader";

type Props = {
  data: any;

  isActive?: boolean;

  isStandalone?: boolean;

  globalIndex?: number;

  localIndex?: number;

  localTotal?: number;
};

/* =========================
   MEMOIZED COORDINATOR
========================= */

const MemoMarkdownRendererCoordinator =
  React.memo(
    MarkdownRendererCoordinator
  );

export default function PDFPage({
  data,

  isActive = true,

  globalIndex,

  localIndex,

  localTotal,
}: Props) {

  const { mode } = useDarkMode();

  const isDark = mode === "dark";

  const headerImage =
    getHeaderImage(data);

  const textColor =
    isDark ? "#eee" : "#111";

  const HEADER_HEIGHT = 560;

  // =========================
  // DEBUG
  // =========================

  console.log(
    "PDF PAGE RECEIVED:",
    {
      title: data?.title,

      globalIndex,

      localIndex,

      localTotal,

      category: data?.category,
    }
  );

  console.log(
    "ACTUAL CATEGORY VALUE:",
    data?.category
  );

  // =========================
  // STYLES
  // =========================

  const pageStyle = React.useMemo(
    () => ({
      width: 860,

      margin: "40px auto",

      position: "relative" as const,

      background: isDark
        ? "rgba(60,60,60,0.6)"
        : "rgba(255,255,255,0.72)",

      paddingLeft: 64,

      paddingRight: 64,

      borderRadius: 12,

      overflow: "hidden" as const,

      boxShadow: isDark
        ? "0 8px 30px rgba(0,0,0,0.6)"
        : "0 8px 30px rgba(0,0,0,0.15)",
    }),
    [isDark]
  );

  // =========================
  // RENDERERS
  // =========================

  const mdComponents =
    React.useMemo(
      () => markdownComponents,
      []
    );

  const CodeBlock =
    React.useMemo(
      () => CodeBlockThemeCoordinator,
      []
    );

  const vizRegistryRef =
    React.useMemo(
      () => visualizationRegistry,
      []
    );

  const getVizComponent =
    React.useCallback(
      (key: string) =>
        vizRegistryRef[key],
      [vizRegistryRef]
    );

  // =========================
  // PARSE CONTENT
  // =========================

  const parsedParts =
    React.useMemo(() => {

      const regex =
        /\[([A-Za-z_][A-Za-z0-9_]*)\]/g;

      const codeBlocks: string[] =
        [];

      const protectedContent =
        data.content.replace(
          /```[\s\S]*?```/g,
          (match: string) => {

            codeBlocks.push(match);

            return `__CODE_BLOCK_${
              codeBlocks.length - 1
            }__`;
          }
        );

      const parts =
        protectedContent.split(
          regex
        );

      const restore = (
        text: string
      ) =>
        text.replace(
          /__CODE_BLOCK_(\d+)__/g,
          (_, i) =>
            codeBlocks[Number(i)]
        );

      return parts.map(
        (
          part: string,
          i: number
        ) => {

          const Component =
            getVizComponent(part);

          if (Component) {

            return {
              kind: "viz" as const,

              Component,

              key: i,
            };
          }

          return {
            kind: "md" as const,

            content: restore(part),

            key: i,
          };
        }
      );
    }, [data.content, getVizComponent]);

  return (
    <motion.div
      style={{
        color: textColor,
      }}
    >
      <div>
        <div style={pageStyle}>

          {/* HEADER */}
          <PDFPageHeader
            data={data}
            isDark={isDark}
            headerImage={headerImage}
            globalIndex={globalIndex}
            localIndex={localIndex}
            localTotal={localTotal}
            headerHeight={HEADER_HEIGHT}
          />

          {/* CONTENT */}
          <div
            style={{
              paddingTop:
                HEADER_HEIGHT - 36,
            }}
          >

            <MetadataPostalCode
              data={data}
              isDark={isDark}
            />

            <div
              style={{
                float: "left",

                width: 165,

                height: 110,

                pointerEvents:
                  "none",
              }}
            />

            <div
              style={{
                marginTop: -2,
              }}
            >

              <NotepageLines>

                {parsedParts.map(
                  (item) => {

                    if (
                      item.kind ===
                      "viz"
                    ) {

                      const Component =
                        item.Component;

                      return (
                        <div
                          key={
                            item.key
                          }
                        >
                          <Component />
                        </div>
                      );
                    }

                    return (
                      <MemoMarkdownRendererCoordinator
                        key={item.key}
                        category={
                          data?.category
                        }
                        markdownComponents={
                          mdComponents
                        }
                        isDark={isDark}
                        CodeBlock={
                          CodeBlock
                        }
                      >
                        {item.content}
                      </MemoMarkdownRendererCoordinator>
                    );
                  }
                )}

              </NotepageLines>

            </div>

            <div
              style={{
                clear: "both",
              }}
            />

          </div>
        </div>
      </div>
    </motion.div>
  );
}
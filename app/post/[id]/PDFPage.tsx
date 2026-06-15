"use client";

import React from "react";

import "katex/dist/katex.min.css";

import { motion } from "framer-motion";

import { markdownComponents } from "@/lib/markdownComponents";
import { useDarkMode } from "@/app/context/DarkModeContext";
import { getHeaderImage } from "@/app/-Data/getHeaderImage";
import { visualizationRegistry } from "@/lib/visualizationRegistry";

import NotepageLines from "@/app/components/Markdown/Theme/NotepageLines";
import MarkdownRendererCoordinator from "@/app/components/Markdown/Theme/MarkdownRendererCoordinator";
import CodeBlockThemeCoordinator from "@/app/components/Markdown/Theme/CodeBlockThemeCoordinator";

import MetadataPostalCode from "@/app/components/papers/MetadataPostalCode";

import DiffVisualizer from "@/app/components/Markdown/processors/MarkdownPipeline/DiffVisualizer";

import PDFPageHeader from "./PDFPageHeader";
import GotoTheTop from "./GotoTheTop";
import ScrollWithKeyboardArrow from "./ScrollWithKeyboardArrow";

import { useParsedPDFContent } from "./useParsedPDFContent";

/* =========================
    HIGHLIGHT ENGINE
========================= */
import { TextSelectionEngine } from "@/app/components/Markdown/Theme/TextSelectionEngine";

type Props = {
  data: any;
  isActive?: boolean;
  isStandalone?: boolean;
  globalIndex?: number;
  localIndex?: number;
  localTotal?: number;
};

const MemoMarkdownRendererCoordinator =
  React.memo(MarkdownRendererCoordinator);

export default function PDFPage({
  data,
  isActive = true,
  globalIndex,
  localIndex,
  localTotal,
}: Props) {
  const { mode } = useDarkMode();
  const isDark = mode === "dark";

  const headerImage = getHeaderImage(data);
  const textColor = isDark ? "#eee" : "#111";

  const HEADER_HEIGHT = 560;

  console.log("[PDF PAGE RECEIVED]", {
    title: data?.title,
    globalIndex,
    localIndex,
    localTotal,

    commit_url: data?.commit_url,

    category: data?.category,
    category_slugs: data?.category_slugs,
    project_slugs: data?.project_slugs,
    tag_slugs: data?.tag_slugs,
  });

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

  /**
   * =========================
   * MARKDOWN COMPONENTS
   * =========================
   */
  const mdComponents = React.useMemo(() => {
    return {
      ...markdownComponents,
      img: ({ style, ...props }: any) => (
        <img
          {...props}
          style={{
            maxWidth: "calc(100% - 24px)",
            height: "auto",
            marginRight: 24,
            ...style,
          }}
        />
      ),
    };
  }, []);

  const CodeBlock = React.useMemo(
    () => CodeBlockThemeCoordinator,
    []
  );

  const getVizComponent = React.useCallback(
    (key: string) => visualizationRegistry[key],
    []
  );

  /**
   * =========================
   * PARSED CONTENT
   * =========================
   */
  const parsedParts = useParsedPDFContent(
    data.content,
    getVizComponent
  );

  /**
   * =========================
   * HIGHLIGHT ENGINE (FIXED)
   * =========================
   */
  const highlightEngine = React.useMemo(
    () => new TextSelectionEngine(),
    []
  );

  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    highlightEngine.setContainer(contentRef.current);
  }, [highlightEngine]);

  /**
   * =========================
   * SAFE HIGHLIGHT HANDLER
   * =========================
   */
  const handleMouseUp = React.useCallback(() => {
    requestAnimationFrame(() => {
      highlightEngine.applyHighlight();
    });
  }, [highlightEngine]);

  return (
    <motion.div style={{ color: textColor }}>
      <ScrollWithKeyboardArrow />

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
          <div style={{ paddingTop: HEADER_HEIGHT - 36 }}>
            <MetadataPostalCode data={data} isDark={isDark} />

            <div
              style={{
                marginTop: 20,
                marginBottom: 24,

                display: "flex",
                alignItems: "center",
                gap: 12,

                padding: "14px 18px",

                borderRadius: 12,

                background: isDark
                  ? "rgba(255,140,0,0.08)"
                  : "rgba(255,140,0,0.08)",

                border:
                  "1px solid rgba(255,140,0,0.3)",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  if (data?.commit_url) {
                    window.open(
                      data.commit_url,
                      "_blank"
                    );
                  }
                }}
                style={{
                  padding: "10px 18px",

                  border: "none",

                  borderRadius: 8,

                  cursor: data?.commit_url
                    ? "pointer"
                    : "default",

                  fontWeight: 700,

                  background: "#f97316",

                  color: "#fff",
                }}
              >
                Go To Corresponding
                GitHub Commit Page
              </button>

              {data?.commit_url ? (
                <a
                  href={data.commit_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#3b82f6",
                    textDecoration:
                      "underline",

                    wordBreak:
                      "break-all",
                  }}
                >
                  {data.commit_url}
                </a>
              ) : (
                <span
                  style={{
                    color: "#888",
                  }}
                >
                  No commit linked yet
                </span>
              )}
            </div>
            <div
              style={{
                float: "left",
                width: 165,
                height: 110,
                pointerEvents: "none",
              }}
            />

            {/* MARKDOWN AREA */}
            <div
              ref={contentRef}
              style={{ marginTop: -2 }}
              onMouseUp={handleMouseUp}
            >
              <NotepageLines>
                {parsedParts.map((item) => {
                  if (item.kind === "viz") {
                    const Component = item.Component;
                    return (
                      <div key={item.key}>
                        <Component />
                      </div>
                    );
                  }

                  if (item.kind === "diff") {
                    return (
                      <DiffVisualizer
                        key={item.key}
                        raw={item.content}
                      />
                    );
                  }

                  return (
                    <MemoMarkdownRendererCoordinator
                      key={item.key}
                      category={data?.category}
                      markdownComponents={mdComponents}
                      isDark={isDark}
                      CodeBlock={CodeBlock}
                    >
                      {item.content}
                    </MemoMarkdownRendererCoordinator>
                  );
                })}
              </NotepageLines>
            </div>

            <div style={{ clear: "both" }} />

            <GotoTheTop isDark={isDark} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
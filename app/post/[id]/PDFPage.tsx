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

import GotoGitHubCorresponding from "./GotoGitHubCorresponding";

import PDFPageHeader from "./PDFPageHeader";
import GotoTheTop from "./GotoTheTop";
import ScrollWithKeyboardArrow from "./ScrollWithKeyboardArrow";

import { useParsedPDFContent } from "./useParsedPDFContent";
import DocContentBackgroundManager from "./DocContentBackgroundManager";

/* =========================
    HIGHLIGHT ENGINE
========================= */
import { TextSelectionEngine } from "@/app/components/Markdown/Theme/TextSelectionEngine";

// Import PostAdminActions
import PostAdminActions from "@/app/admin/PostAdminActions";

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

  //  REMOVED background from pageStyle - now only container styling
  const pageStyle = React.useMemo(
    () => ({
      width: 860,
      margin: "40px auto",
      position: "relative" as const,
      background: isDark
        ? "rgba(60,60,60,0.6)"
        : "rgba(255,255,255,0.72)",
      // ❌ REMOVED: backgroundImage, backgroundSize, etc.
      paddingLeft: 64,
      paddingRight: 64,
      borderRadius: 12,
      overflow: "visible" as const,
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

  const markdownWrapperStyle = React.useMemo(
    () => ({
      marginTop: -2,
      color: textColor,
      WebkitFontSmoothing: "antialiased" as const,
      MozOsxFontSmoothing: "grayscale" as const,
      textRendering: "optimizeLegibility" as const,
    }),
    [textColor]
  );

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
          {/* =========================
              ADMIN ACTIONS - RENDERED OUTSIDE HEADER
          ========================= */}
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 40,
              zIndex: 9999,
              pointerEvents: "auto",
            }}
          >
            <PostAdminActions
              postId={data.id}
              category={data.category}
            />
          </div>

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: isDark
                ? "rgba(60,60,60,0.3)"
                : "rgba(255,255,255,0.2)",
              borderRadius: 12,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

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
              paddingTop: HEADER_HEIGHT - 36,
              position: "relative",
              zIndex: 1,
            }}
          >
            <MetadataPostalCode data={data} isDark={isDark} />

            <GotoGitHubCorresponding commitUrl={data?.commit_url} />

            <div
              style={{
                float: "left",
                width: 165,
                height: 110,
                pointerEvents: "none",
              }}
            />

            {/* MARKDOWN CONTENT WITH BACKGROUND MANAGER */}
            <DocContentBackgroundManager
              parentPaddingLeft={64}
              parentPaddingRight={64}
              backgroundImage="/images/dossierBg/woodmarble2.jpg"
              objectFit="cover"
              backgroundSize="100% 100%"
              backgroundPosition="center center"
              backgroundRepeat="no-repeat"
              backgroundBlendMode="overlay"
              paddingTop={20}
              paddingBottom={20}
            >
              <div
                ref={contentRef}
                style={markdownWrapperStyle}
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
            </DocContentBackgroundManager>

            <div style={{ clear: "both" }} />

            <GotoTheTop isDark={isDark} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
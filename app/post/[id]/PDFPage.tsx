"use client";

import React from "react";

import "katex/dist/katex.min.css";

import { motion } from "framer-motion";

import { markdownComponents } from "@/lib/markdownComponents";
import { useDarkMode } from "@/app/context/DarkModeContext";
import { getHeaderImage } from "@/lib/getHeaderImage";
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
    HIGHLIGHT ENGINE (SVG MODE)
========================= */
import { TextSelectionEngine } from "@/app/components/Markdown/Theme/TextSelectionEngine";
import HighlightLayer from "@/app/components/Markdown/Theme/HighlightLayer";

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
   * HIGHLIGHT STATE (SVG SYSTEM)
   * =========================
   */
  const [highlights, setHighlights] = React.useState<any[]>([]);

  const highlightEngine = React.useMemo(
    () => new TextSelectionEngine({ onChange: setHighlights }),
    []
  );

  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    highlightEngine.setContainer(contentRef.current);
  }, []);

  /**
   * =========================
   * SAFE HIGHLIGHT HANDLER
   * =========================
   */
  const handleMouseUp = React.useCallback(() => {
    requestAnimationFrame(() => {
      highlightEngine.applyHighlight();
    });
  }, []);

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
                float: "left",
                width: 165,
                height: 110,
                pointerEvents: "none",
              }}
            />

            {/* 🔥 IMPORTANT: relative container */}
            <div
              ref={contentRef}
              style={{
                marginTop: -2,
                position: "relative",
              }}
              onMouseUp={handleMouseUp}
            >
              {/* SVG OVERLAY LAYER */}
              <HighlightLayer
                highlights={highlights}
                containerRef={contentRef}
              />

              <NotepageLines>
                {parsedParts.map((item) => {
                  if (item.kind === "viz") {
                    const Component = item.Component;
                    return <Component key={item.key} />;
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
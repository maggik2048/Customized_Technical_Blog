// app/post/[id]/PDFPage.tsx
"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import "katex/dist/katex.min.css";
import { motion } from "framer-motion";

import { markdownComponents } from "@/lib/markdownComponents";
import { useDarkMode } from "@/app/context/DarkModeContext";
import { getHeaderImage } from "@/app/-Data/getHeaderImage";
import { visualizationRegistry } from "@/lib/visualizationRegistry";

import NotepageLines from "@/app/components/Markdown/Theme/NotepageLines";
import MarkdownRendererCoordinator from "@/app/components/Markdown/Theme/MarkdownRendererCoordinator";
import CodeBlock_white from "@/app/components/Markdown/Theme/CodeBlock_white";

import MetadataPostalCode from "@/app/components/papers/MetadataPostalCode";
import DiffVisualizer from "@/app/components/Markdown/processors/MarkdownPipeline/DiffVisualizer";

import GotoGitHubCorresponding from "./GotoGitHubCorresponding";
import PDFPageHeader from "./PDFPageHeader";
import GotoTheTop from "./GotoTheTop";
import ScrollWithKeyboardArrow from "./ScrollWithKeyboardArrow";
import PDFPageScrollBar from "./PDFPageScrollBar";

import { useParsedPDFContent } from "./useParsedPDFContent";
import DocContentBackgroundManager from "./DocContentBackgroundManager";

import { TextSelectionEngine } from "@/app/components/Markdown/Theme/TextSelectionEngine";
import PostAdminActions from "@/app/admin/PostAdminActions";

import { usePageFlip } from "@/app/hooks/usePageFlip";
import PaperFlipPage from "@/app/components/papers/PaperFlipPage";

type Props = {
  data: any;
  isActive?: boolean;
  isStandalone?: boolean;
  globalIndex?: number;
  localIndex?: number;
  localTotal?: number;
};

const MemoMarkdownRendererCoordinator = React.memo(MarkdownRendererCoordinator);

export default function PDFPage({
  data,
  isActive = true,
  globalIndex,
  localIndex,
  localTotal,
}: Props) {
  const { mode } = useDarkMode();
  const isDark = mode === "dark";
  const contentRef = useRef<HTMLDivElement>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);

  const headerImage = getHeaderImage(data);
  const textColor = isDark ? "#eee" : "#111";

  const HEADER_HEIGHT = 560;

  const { 
    progress, 
    isFlipping, 
    direction, 
    pageIndex, 
    startFlip 
  } = usePageFlip(localTotal || 1, localIndex || 0);

  const hasProject = React.useMemo(() => {
    const hasProjects = data?.project_slugs && 
                       Array.isArray(data.project_slugs) && 
                       data.project_slugs.length > 0;
    return hasProjects;
  }, [data?.project_slugs]);

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
      overflow: "visible" as const,
      boxShadow: isDark
        ? "0 8px 30px rgba(0,0,0,0.6)"
        : "0 8px 30px rgba(0,0,0,0.15)",
    }),
    [isDark]
  );

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
    () => CodeBlock_white,
    []
  );

  const getVizComponent = React.useCallback(
    (key: string) => visualizationRegistry[key],
    []
  );

  const parsedParts = useParsedPDFContent(
    data.content,
    getVizComponent
  );

  const highlightEngine = React.useMemo(
    () => new TextSelectionEngine(),
    []
  );

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

  const handleMouseUp = React.useCallback(() => {
    requestAnimationFrame(() => {
      highlightEngine.applyHighlight();
    });
  }, [highlightEngine]);

  const handleFlipForward = useCallback(() => {
    startFlip('forward');
  }, [startFlip]);

  const handleFlipBackward = useCallback(() => {
    startFlip('backward');
  }, [startFlip]);

  const renderPageContent = () => {
    return (
      <div style={pageStyle}>
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

        <PDFPageHeader
          data={data}
          isDark={isDark}
          headerImage={headerImage}
          globalIndex={globalIndex}
          localIndex={pageIndex}
          localTotal={localTotal}
          headerHeight={HEADER_HEIGHT}
        />

        <div
          style={{
            paddingTop: HEADER_HEIGHT - 36,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ 
            position: "relative", 
            zIndex: 9998,
            transform: "translateY(60px)",
            marginBottom: "10px",
          }}>
            <MetadataPostalCode data={data} isDark={isDark} />
          </div>

          <GotoGitHubCorresponding 
            commitUrl={data?.commit_url}
            hasProject={hasProject}
          />

          <div
            style={{
              float: "left",
              width: 165,
              height: 110,
              pointerEvents: "none",
            }}
          />

          <DocContentBackgroundManager
            parentPaddingLeft={64}
            parentPaddingRight={64}
            paddingTop={20}
            paddingBottom={20}
            backgroundSize="520px 520px"
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
    );
  };

  const renderWithPaperFlip = () => {
    const currentContent = renderPageContent();

    if (isFlipping) {
      const isForward = direction === 'forward';
      
      const nextPageContent = (
        <div style={{ 
          padding: '20px',
          opacity: 0.3,
          filter: 'blur(2px)',
          pointerEvents: 'none'
        }}>
          <div style={{ 
            height: '400px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: isDark ? '#333' : '#f5f5f5',
            borderRadius: '8px'
          }}>
            <span style={{ color: isDark ? '#aaa' : '#666' }}>
              Page {pageIndex + (isForward ? 2 : 0)}
            </span>
          </div>
        </div>
      );

      return (
        <div
          ref={pageContainerRef}
          style={{
            position: 'relative',
            perspective: '1500px',
            perspectiveOrigin: 'center center',
            minHeight: '600px',
          }}
        >
          {/* 뒷면 페이지 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0,
            }}
          >
            {nextPageContent}
          </div>

          {/* 앞면 페이지 - 깔끔한 3D 회전만 */}
          <PaperFlipPage
            isFlipping={isFlipping}
            direction={direction}
            progress={progress}
          >
            {currentContent}
          </PaperFlipPage>

          {/* 그림자 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              [isForward ? 'left' : 'right']: 0,
              width: '30px',
              background: `linear-gradient(to ${isForward ? 'right' : 'left'}, 
                rgba(0,0,0,${0.1 * progress}), 
                rgba(0,0,0,${0.2 * progress})
              )`,
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
        </div>
      );
    }

    return currentContent;
  };

  return (
    <>
      <PDFPageScrollBar
        isDark={isDark}
        totalPages={localTotal}
        currentPage={pageIndex !== undefined ? pageIndex + 1 : undefined}
      />
      
      <motion.div style={{ color: textColor }}>
        <ScrollWithKeyboardArrow />

        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '40px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <button
            onClick={handleFlipBackward}
            disabled={pageIndex === 0 || isFlipping}
            style={{
              padding: '12px 20px',
              background: isDark ? '#444' : '#eee',
              color: isDark ? '#fff' : '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: pageIndex > 0 && !isFlipping ? 'pointer' : 'not-allowed',
              opacity: pageIndex > 0 && !isFlipping ? 1 : 0.5,
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            ◀ Previous
          </button>
          <button
            onClick={handleFlipForward}
            disabled={pageIndex === (localTotal || 1) - 1 || isFlipping}
            style={{
              padding: '12px 20px',
              background: isDark ? '#444' : '#eee',
              color: isDark ? '#fff' : '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: pageIndex < (localTotal || 1) - 1 && !isFlipping ? 'pointer' : 'not-allowed',
              opacity: pageIndex < (localTotal || 1) - 1 && !isFlipping ? 1 : 0.5,
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            Next ▶
          </button>
          
          <div style={{
            fontSize: '11px',
            color: isDark ? '#aaa' : '#666',
            textAlign: 'center',
            background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)',
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            {pageIndex + 1} / {localTotal || 1}
            {isFlipping && ' 🔄'}
          </div>
        </div>

        <div>
          {renderWithPaperFlip()}
        </div>
      </motion.div>
    </>
  );
}
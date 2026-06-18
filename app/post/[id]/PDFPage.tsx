// app/post/[id]/PDFPage.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
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

  const headerImage = getHeaderImage(data);
  const textColor = isDark ? "#eee" : "#111";

  const HEADER_HEIGHT = 560;

  // 간단한 플립 상태
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward'>('forward');
  const [currentPage, setCurrentPage] = useState(localIndex || 0);

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

  // 간단한 플립 핸들러
  const handleFlip = (direction: 'forward' | 'backward') => {
    if (isFlipping) return;
    
    const newPage = direction === 'forward' 
      ? Math.min(currentPage + 1, (localTotal || 1) - 1)
      : Math.max(currentPage - 1, 0);
    
    if (newPage === currentPage) return;
    
    setFlipDirection(direction);
    setIsFlipping(true);
    
    // 애니메이션 후 페이지 변경
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsFlipping(false);
    }, 600);
  };

  // 실제 콘텐츠 렌더링
  const renderContent = () => {
    return (
      <div style={pageStyle}>
        {/* ADMIN ACTIONS */}
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
          localIndex={currentPage}
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

  // 플립 애니메이션 래퍼
  const renderWithFlip = () => {
    const flipTransform = flipDirection === 'forward' 
      ? `rotateY(${isFlipping ? -180 : 0}deg)`
      : `rotateY(${isFlipping ? 180 : 0}deg)`;

    return (
      <div
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          animate={{
            rotateY: isFlipping 
              ? (flipDirection === 'forward' ? -180 : 180) 
              : 0
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
          style={{
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
          onAnimationComplete={() => {
            if (isFlipping) {
              const newPage = flipDirection === 'forward' 
                ? Math.min(currentPage + 1, (localTotal || 1) - 1)
                : Math.max(currentPage - 1, 0);
              setCurrentPage(newPage);
              setIsFlipping(false);
            }
          }}
        >
          {renderContent()}
        </motion.div>
      </div>
    );
  };

  return (
    <>
      <PDFPageScrollBar
        isDark={isDark}
        totalPages={localTotal}
        currentPage={currentPage !== undefined ? currentPage + 1 : undefined}
      />
      
      <motion.div style={{ color: textColor }}>
        <ScrollWithKeyboardArrow />

        {/* 플립 버튼 */}
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
            onClick={() => handleFlip('backward')}
            disabled={currentPage === 0 || isFlipping}
            style={{
              padding: '12px 20px',
              background: isDark ? '#444' : '#eee',
              color: isDark ? '#fff' : '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: currentPage > 0 && !isFlipping ? 'pointer' : 'not-allowed',
              opacity: currentPage > 0 && !isFlipping ? 1 : 0.5,
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            ◀ Previous
          </button>
          <button
            onClick={() => handleFlip('forward')}
            disabled={currentPage === (localTotal || 1) - 1 || isFlipping}
            style={{
              padding: '12px 20px',
              background: isDark ? '#444' : '#eee',
              color: isDark ? '#fff' : '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: currentPage < (localTotal || 1) - 1 && !isFlipping ? 'pointer' : 'not-allowed',
              opacity: currentPage < (localTotal || 1) - 1 && !isFlipping ? 1 : 0.5,
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
            {currentPage + 1} / {localTotal || 1}
            {isFlipping && ' 🔄'}
          </div>
        </div>

        <div>
          {renderWithFlip()}
        </div>
      </motion.div>
    </>
  );
}
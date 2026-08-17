// app/post/[id]/PDFPage.tsx
"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import "katex/dist/katex.min.css";
import { motion } from "framer-motion";

import { markdownComponents } from "@/lib/markdownComponents";
import { useDarkMode } from "@/app/contexts/DarkModeContext";
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

// 🆕 리팩토링된 컨트롤러 import
import { PageFlipController, usePageFlip } from "../../components/papers/PageFlippingAnimation/pageFlipController";

// 🆕 3D 종이 import
import PaperWobble3D from "@/app/components/papers/PageFlippingAnimation/PaperWobble3D";

// 🆕 SnapshotManager import
import { useSnapshotManager } from "@/app/components/papers/PageFlippingAnimation/SnapshotManager";

// 🆕 ThemeProvider import
import { ThemeProvider } from "@/app/contexts/ThemeContext";

type Props = {
  data: any;
  isActive?: boolean;
  isStandalone?: boolean;
  globalIndex?: number;
  localIndex?: number;
  localTotal?: number;
};

const MemoMarkdownRendererCoordinator = React.memo(MarkdownRendererCoordinator);

// 🔥 FIXED: PDFPageContent now properly uses localIndex prop
const PDFPageContent: React.FC<{
  data: any;
  isDark: boolean;
  globalIndex?: number;
  localIndex?: number;  // ✅ Added localIndex prop
  localTotal?: number;
}> = ({ data, isDark, globalIndex, localIndex, localTotal }) => {
  // 🆕 SnapshotManager 사용
  const { 
    contentRef: snapshotContentRef, 
    setActive, 
    capture, 
    isCapturing, 
    savedPath,
    error 
  } = useSnapshotManager();
  
  const contentRef = useRef<HTMLDivElement>(null);
  const headerImage = getHeaderImage(data);
  const textColor = isDark ? "#eee" : "#111";
  const HEADER_HEIGHT = 560;

  // ✅ Remove or comment out usePageFlip if not needed for other features
  // If you need it for 3D/flip features, keep it but don't use currentPageIndex for display
  const {
    currentPageIndex,
    isFlipping,
    flipDirection,
    flipProgress,
    windConfig,
    isWobble,
    handleFlipComplete,
  } = usePageFlip();

  // 🆕 이 페이지가 활성화되면 SnapshotManager에 등록
  useEffect(() => {
    setActive(true);
    return () => setActive(false);
  }, [setActive]);

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

  // 🆕 스크린샷 캡처 핸들러
  const handleCaptureScreenshot = useCallback(async () => {
    try {
      const result = await capture({
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      
      console.log('✅ Screenshot captured:', result.savedPath);
      
      if (result.savedPath) {
        console.log(`📸 Saved to: ${result.savedPath}`);
      }
    } catch (err) {
      console.error('❌ Failed to capture screenshot:', err);
    }
  }, [capture]);

  // Determine theme type based on category
  const getThemeType = () => {
    const category = data?.category;
    const NOTE_STYLE_CATEGORIES = [
      "network", "ai", "sqldb", "compiler", "embed", "discrete",
      "digitalelec", "os", "systems", "dsa", "cpp", "oop", "se",
      "security", "mt_concurrency", "graphics_pipeline", "unreal",
      "digitalTwin", "gameMath"
    ];
    const LETTER_STYLE_CATEGORIES = ["french"];
    
    if (!category) return 'default';
    
    if (LETTER_STYLE_CATEGORIES.includes(category.trim())) {
      return 'letter';
    }
    if (NOTE_STYLE_CATEGORIES.includes(category.trim())) {
      return 'note';
    }
    return 'default';
  };

  const themeType = getThemeType();

  const renderPageContent = () => {
    return (
      <ThemeProvider theme={themeType}>
        <div style={pageStyle}>
          {/* 🆕 Elegant Screenshot Button - Top Right */}
          <div
            style={{
              position: "absolute",
              top: 66,
              right: 160,
              zIndex: 9999,
              pointerEvents: "auto",
              display: "flex",
              gap: "8px",
            }}
          >
            <button
              onClick={handleCaptureScreenshot}
              disabled={isCapturing}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                // ✅ FIXED: Remove duplicate background, use single backgroundColor
                backgroundColor: isDark 
                  ? "rgba(255,255,255,0.04)" 
                  : "rgba(255,255,255,0.5)",
                color: isDark ? "#c0c0c0" : "#6b6b6b",
                border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.1)",
                borderRadius: "8px",
                cursor: isCapturing ? "default" : "pointer",
                fontSize: "13px",
                fontWeight: 400,
                letterSpacing: "0.3px",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                backdropFilter: "blur(8px)",
                boxShadow: isDark
                  ? "0 1px 3px rgba(0,0,0,0.2)"
                  : "0 1px 3px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={(e) => {
                if (!isCapturing) {
                  e.currentTarget.style.backgroundColor = isDark 
                    ? "rgba(255,255,255,0.08)" 
                    : "rgba(0,0,0,0.04)";
                  e.currentTarget.style.borderColor = isDark 
                    ? "rgba(255,255,255,0.25)" 
                    : "rgba(0,0,0,0.2)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = isDark
                    ? "0 4px 12px rgba(0,0,0,0.3)"
                    : "0 4px 12px rgba(0,0,0,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isCapturing) {
                  e.currentTarget.style.backgroundColor = isDark 
                    ? "rgba(255,255,255,0.04)" 
                    : "rgba(255,255,255,0.5)";
                  e.currentTarget.style.borderColor = isDark 
                    ? "rgba(255,255,255,0.12)" 
                    : "rgba(0,0,0,0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = isDark
                    ? "0 1px 3px rgba(0,0,0,0.2)"
                    : "0 1px 3px rgba(0,0,0,0.05)";
                }
              }}
            >
              <span style={{ 
                fontSize: "16px", 
                opacity: 0.6,
                filter: isDark ? "brightness(0.8)" : "none"
              }}>
                {isCapturing ? "⏳" : "📷"}
              </span>
              <span style={{ 
                opacity: isCapturing ? 0.5 : 0.7,
                fontVariantNumeric: "tabular-nums"
              }}>
                {isCapturing ? "Capturing..." : "Capture"}
              </span>
            </button>
          </div>

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

          {/* ✅ FIXED: Pass localIndex directly instead of currentPageIndex */}
          <PDFPageHeader
            data={data}
            isDark={isDark}
            headerImage={headerImage}
            globalIndex={globalIndex}
            localIndex={localIndex}  // ✅ Use localIndex prop
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
                ref={snapshotContentRef}
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

          {/* 🆕 저장 완료 토스트 메시지 */}
          {savedPath && (
            <div
              style={{
                position: "fixed",
                bottom: "30px",
                right: "30px",
                background: isDark ? "rgba(40,40,40,0.92)" : "rgba(255,255,255,0.92)",
                color: isDark ? "#4CAF50" : "#2e7d32",
                padding: "14px 24px",
                borderRadius: "10px",
                zIndex: 99999,
                fontSize: "14px",
                fontFamily: "monospace",
                boxShadow: isDark
                  ? "0 4px 20px rgba(0,0,0,0.4)"
                  : "0 4px 20px rgba(0,0,0,0.1)",
                animation: "slideIn 0.3s ease-out",
                backdropFilter: "blur(10px)",
                border: isDark
                  ? "1px solid rgba(76, 175, 80, 0.2)"
                  : "1px solid rgba(46, 125, 50, 0.15)",
                maxWidth: "400px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>✅</span>
                <div>
                  <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                    Screenshot Saved
                  </div>
                  <div style={{ 
                    fontSize: "12px", 
                    color: isDark ? "#999" : "#666",
                    wordBreak: "break-all"
                  }}>
                    {savedPath}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 🆕 에러 메시지 */}
          {error && (
            <div
              style={{
                position: "fixed",
                bottom: "30px",
                right: "30px",
                background: isDark ? "rgba(40,40,40,0.92)" : "rgba(255,255,255,0.92)",
                color: "#f44336",
                padding: "14px 24px",
                borderRadius: "10px",
                zIndex: 99999,
                fontSize: "14px",
                boxShadow: isDark
                  ? "0 4px 20px rgba(0,0,0,0.4)"
                  : "0 4px 20px rgba(0,0,0,0.1)",
                animation: "slideIn 0.3s ease-out",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(244, 67, 54, 0.15)",
                maxWidth: "400px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>❌</span>
                <div>
                  <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                    Capture Failed
                  </div>
                  <div style={{ 
                    fontSize: "12px", 
                    color: isDark ? "#999" : "#666"
                  }}>
                    {error.message || "An unknown error occurred."}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ThemeProvider>
    );
  };

  // 🆕 3D 종이 렌더링 (windConfig 전달)
  const renderWith3D = () => {
    if (isFlipping && isWobble) {
      return (
        <PaperWobble3D
          imagePath="/CurrentPage/currentpageCaptured.jpg"
          isActive={true}
          progress={flipProgress}
          direction={flipDirection}
          onFlipComplete={handleFlipComplete}
          windConfig={windConfig}
        />
      );
    }

    return renderPageContent();
  };

  return (
    <div>
      {/* ✅ FIXED: Use localIndex for scroll bar */}
      <PDFPageScrollBar
        isDark={isDark}
        totalPages={localTotal}
        currentPage={localIndex !== undefined ? localIndex + 1 : undefined}
      />
      <motion.div style={{ color: textColor }}>
        <ScrollWithKeyboardArrow />
        {renderWith3D()}
      </motion.div>
    </div>
  );
};

// 🔥 FIXED: Main component properly passes localIndex
export default function PDFPage({
  data,
  isActive = true,
  globalIndex,
  localIndex,  // ✅ This comes from parent
  localTotal,
}: Props) {
  const { mode } = useDarkMode();
  const isDark = mode === "dark";
  
  // 🆕 Wobble 상태 - 페이지 레벨에서 관리
  const [isWobble, setIsWobble] = useState(false);
  
  // 🆕 Wobble 토글 핸들러
  const handleWobbleToggle = useCallback(() => {
    setIsWobble(prev => !prev);
  }, []);

  return (
    <>
      <PageFlipController
        isDark={isDark}
        totalPages={localTotal || 1}
        isWobble={isWobble}
        onWobbleToggle={handleWobbleToggle}
      >
        {/* ✅ FIXED: Pass localIndex to PDFPageContent */}
        <PDFPageContent
          data={data}
          isDark={isDark}
          globalIndex={globalIndex}
          localIndex={localIndex}  // ✅ Pass localIndex through
          localTotal={localTotal}
        />
      </PageFlipController>
    </>
  );
}
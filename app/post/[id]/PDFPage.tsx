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

// 🆕 3D 종이 import
import PaperWobble3D from "@/app/components/papers/PaperWobble3D";
// 🆕 바람 설정 import
import { windConfigs, windConfigList, getWindConfig } from "@/app/data/windConfigs";
import type { WindConfig } from "@/app/data/windConfigs";

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

  // 🆕 플립 상태
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward'>('forward');
  const [currentPageIndex, setCurrentPageIndex] = useState(localIndex || 0);
  const [isWobble, setIsWobble] = useState(false);
  const [flipProgress, setFlipProgress] = useState(0);
  
  // 🆕 바람 설정 상태
  const [selectedWindId, setSelectedWindId] = useState('gentleBreeze');
  const [windConfig, setWindConfig] = useState<WindConfig>(windConfigs.gentleBreeze);

  // 🆕 바람 설정 변경 핸들러
  const handleWindConfigChange = useCallback((windId: string) => {
    setSelectedWindId(windId);
    setWindConfig(getWindConfig(windId));
  }, []);

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

  // 🆕 플립 핸들러
  const handleFlipForward = useCallback(() => {
    if (currentPageIndex < (localTotal || 1) - 1 && !isFlipping) {
      setFlipDirection('forward');
      setIsFlipping(true);
      setFlipProgress(0);
    }
  }, [currentPageIndex, localTotal, isFlipping]);

  const handleFlipBackward = useCallback(() => {
    if (currentPageIndex > 0 && !isFlipping) {
      setFlipDirection('backward');
      setIsFlipping(true);
      setFlipProgress(0);
    }
  }, [currentPageIndex, isFlipping]);

  const handleFlipComplete = useCallback(() => {
    const newIndex = flipDirection === 'forward' 
      ? Math.min(currentPageIndex + 1, (localTotal || 1) - 1)
      : Math.max(currentPageIndex - 1, 0);
    setCurrentPageIndex(newIndex);
    setIsFlipping(false);
    setFlipProgress(0);
  }, [flipDirection, currentPageIndex, localTotal]);

  // 🆕 플립 프로그레스 업데이트 (wobble 모드일 때 duration을 config에서 가져옴)
  useEffect(() => {
    if (!isFlipping) return;

    const startTime = performance.now();
    // 🔥 config에서 duration 가져오기
    const duration = isWobble ? (windConfig.flipDuration || 1200) : 600;

    const animate = (timestamp: number) => {
      const elapsed = (timestamp - startTime) / duration;
      const progress = Math.min(elapsed, 1);
      
      // easing
      const eased = progress < 0.5 
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      setFlipProgress(eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isFlipping, isWobble, windConfig]);

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
          localIndex={currentPageIndex}
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
          windConfig={windConfig} // 🔥 현재 선택된 바람 설정 전달
        />
      );
    }

    return renderPageContent();
  };

  return (
    <>
      <PDFPageScrollBar
        isDark={isDark}
        totalPages={localTotal}
        currentPage={currentPageIndex !== undefined ? currentPageIndex + 1 : undefined}
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
          gap: '10px',
          maxWidth: '280px',
        }}>
          {/* Wobble 체크박스 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            fontSize: '13px',
            color: isDark ? '#eee' : '#333',
          }}>
            <input
              type="checkbox"
              id="wobble-toggle"
              checked={isWobble}
              onChange={() => setIsWobble(!isWobble)}
              style={{
                width: '18px',
                height: '18px',
                cursor: 'pointer',
                accentColor: isDark ? '#666' : '#333',
              }}
            />
            <label htmlFor="wobble-toggle" style={{ cursor: 'pointer' }}>
              🌊 3D Wobble
            </label>
          </div>

          {/* 🆕 바람 설정 드롭다운 (wobble 활성화 시에만 표시) */}
          {isWobble && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px',
              background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              fontSize: '12px',
              color: isDark ? '#eee' : '#333',
            }}>
              <span style={{ fontSize: '11px', opacity: 0.7 }}>💨</span>
              <select
                value={selectedWindId}
                onChange={(e) => handleWindConfigChange(e.target.value)}
                style={{
                  flex: 1,
                  padding: '4px 8px',
                  background: 'transparent',
                  color: isDark ? '#eee' : '#333',
                  border: 'none',
                  fontSize: '12px',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {windConfigList.map((config) => (
                  <option key={config.id} value={config.id}>
                    {config.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleFlipBackward}
            disabled={currentPageIndex === 0 || isFlipping}
            style={{
              padding: '12px 20px',
              background: isDark ? '#444' : '#eee',
              color: isDark ? '#fff' : '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: currentPageIndex > 0 && !isFlipping ? 'pointer' : 'not-allowed',
              opacity: currentPageIndex > 0 && !isFlipping ? 1 : 0.5,
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            ◀ Previous
          </button>
          <button
            onClick={handleFlipForward}
            disabled={currentPageIndex === (localTotal || 1) - 1 || isFlipping}
            style={{
              padding: '12px 20px',
              background: isDark ? '#444' : '#eee',
              color: isDark ? '#fff' : '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: currentPageIndex < (localTotal || 1) - 1 && !isFlipping ? 'pointer' : 'not-allowed',
              opacity: currentPageIndex < (localTotal || 1) - 1 && !isFlipping ? 1 : 0.5,
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
            {currentPageIndex + 1} / {localTotal || 1}
            {isFlipping && ' 🔄'}
            {isWobble && ` 🌊 ${windConfig.name}`}
          </div>
        </div>

        <div>
          {renderWith3D()}
        </div>
      </motion.div>
    </>
  );
}
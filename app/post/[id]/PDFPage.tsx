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

// 🆕 리팩토링된 컨트롤러 import
import { PageFlipController, usePageFlip } from "./pageFlipController";

// 🆕 3D 종이 import
import PaperWobble3D from "@/app/components/papers/PaperWobble3D";

type Props = {
  data: any;
  isActive?: boolean;
  isStandalone?: boolean;
  globalIndex?: number;
  localIndex?: number;
  localTotal?: number;
};

const MemoMarkdownRendererCoordinator = React.memo(MarkdownRendererCoordinator);

// 🔥 수정: PDFPageContent를 PageFlipController의 자식으로 받도록 변경
const PDFPageContent: React.FC<{
  data: any;
  isDark: boolean;
  globalIndex?: number;
  localTotal?: number;
}> = ({ data, isDark, globalIndex, localTotal }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const headerImage = getHeaderImage(data);
  const textColor = isDark ? "#eee" : "#111";
  const HEADER_HEIGHT = 560;

  // 🔥 이제 usePageFlip을 안전하게 사용 가능 (PageFlipController 내부에서 렌더링됨)
  const {
    currentPageIndex,
    isFlipping,
    flipDirection,
    flipProgress,
    windConfig,
    isWobble,
    handleFlipComplete,
  } = usePageFlip();

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
          windConfig={windConfig}
        />
      );
    }

    return renderPageContent();
  };

  return (
    <div>
      <PDFPageScrollBar
        isDark={isDark}
        totalPages={localTotal}
        currentPage={currentPageIndex !== undefined ? currentPageIndex + 1 : undefined}
      />
      <motion.div style={{ color: textColor }}>
        <ScrollWithKeyboardArrow />
        {renderWith3D()}
      </motion.div>
    </div>
  );
};

// 🔥 수정: 메인 컴포넌트 - PageFlipController가 PDFPageContent를 감싸도록 함
export default function PDFPage({
  data,
  isActive = true,
  globalIndex,
  localIndex,
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
      {/* 🆕 PageFlipController가 PDFPageContent를 감싸도록 함 */}
      <PageFlipController
        isDark={isDark}
        totalPages={localTotal || 1}
        isWobble={isWobble}
        onWobbleToggle={handleWobbleToggle}
      >
        {/* 🔥 PDFPageContent를 children으로 전달 */}
        <PDFPageContent
          data={data}
          isDark={isDark}
          globalIndex={globalIndex}
          localTotal={localTotal}
        />
      </PageFlipController>
    </>
  );
}
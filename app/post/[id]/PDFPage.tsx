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

type Props = {
  data: any;

  isActive?: boolean;

  isStandalone?: boolean;

  globalIndex?: number;

  localIndex?: number;

  localTotal?: number;
};

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

  const textColor = isDark
    ? "#eee"
    : "#111";

  const HEADER_HEIGHT = 560;

  /*
    debug
  */

  console.log(
    "[PDF PAGE RECEIVED]",
    {
      title: data?.title,

      globalIndex,

      localIndex,

      localTotal,

      category:
        data?.category,

      category_slugs:
        data?.category_slugs,

      project_slugs:
        data?.project_slugs,

      tag_slugs:
        data?.tag_slugs,
    }
  );

  const pageStyle =
    React.useMemo(
      () => ({
        width: 860,

        margin: "40px auto",

        position:
          "relative" as const,

        background: isDark
          ? "rgba(60,60,60,0.6)"
          : "rgba(255,255,255,0.72)",

        paddingLeft: 64,

        paddingRight: 64,

        borderRadius: 12,

        overflow:
          "hidden" as const,

        boxShadow: isDark
          ? "0 8px 30px rgba(0,0,0,0.6)"
          : "0 8px 30px rgba(0,0,0,0.15)",
      }),
      [isDark]
    );

  /**
   * =========================
   * IMAGE RIGHT MARGIN FIX ONLY
   * =========================
   *
   * 기존 markdown 기능 절대 안건드림
   * 이미지 overflow만 수정
   */

  const mdComponents =
    React.useMemo(() => {
      return {
        ...markdownComponents,

        img: ({
          style,
          ...props
        }: any) => (
          <img
            {...props}
            style={{
              /**
               * 핵심:
               * 부모 width 넘지 못하게
               */

              maxWidth:
                "calc(100% - 24px)",

              /**
               * 기존 비율 유지
               */

              height: "auto",

              /**
               * 오른쪽 숨쉴공간
               */

              marginRight: 24,

              /**
               * 기존 스타일 유지
               */

              ...style,
            }}
          />
        ),
      };
    }, []);

  const CodeBlock =
    React.useMemo(
      () =>
        CodeBlockThemeCoordinator,
      []
    );

  const getVizComponent =
    React.useCallback(
      (key: string) =>
        visualizationRegistry[key],
      []
    );

  // =========================
  // PARSED CONTENT
  // =========================

  const parsedParts =
    useParsedPDFContent(
      data.content,
      getVizComponent
    );

  return (
    <motion.div
      style={{
        color: textColor,
      }}
    >
      {/* KEYBOARD SCROLL */}

      <ScrollWithKeyboardArrow />

      <div>
        <div style={pageStyle}>
          {/* =========================
              HEADER
          ========================= */}

          <PDFPageHeader
            data={data}
            isDark={isDark}
            headerImage={
              headerImage
            }
            globalIndex={
              globalIndex
            }
            localIndex={
              localIndex
            }
            localTotal={
              localTotal
            }
            headerHeight={
              HEADER_HEIGHT
            }
          />

          {/* =========================
              CONTENT
          ========================= */}

          <div
            style={{
              paddingTop:
                HEADER_HEIGHT - 36,
            }}
          >
            {/* =========================
                POSTAL METADATA ONLY
            ========================= */}

            <MetadataPostalCode
              data={data}
              isDark={isDark}
            />

            {/* =========================
                CONTENT FLOAT SPACER
            ========================= */}

            <div
              style={{
                float: "left",

                width: 165,

                height: 110,

                pointerEvents:
                  "none",
              }}
            />

            {/* =========================
                MARKDOWN CONTENT
            ========================= */}

            <div
              style={{
                marginTop: -2,
              }}
            >
              <NotepageLines>
                {parsedParts.map(
                  (item) => {
                    /**
                     * =========================
                     * VISUALIZATION BLOCK
                     * =========================
                     */

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

                    /**
                     * =========================
                     * DIFF BLOCK
                     * =========================
                     */

                    if (
                      item.kind ===
                      "diff"
                    ) {
                      return (
                        <DiffVisualizer
                          key={
                            item.key
                          }
                          raw={
                            item.content
                          }
                        />
                      );
                    }

                    /**
                     * =========================
                     * MARKDOWN BLOCK
                     * =========================
                     */

                    return (
                      <MemoMarkdownRendererCoordinator
                        key={
                          item.key
                        }
                        category={
                          data?.category
                        }
                        markdownComponents={
                          mdComponents
                        }
                        isDark={
                          isDark
                        }
                        CodeBlock={
                          CodeBlock
                        }
                      >
                        {
                          item.content
                        }
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

            {/* =========================
                GO TO TOP
            ========================= */}

            <GotoTheTop
              isDark={isDark}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
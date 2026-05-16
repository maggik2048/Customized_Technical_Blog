"use client";

import React from "react";

import { Cormorant_SC } from "next/font/google";

import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";

import "katex/dist/katex.min.css";

import { motion } from "framer-motion";

import PostAdminActions from "@/app/admin/PostAdminActions";

import { markdownComponents } from "@/lib/markdownComponents";
import { sciFiMarkdownComponents } from "@/app/components/Markdown/SciFiMarkdownComponents";

import { useDarkMode } from "@/app/context/DarkModeContext";

import { getHeaderImage } from "@/lib/getHeaderImage";

import { visualizationRegistry } from "@/lib/visualizationRegistry";

import NotepageLines from "@/app/components/markdown/NotepageLines";

import RemarkPageRenderer from "@/app/components/Markdown/remarkPageRenderer";

import CodeBlockWithCopy from "@/app/components/Markdown/CodeBlockWithCopy";

import MetadataPostalCode from "@/app/components/papers/MetadataPostalCode";

type Props = {
  data: any;
  isActive?: boolean;
  isStandalone?: boolean;
};

const cormorant = Cormorant_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function PDFPage({
  data,
  isActive = true,
}: Props) {
  const { mode } = useDarkMode();

  const isDark = mode === "dark";

  const headerImage = getHeaderImage(data);

  const textColor = isDark ? "#eee" : "#111";

  const HEADER_HEIGHT = 560;

  // =========================
  //  STYLE OBJECT MEMOIZATION (UI 0 CHANGE)
  // =========================

  const pageStyle = React.useMemo(
    () => ({
      width: 860,
      margin: "40px auto",
      position: "relative",
      background: isDark
        ? "rgba(60,60,60,0.6)"
        : "rgba(255,255,255,0.72)",
      paddingLeft: 64,
      paddingRight: 64,
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: isDark
        ? "0 8px 30px rgba(0,0,0,0.6)"
        : "0 8px 30px rgba(0,0,0,0.15)",
    }),
    [isDark]
  );

  const headerOverlayStyle = React.useMemo(
    () => ({
      position: "absolute" as const,
      inset: 0,
      background: isDark
        ? `
          linear-gradient(
            to bottom,
            rgba(0,0,0,0.82) 0%,
            rgba(0,0,0,0.38) 22%,
            rgba(0,0,0,0.08) 48%,
            rgba(20,20,20,0.22) 68%,
            rgba(30,30,30,0.82) 100%
          )
        `
        : `
          linear-gradient(
            to bottom,
            rgba(0,0,0,0.58) 0%,
            rgba(0,0,0,0.18) 24%,
            rgba(255,255,255,0) 68%,
            rgba(255,255,255,0.78) 95%,
            rgba(255,255,255,1) 100%
          )
        `,
    }),
    [isDark]
  );

  const headerWrapperStyle = React.useMemo(
    () => ({
      position: "absolute" as const,
      top: 0,
      left: 0,
      width: "100%",
      height: HEADER_HEIGHT,
      overflow: "hidden",
    }),
    []
  );

  const titleStyle = React.useMemo(
    () => ({
      position: "absolute" as const,
      bottom: 38,
      left: 48,
      right: 48,
      color: "#fff",
    }),
    []
  );

  const adminStyle = React.useMemo(
    () => ({
      position: "absolute" as const,
      top: 16,
      right: 40,
    }),
    []
  );

  const floatSpacerStyle = React.useMemo(
    () => ({
      float: "left" as const,
      width: 165,
      height: 110,
      pointerEvents: "none" as const,
    }),
    []
  );

  const clearFixStyle = React.useMemo(
    () => ({ clear: "both" as const }),
    []
  );

  // =========================
  // memoized renderer + registry (이전 최적화 유지)
  // =========================

  const MemoRemarkPageRenderer = React.useMemo(
    () => React.memo(RemarkPageRenderer),
    []
  );

  const mdComponents = React.useMemo(
    () => markdownComponents,
    []
  );

  const sciFiComponents = React.useMemo(
    () => sciFiMarkdownComponents,
    []
  );

  const CodeBlock = React.useMemo(
    () => CodeBlockWithCopy,
    []
  );

  const vizRegistryRef = React.useMemo(
    () => visualizationRegistry,
    []
  );

  const getVizComponent = React.useCallback(
    (key: string) => vizRegistryRef[key],
    [vizRegistryRef]
  );

  const parsedParts = React.useMemo(() => {
    const regex = /\[([A-Za-z_][A-Za-z0-9_]*)\]/g;

    const codeBlocks: string[] = [];

    const protectedContent = data.content.replace(
      /```[\s\S]*?```/g,
      (match: string) => {
        codeBlocks.push(match);
        return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
      }
    );

    const parts = protectedContent.split(regex);

    const restore = (text: string) =>
      text.replace(
        /__CODE_BLOCK_(\d+)__/g,
        (_, i) => codeBlocks[Number(i)]
      );

    return parts.map((part: string, i: number) => {
      const Component = getVizComponent(part);

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
    });
  }, [data.content, getVizComponent]);

  return (
    <motion.div style={{ color: textColor }}>
      <div>
        <div style={pageStyle}>
          {/* HEADER */}
          <div style={headerWrapperStyle}>
            <img
              src={headerImage}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center center",
                transform: "scale(1.02)",
              }}
            />

            <div style={headerOverlayStyle} />

            <div style={titleStyle}>
              <h1
                className={cormorant.className}
                style={{
                  fontSize: 42,
                  margin: 0,
                  lineHeight: 1.08,
                  letterSpacing: "0.02em",
                  textShadow: "0 3px 18px rgba(0,0,0,0.5)",
                }}
              >
                {data.title}
              </h1>
            </div>

            <div style={adminStyle}>
              <PostAdminActions postId={data.id} />
            </div>
          </div>

          {/* CONTENT */}
          <div
            style={{
              paddingTop: HEADER_HEIGHT - 36,
            }}
          >
            <MetadataPostalCode
              data={data}
              isDark={isDark}
            />

            <div style={floatSpacerStyle} />

            <div style={{ marginTop: -2 }}>
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

                  return (
                    <MemoRemarkPageRenderer
                      key={item.key}
                      markdownComponents={mdComponents}
                      sciFiMarkdownComponents={sciFiComponents}
                      isDark={isDark}
                      CodeBlock={CodeBlock}
                    >
                      {item.content}
                    </MemoRemarkPageRenderer>
                  );
                })}
              </NotepageLines>
            </div>

            <div style={clearFixStyle} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
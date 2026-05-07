"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";

export default function RemarkPageRenderer({
  children,
  markdownComponents,
  sciFiMarkdownComponents,
  isDark,
  CodeBlock,
}: any) {

  /* =========================
     🎨 TYPOGRAPHY SYSTEM
  ========================= */

  // 🪨 h1 = engraved metal (가장 무겁고 깊은 느낌)
  const goldEngraved = {
    background: "linear-gradient(135deg, #3a2f12, #6b510f, #2b220c)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "0.03em",
    textShadow: `
      0 1px 0 rgba(255,255,255,0.4),
      0 2px 2px rgba(0,0,0,0.35),
      0 4px 8px rgba(0,0,0,0.25)
    `,
  };

  // 🪙 h2 = gold foil (luxury + flat but rich)
  const goldFoil = {
    background: "linear-gradient(90deg, #f6d36b, #d4a84f, #9e7c27)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "0.02em",
    textShadow: `
      0 1px 0 rgba(255,255,255,0.55),
      0 2px 6px rgba(0,0,0,0.18)
    `,
  };

  // ✨ h3 = glow gold (lighter, more alive)
  const goldGlow = {
    background: "linear-gradient(135deg, #ffe9a3, #f2c14e, #b8892d)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "0.03em",
    filter: "brightness(1.25) saturate(1.3)",
    textShadow: "0 0 8px rgba(212,168,79,0.25)",
  };

  /* =========================
     📦 LUXURY BOX (LISTS)
  ========================= */

  const luxuryWhiteBox = {
    position: "relative",
    background:
      "linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(246,243,238,0.92) 60%, rgba(246,243,238,0.35) 85%, rgba(246,243,238,0) 100%)",
    border: "1px solid rgba(212,168,79,0.25)",
    boxShadow: `
      0 6px 20px rgba(0,0,0,0.08),
      inset 0 1px 0 rgba(255,255,255,0.8)
    `,
    borderRadius: 14,
    WebkitMaskImage:
      "linear-gradient(to right, black 70%, transparent 100%)",
    maskImage:
      "linear-gradient(to right, black 70%, transparent 100%)",
  };

  /* =========================
     🧠 HEADINGS
  ========================= */

  const renderHeading = (level: number) => ({ children }: any) => {
    const sizeMap: any = {
      1: 30,
      2: 22,
      3: 18,
    };

    /* ---------- H2 (full bleed gold foil) ---------- */
    if (level === 2) {
      return (
        <div
          style={{
            marginLeft: -64,
            width: "calc(100% + 64px)",
            marginTop: 28,
            marginBottom: 12,
            paddingLeft: 14,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 3,
              borderRadius: 2,
              background: "linear-gradient(to bottom, #f6d36b, #d4a84f)",
            }}
          />

          <div
            style={{
              fontSize: sizeMap[2],
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            <span style={goldFoil}>{children}</span>
          </div>
        </div>
      );
    }

    /* ---------- H3 (glow gold) ---------- */
    if (level === 3) {
      return (
        <div
          style={{
            margin: "20px 0 10px",
            position: "relative",
            paddingLeft: 14,
            opacity: 0.95,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 3,
              borderRadius: 2,
              background: "linear-gradient(to bottom, #ffe9a3, #f2c14e)",
            }}
          />

          <div
            style={{
              fontSize: sizeMap[3],
              fontWeight: 600,
            }}
          >
            <span style={goldGlow}>{children}</span>
          </div>
        </div>
      );
    }

    /* ---------- H1 (engraved metal) ---------- */
    return (
      <div style={{ margin: "36px 0 18px" }}>
        <div
          style={{
            fontSize: sizeMap[1],
            fontWeight: 800,
          }}
        >
          <span style={goldEngraved}>{children}</span>
        </div>
      </div>
    );
  };

  /* =========================
     🧾 MARKDOWN CONFIG
  ========================= */

  const markdownProps = {
    remarkPlugins: [remarkMath, remarkGfm],
    rehypePlugins: [rehypeKatex, rehypeRaw],

    components: {
      ...markdownComponents,
      ...(isDark ? sciFiMarkdownComponents : {}),

      code: CodeBlock,

      h1: renderHeading(1),
      h2: renderHeading(2),
      h3: renderHeading(3),

      p: ({ children }: any) => (
        <p
          style={{
            wordBreak: "keep-all",
            overflowWrap: "normal",
            lineHeight: 1.65,
            margin: "6px 0",
            color: "#222",
          }}
        >
          {children}
        </p>
      ),

      ul: ({ children }: any) => (
        <div style={{ margin: "12px 0", marginLeft: 20, padding: "10px 16px", minWidth: "260px", ...luxuryWhiteBox }}>
          <ul style={{ margin: 0, paddingLeft: 18 }}>{children}</ul>
        </div>
      ),

      ol: ({ children }: any) => (
        <div style={{ margin: "12px 0", marginLeft: 20, padding: "10px 16px", minWidth: "260px", ...luxuryWhiteBox }}>
          <ol style={{ margin: 0, paddingLeft: 18 }}>{children}</ol>
        </div>
      ),

      li: ({ children }: any) => (
        <li style={{ marginBottom: 4, lineHeight: 1.6, color: "#333" }}>
          <span style={{ color: "#d4a84f", marginRight: 6, fontWeight: 700 }}>
            •
          </span>
          {children}
        </li>
      ),
    },
  };

  return <ReactMarkdown {...markdownProps}>{children}</ReactMarkdown>;
}
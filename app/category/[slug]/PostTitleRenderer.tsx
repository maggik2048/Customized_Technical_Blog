"use client";

import React from "react";

import { Cormorant_SC } from "next/font/google";

const cormorant = Cormorant_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function PostTitleRenderer({
  text,
  highlight,
  isSimple,
}: {
  text: string;
  highlight?: string;
  isSimple?: boolean;
}) {
  if (!text) return null;

  /**
   * dark academia + laboratory metal + luxury graphite
   */

  const highlightColor = isSimple
    ? "rgba(25,25,25,0.95)"
    : "#ffe066";

  const highlightShadow = isSimple
    ? `
      0 1px 2px rgba(255,255,255,0.15),
      0 1px 4px rgba(0,0,0,0.08)
    `
    : `
      0 0 10px rgba(255,224,102,0.45),
      0 0 22px rgba(255,224,102,0.18),
      0 2px 8px rgba(0,0,0,0.45)
    `;

  const COLORS = {
    // 기본 메인 텍스트
    base: isSimple
      ? "rgba(20,20,20,0.92)"
      : "#F3F4F6",

    // "="
    equal: "#ffca0a",

    // "=" 이후
    afterEqual: "#ffb74b",

    // "::"
    doubleColon: "#e1ff00",

    // "::" 이후
    afterDoubleColon: isSimple
      ? "rgba(45,45,45,0.88)"
      : "#c1b7a9",

    // vs
    vs: "#ffaf7a",

    // ( ... )
    parentheses: isSimple
      ? "rgba(35,35,35,0.82)"
      : "#bfd2ff",
  };

  /**
   * SEARCH HIGHLIGHT
   */
  const renderHighlightedSegment = (
    value: string,
    color: string,
    key: string
  ) => {
    if (!highlight?.trim()) {
      return renderStyledText(
        value,
        color,
        key
      );
    }

    const escaped = highlight.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(
      `(${escaped})`,
      "gi"
    );

    const split = value.split(regex);

    return split.map((part, idx) => {
      if (!part) return null;

      const matched =
        part.toLowerCase() ===
        highlight.toLowerCase();

      if (!matched) {
        return (
          <React.Fragment
            key={`${key}-${idx}`}
          >
            {renderStyledText(
              part,
              color,
              `${key}-${idx}`
            )}
          </React.Fragment>
        );
      }

      return (
        <span
          key={`${key}-${idx}`}
          style={{
            color: highlightColor,

            fontWeight: 700,

            textShadow:
              highlightShadow,
          }}
        >
          {renderStyledText(
            part,
            highlightColor,
            `${key}-${idx}-highlight`
          )}
        </span>
      );
    });
  };

  const equalSplit = text.split(/(=)/g);

  let isAfterEqual = false;
  let isAfterDoubleColon = false;

  /**
   * 영어만 약간 크게
   */
  const renderStyledText = (
    value: string,
    color: string,
    key: string
  ) => {
    const segments = value.split(
      /([A-Za-z0-9\s]+)/g
    );

    return segments.map(
      (seg, idx) => {
        if (!seg) return null;

        const isEnglish =
          /[A-Za-z]/.test(seg);

        return (
          <span
            key={`${key}-${idx}`}
            style={{
              color,

              // 영어만 확대
              fontSize: isEnglish
                ? "1.28em"
                : "1em",

              // optical balance
              fontWeight: isEnglish
                ? 560
                : 520,

              position: "relative",

              top: isEnglish
                ? "0.02em"
                : "0",

              display: "inline-block",

              textShadow: isSimple
                ? `
                  0 1px 1px rgba(255,255,255,0.15),
                  0 1px 3px rgba(0,0,0,0.10)
                `
                : `
                  0 1px 2px rgba(0,0,0,0.45),
                  0 3px 8px rgba(0,0,0,0.30)
                `,
            }}
          >
            {seg}
          </span>
        );
      }
    );
  };

  return (
    <span
      className={cormorant.className}
      style={{
        fontSize: 16,

        lineHeight: 1.18,

        letterSpacing: "0.015em",

        fontWeight: 520,

        fontFamily: `
          ${cormorant.style.fontFamily},
          "Pretendard",
          "Noto Sans KR",
          serif
        `,

        textShadow: isSimple
          ? `
            0 1px 1px rgba(255,255,255,0.12),
            0 1px 3px rgba(0,0,0,0.08)
          `
          : `
            0 1px 2px rgba(0,0,0,0.50),
            0 3px 8px rgba(0,0,0,0.35)
          `,

        WebkitFontSmoothing:
          "antialiased",

        MozOsxFontSmoothing:
          "grayscale",

        textRendering:
          "optimizeLegibility",
      }}
    >
      {equalSplit.map((chunk, i) => {
        if (!chunk) return null;

        // "="
        if (chunk === "=") {
          isAfterEqual = true;

          return (
            <span
              key={i}
              style={{
                color: COLORS.equal,

                fontWeight: 650,

                textShadow: `
                  0 0 8px rgba(255,202,10,0.25),
                  0 2px 6px rgba(0,0,0,0.45)
                `,
              }}
            >
              {chunk}
            </span>
          );
        }

        const parts = chunk.split(
          /(\(.*?\)|::|vs)/g
        );

        return parts.map((part, j) => {
          if (!part) return null;

          // ::
          if (part === "::") {
            isAfterDoubleColon = true;

            return (
              <span
                key={`${i}-${j}`}
                style={{
                  color:
                    COLORS.doubleColon,

                  fontWeight: 700,

                  textShadow: `
                    0 0 10px rgba(225,255,0,0.25),
                    0 2px 8px rgba(0,0,0,0.45)
                  `,
                }}
              >
                {part}
              </span>
            );
          }

          // vs
          if (part === "vs") {
            return (
              <span
                key={`${i}-${j}`}
                style={{
                  color: COLORS.vs,

                  fontWeight: 700,

                  textShadow: `
                    0 0 8px rgba(255,175,122,0.22),
                    0 2px 6px rgba(0,0,0,0.4)
                  `,
                }}
              >
                {part}
              </span>
            );
          }

          // ( ... )
          if (
            part.startsWith("(") &&
            part.endsWith(")")
          ) {
            return (
              <span
                key={`${i}-${j}`}
                style={{
                  color:
                    COLORS.parentheses,

                  textShadow: `
                    0 1px 4px rgba(0,0,0,0.35)
                  `,
                }}
              >
                {renderHighlightedSegment(
                  part,
                  COLORS.parentheses,
                  `${i}-${j}`
                )}
              </span>
            );
          }

          // 기본 텍스트
          let color = COLORS.base;

          if (isAfterDoubleColon) {
            color =
              COLORS.afterDoubleColon;
          } else if (isAfterEqual) {
            color =
              COLORS.afterEqual;
          }

          return (
            <React.Fragment
              key={`${i}-${j}`}
            >
              {renderHighlightedSegment(
                part,
                color,
                `${i}-${j}`
              )}
            </React.Fragment>
          );
        });
      })}
    </span>
  );
}
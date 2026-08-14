"use client";

import React from "react";

// ❌ REMOVED THIS LINE:
// import { Cormorant_SC } from "next/font/google";

// ❌ REMOVED THIS BLOCK:
// const cormorant = Cormorant_SC({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

export default function PostTitleRenderer({
  text,
  highlight,
}: {
  text: string;
  highlight?: string;
}) {
  if (!text) return null;

  /**
   * FORCE CINEMATIC WHITE TYPOGRAPHY
   *
   * 핵심 수정:
   * - inline-block 제거
   * - inheritance 차단
   * - ellipsis flattening 대응
   * - root color 강제
   */

  const COLORS = {
    base: "#F3F4F6",

    equal: "#ffca0a",

    afterEqual: "#ffb74b",

    doubleColon: "#e1ff00",

    afterDoubleColon: "#c1b7a9",

    vs: "#ffaf7a",

    parentheses: "#bfd2ff",

    highlight: "#ffe066",
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
            color: COLORS.highlight,

            fontWeight: 700,

            textShadow: `
              0 0 10px rgba(255,224,102,0.45),
              0 0 22px rgba(255,224,102,0.18),
              0 2px 8px rgba(0,0,0,0.45)
            `,
          }}
        >
          {renderStyledText(
            part,
            COLORS.highlight,
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
   * TYPOGRAPHY RENDER
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

              fontSize: isEnglish
                ? "1.28em"
                : "1em",

              fontWeight: isEnglish
                ? 560
                : 520,

              position: "relative",

              top: isEnglish
                ? "0.02em"
                : "0",

              /**
               * 핵심 수정
               * inline-block 제거
               */
              display: "inline",

              /**
               * 강제 white 유지
               */
              isolation: "isolate",

              textShadow: `
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
      // ✅ CHANGED THIS LINE:
      // FROM: className={cormorant.className}
      // TO: className="font-cormorant-sc"
      className="font-cormorant-sc"
      style={{
        /**
         * 핵심 수정
         * 부모 inheritance 차단
         */
        color: "#F3F4F6",

        isolation: "isolate",

        fontSize: 16,

        lineHeight: 1.18,

        letterSpacing: "0.015em",

        fontWeight: 520,

        // ✅ CHANGED THIS LINE:
        // FROM: fontFamily: `${cormorant.style.fontFamily}, "Pretendard", "Noto Sans KR", serif`
        // TO: fontFamily: `'Cormorant SC', "Pretendard", "Noto Sans KR", serif`
        fontFamily: `
          'Cormorant SC',
          "Pretendard",
          "Noto Sans KR",
          serif
        `,

        textShadow: `
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

        /**
         * "="
         */
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

          /**
           * ::
           */
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

          /**
           * vs
           */
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

          /**
           * ( ... )
           */
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

          /**
           * 기본 텍스트
           */
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
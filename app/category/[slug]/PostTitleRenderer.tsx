"use client";

import React from "react";

import { Cormorant_SC } from "next/font/google";

const cormorant = Cormorant_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function PostTitleRenderer({
  text,
}: {
  text: string;
}) {
  if (!text) return null;

  /**
   * dark academia + laboratory metal + luxury graphite
   */

  const COLORS = {
    // 기본 메인 텍스트
    base: "#F3F4F6",

    // "="
    equal: "#ffca0a",

    // "=" 이후
    afterEqual: "#ffb74b",

    // "::"
    doubleColon: "#e1ff00",

    // "::" 이후
    afterDoubleColon: "#c1b7a9",

    // vs
    vs: "#ffaf7a",

    // ( ... )
    parentheses: "#bfd2ff",
  };

  const equalSplit = text.split(/(=)/g);

  let isAfterEqual = false;
  let isAfterDoubleColon = false;

  return (
    <span
      className={cormorant.className}
      style={{
        letterSpacing: "0.02em",
        fontSize: 16,
        lineHeight: 1.15,
        fontWeight: 600,
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
              }}
            >
              {chunk}
            </span>
          );
        }

        const parts = chunk.split(/(\(.*?\)|::|vs)/g);

        return parts.map((part, j) => {
          if (!part) return null;

          // ::
          if (part === "::") {
            isAfterDoubleColon = true;

            return (
              <span
                key={`${i}-${j}`}
                style={{
                  color: COLORS.doubleColon,
                  fontWeight: 700,
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
                  color: COLORS.parentheses,
                }}
              >
                {part}
              </span>
            );
          }

          // 기본 텍스트
          let color = COLORS.base;

          if (isAfterDoubleColon) {
            color = COLORS.afterDoubleColon;
          } else if (isAfterEqual) {
            color = COLORS.afterEqual;
          }

          return (
            <span
              key={`${i}-${j}`}
              style={{
                color,
              }}
            >
              {part}
            </span>
          );
        });
      })}
    </span>
  );
}
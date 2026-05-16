"use client";

import React from "react";

export default function PostTitleRenderer({
  text,
}: {
  text: string;
}) {
  if (!text) return null;

  /**
   * New palette:
   *
   * 전체적으로:
   * dark academia + laboratory metal + luxury graphite 느낌
   *
   * 기존의 파랑/주황 제거
   * -> graphite / silver / titanium / muted wine / pale platinum 계열
   */

  const COLORS = {
    // 기본 메인 텍스트
    base: "#F3F4F6",

    // "="
    equal: "#8F8A7A", // titanium bronze

    // "=" 이후
    afterEqual: "#D8D4C8", // warm platinum

    // "::"
    doubleColon: "#6F7278", // graphite steel

    // "::" 이후
    afterDoubleColon: "#B7BDC7", // cold silver

    // vs
    vs: "#7C5A64", // muted luxury wine

    // ( ... )
    parentheses: "#A8A39A", // soft ash beige
  };

  const equalSplit = text.split(/(=)/g);

  let isAfterEqual = false;
  let isAfterDoubleColon = false;

  return (
    <>
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
          if (part.startsWith("(") && part.endsWith(")")) {
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
    </>
  );
}
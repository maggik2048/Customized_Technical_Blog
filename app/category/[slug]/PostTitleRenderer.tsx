"use client";

import React from "react";

export default function PostTitleRenderer({ text }: { text: string }) {
  if (!text) return null;

  const equalSplit = text.split(/(=)/g);

  let isAfterEqual = false;
  let isAfterDoubleColon = false;

  return (
    <>
      {equalSplit.map((chunk, i) => {
        if (!chunk) return null;

        // "=" 처리
        if (chunk === "=") {
          isAfterEqual = true;
          return (
            <span key={i} style={{ color: "#ffb020", fontWeight: 600 }}>
              {chunk}
            </span>
          );
        }

        // "::" 기준 2차 split
        const parts = chunk.split(/(\(.*?\)|::|vs)/g);

        return parts.map((part, j) => {
          if (!part) return null;

          // :: 토큰 감지
          if (part === "::") {
            isAfterDoubleColon = true;
            return (
              <span
                key={`${i}-${j}`}
                style={{ color: "#ff9f1a", fontWeight: 600 }}
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
                style={{ color: "#ff3b3b", fontWeight: 700 }}
              >
                {part}
              </span>
            );
          }

          // ( ... )
          if (part.startsWith("(") && part.endsWith(")")) {
            return (
              <span key={`${i}-${j}`} style={{ color: "#ffe08a" }}>
                {part}
              </span>
            );
          }

          // 일반 텍스트 (컨텍스트 기반 스타일)
          let color = "#ffffff";

          if (isAfterDoubleColon) {
            color = "#8fd3ff"; // 아주 연한 하늘색
          } else if (isAfterEqual) {
            color = "#fff1b8"; // 아주 연한 노랑
          }

          return (
            <span key={`${i}-${j}`} style={{ color }}>
              {part}
            </span>
          );
        });
      })}
    </>
  );
}
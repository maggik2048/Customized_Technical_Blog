"use client";

import React from "react";

function CurlyBracket({
  side,
  visible,
  isSimple,
}: {
  side: "left" | "right";
  visible: boolean;
  isSimple?: boolean;
}) {
  const isLeft =
    side === "left";

  return (
    <div
      style={{
        position: "absolute",

        top: "50%",

        [isLeft
          ? "left"
          : "right"]: -24,

        width: 34,
        height: "82%",

        transform: visible
          ? `translateY(-50%) translateX(0px) scale(1)`
          : `translateY(-50%) translateX(${
              isLeft
                ? "-8px"
                : "8px"
            }) scale(0.96)`,

        opacity: visible
          ? 1
          : 0,

        transition: `
          opacity 0.28s ease,
          transform 0.42s cubic-bezier(0.22,1,0.36,1)
        `,

        pointerEvents: "none",

        zIndex: 40,

        filter: !isSimple
          ? `
            drop-shadow(0 0 10px rgba(255,255,255,0.08))
            drop-shadow(0 0 24px rgba(255,255,255,0.06))
          `
          : "none",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 40 200"
        preserveAspectRatio="none"
        style={{
          overflow: "visible",
        }}
      >
        <path
          d={
            isLeft
              ? `
                M34 0
                C12 0, 12 32, 12 52
                C12 72, 2 78, 2 100
                C2 122, 12 128, 12 148
                C12 168, 12 200, 34 200
              `
              : `
                M6 0
                C28 0, 28 32, 28 52
                C28 72, 38 78, 38 100
                C38 122, 28 128, 28 148
                C28 168, 28 200, 6 200
              `
          }
          fill="none"
          stroke={
            isSimple
              ? "rgba(255,255,255,0.92)"
              : "rgba(255,255,255,0.97)"
          }
          strokeWidth="1.8"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* subtle inner glow */}
        <path
          d={
            isLeft
              ? `
                M34 0
                C12 0, 12 32, 12 52
                C12 72, 2 78, 2 100
                C2 122, 12 128, 12 148
                C12 168, 12 200, 34 200
              `
              : `
                M6 0
                C28 0, 28 32, 28 52
                C28 72, 38 78, 38 100
                C38 122, 28 128, 28 148
                C28 168, 28 200, 6 200
              `
          }
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity={0.28}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

export default function CategoryPostBoxHoverRenderer({
  visible,
  isSimple,
}: {
  visible: boolean;
  isSimple?: boolean;
}) {
  return (
    <>
      <CurlyBracket
        side="left"
        visible={visible}
        isSimple={isSimple}
      />

      <CurlyBracket
        side="right"
        visible={visible}
        isSimple={isSimple}
      />
    </>
  );
}
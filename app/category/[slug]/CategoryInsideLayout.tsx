"use client";

import React from "react";

export default function CategoryInsideLayout({
  left,
  right,
}: {
  left: React.ReactNode;

  right: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",

        flexDirection: "row",

        gap: 24,

        width: "100%",

        justifyContent: "flex-start",

        alignItems: "flex-start",
      }}
    >
      {/* LEFT */}
      <div
        style={{
          width: 780,
          maxWidth: 780,

          flexShrink: 0,

          display: "flex",
          flexDirection: "column",

          gap: 16,

          transform: "translateX(270px)",
        }}
      >
        {left}
      </div>

      {/* RIGHT */}
      {right}
    </div>
  );
}
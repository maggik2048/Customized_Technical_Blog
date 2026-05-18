"use client";

import React from "react";
import SearchBarButton from "./SearchBarButton";

export default function CategoryInsideLayout({
  left,
  right,
  onSearch,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  onSearch?: (value: string) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      {/* TOP CENTER SEARCH BAR (독립 레이어) */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "12px 0",
        }}
      >
        <SearchBarButton onSearch={onSearch} />
      </div>

      {/* MAIN CONTENT ROW */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 24,
          width: "100%",
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
        <div style={{ flexShrink: 0 }}>
          {right}
        </div>
      </div>
    </div>
  );
}
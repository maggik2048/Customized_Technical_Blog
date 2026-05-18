"use client";

import React, { useState } from "react";

type Props = {
  onSearch?: (value: string) => void;
  onFilterClick?: () => void;
};

export default function SearchBarButton({
  onSearch,
  onFilterClick,
}: Props) {
  const [value, setValue] = useState("");

  const handleSearch = () => {
    onSearch?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  // unified outline magnifier (single source of truth)
  const Magnifier = ({ size = 18 }: { size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
        stroke="white"
        strokeWidth="1.6"
      />
      <line
        x1="16.5"
        y1="16.5"
        x2="21"
        y2="21"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",

        width: "100%",
        maxWidth: 560,

        padding: "12px 16px",

        background:
          "linear-gradient(to bottom, rgba(255,255,255,0.18), rgba(255,255,255,0.62))",

        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",

        border: "1px solid rgba(0, 0, 0, 0.06)",
        borderRadius: 999,
      }}
    >
      {/* LEFT Σ + MAGNIFIER (larger) */}
      <div
        style={{
          position: "absolute",
          left: -62,
          top: "50%",
          transform: "translateY(-50%)",

          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={handleSearch}
      >
        <span
          style={{
            fontSize: 52,
            fontWeight: 200,

            fontFamily:
              '"STIX Two Math", "Cambria Math", "Times New Roman", serif',

            color: "rgba(255,255,255,0.92)",

            lineHeight: 1,

            textShadow: `
              0 0 14px rgba(255,255,255,0.25),
              0 3px 16px rgba(0,0,0,0.28)
            `,
          }}
        >
          Σ
        </span>

        <span
          style={{
            position: "absolute",
            right: -18,
            bottom: -2,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Magnifier size={16} />
        </span>
      </div>

      {/* INPUT */}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        style={{
          flex: 1,

          marginLeft: 80,
          marginRight: 140,

          height: 38,

          border: "none",
          outline: "none",
          background: "transparent",

          fontSize: 14,
          letterSpacing: "0.2px",

          fontFamily:
            "ui-serif, Georgia, 'Times New Roman', Times, serif",

          color: "#1a1a1a",
        }}
      />

      {/* SEARCH BUTTON (unified icon) */}
      <button
        onClick={handleSearch}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,

          height: 34,
          padding: "0 14px",

          borderRadius: 999,
          border: "1px solid rgba(0, 0, 0, 0.08)",

          background: "rgba(0,0,0,0.04)",

          color: "rgba(0,0,0,0.7)",

          fontSize: 12,

          cursor: "pointer",

          fontFamily:
            "ui-serif, Georgia, 'Times New Roman', Times, serif",

          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.07)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.04)";
        }}
      >
        <span style={{ display: "flex", alignItems: "center" }}>
          <Magnifier size={14} />
        </span>
        Search
      </button>

      {/* FILTER */}
      <span
        onClick={onFilterClick}
        style={{
          position: "absolute",
          right: -62,
          top: "50%",
          transform: "translateY(-50%)",

          fontSize: 12,
          letterSpacing: "0.18em",

          fontFamily:
            "ui-serif, Georgia, 'Times New Roman', Times, serif",

          color: "rgba(255,255,255,0.9)",

          cursor: "pointer",
          userSelect: "none",

          textShadow: `
            0 0 10px rgba(255,255,255,0.25),
            0 2px 10px rgba(0,0,0,0.25)
          `,

          transition: "all 0.25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform =
            "translateY(-50%) scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform =
            "translateY(-50%) scale(1)";
        }}
      >
        FILTER
      </span>
    </div>
  );
}
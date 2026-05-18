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

  const Magnifier = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="1.6" />
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

        padding: "6px 14px",

        background:
          "linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.42))",

        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",

        border: "1px solid rgba(0, 0, 0, 0.05)",
        borderRadius: 999,
      }}
    >
      {/* LEFT Σ + HARD SHADOW MAGNIFIER */}
      <div
        style={{
          position: "absolute",
          left: -48,
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={handleSearch}
      >
        {/* Σ (unchanged soft glow) */}
        <span
          style={{
            fontSize: 60,
            fontWeight: 200,

            fontFamily:
              '"STIX Two Math", "Cambria Math", "Times New Roman", serif',

            color: "rgba(255,255,255,0.92)",

            lineHeight: 1,

            textShadow: `
              0 0 18px rgba(255,255,255,0.28),
              0 6px 18px rgba(0,0,0,0.45),
              0 2px 6px rgba(0,0,0,0.25)
            `,
          }}
        >
          Σ
        </span>

        {/* HARD SHADOW MAGNIFIER (strong & directional) */}
        <span
          style={{
            position: "absolute",
            right: -18,
            bottom: -4,

            filter: `
              drop-shadow(2px 3px 0px rgba(0,0,0,0.65))
              drop-shadow(0px 1px 6px rgba(0,0,0,0.55))
            `,
          }}
        >
          <Magnifier size={18} />
        </span>
      </div>

      {/* INPUT */}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search On this Category..."
        style={{
          flex: 1,

          marginLeft: 10,
          marginRight: 140,

          height: 34,

          border: "none",
          outline: "none",
          background: "transparent",

          fontSize: 14,

          fontFamily:
            "ui-serif, Georgia, 'Times New Roman', Times, serif",

          color: "#1a1a1a",
        }}
      />

      {/* SEARCH BUTTON */}
      <button
        onClick={handleSearch}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,

          height: 30,
          padding: "0 12px",

          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.25)",
          background: "rgba(0,0,0,0.04)",
          color: "rgba(0,0,0,0.7)",
          fontSize: 12,

          cursor: "pointer",

          fontFamily:
            "ui-serif, Georgia, 'Times New Roman', Times, serif",

          boxShadow: "0 0 8px rgba(255,255,255,0.08)",
        }}
      >
        <Magnifier size={14} />
        Search
      </button>

      {/* FILTER */}
      <span
        onClick={onFilterClick}
        style={{
          position: "absolute",
          right: -78,
          top: "50%",
          transform: "translateY(-50%)",

          fontSize: 12,
          letterSpacing: "0.18em",

          fontFamily:
            "ui-serif, Georgia, 'Times New Roman', Times, serif",

          color: "rgba(255,255,255,0.55)",

          cursor: "pointer",
          userSelect: "none",

          textShadow: `
            0 0 10px rgba(255,255,255,0.15),
            0 2px 10px rgba(0,0,0,0.2)
          `,
        }}
      >
        FILTER
      </span>
    </div>
  );
}
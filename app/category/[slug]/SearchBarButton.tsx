"use client";

import React, { useState } from "react";

type Props = {
  onSearch?: (value: string) => void;
};

export default function SearchBarButton({ onSearch }: Props) {
  const [value, setValue] = useState("");

  const handleSearch = () => {
    onSearch?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 10,

        width: "100%",
        maxWidth: 460,

        background: "rgba(255, 255, 255, 0.25)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",

        border: "1px solid rgba(0, 0, 0, 0.06)",
        borderRadius: 999,

        padding: "10px 12px",
      }}
    >
      {/* OUTSIDE SIGMA SYMBOL */}
      <span
        onClick={handleSearch}
        style={{
          position: "absolute",

          left: -42,
          top: "50%",
          transform: "translateY(-50%)",

          fontSize: 44,
          fontWeight: 200,

          fontFamily:
            '"STIX Two Math", "Cambria Math", "Times New Roman", serif',

          color: "rgba(255, 255, 255, 0.92)",

          cursor: "pointer",
          userSelect: "none",

          lineHeight: 1,

          textShadow: `
            0 0 10px rgba(255,255,255,0.25),
            0 2px 12px rgba(0,0,0,0.25)
          `,

          transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform =
            "translateY(-50%) scale(1.12)";
          e.currentTarget.style.textShadow =
            "0 0 18px rgba(255,255,255,0.35), 0 2px 14px rgba(0,0,0,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform =
            "translateY(-50%) scale(1)";
          e.currentTarget.style.textShadow =
            "0 0 10px rgba(255,255,255,0.25), 0 2px 12px rgba(0,0,0,0.25)";
        }}
      >
        Σ
      </span>

      {/* INPUT */}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        style={{
          flex: 1,
          height: 36,

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

      {/* RIGHT BUTTON (kept) */}
      <button
        onClick={handleSearch}
        style={{
          height: 32,
          padding: "0 12px",

          borderRadius: 999,
          border: "1px solid rgba(0, 0, 0, 0.08)",

          background: "rgba(0, 0, 0, 0.04)",
          color: "rgba(0, 0, 0, 0.7)",

          fontSize: 12,
          letterSpacing: "0.5px",

          cursor: "pointer",

          fontFamily:
            "ui-serif, Georgia, 'Times New Roman', Times, serif",

          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(0, 0, 0, 0.07)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(0, 0, 0, 0.04)";
        }}
      >
        Search
      </button>
    </div>
  );
}
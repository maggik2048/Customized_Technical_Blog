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
        display: "flex",
        gap: 10,
        alignItems: "center",

        width: "100%",
        maxWidth: 460,

        // 🔥 단일 레이어 glass (박스 느낌 최소화)
        background: "rgba(255, 255, 255, 0.25)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",

        border: "1px solid rgba(0, 0, 0, 0.06)",

        borderRadius: 999,

        padding: "8px 10px",
      }}
    >
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

      <button
        onClick={handleSearch}
        style={{
          height: 32,
          padding: "0 12px",

          borderRadius: 999,

          border: "1px solid rgba(0, 0, 0, 0.08)",

          background: "rgba(0, 0, 0, 0.04)", // 🔥 거의 투명

          color: "rgba(0, 0, 0, 0.7)",

          fontSize: 12,
          letterSpacing: "0.5px",

          cursor: "pointer",

          fontFamily:
            "ui-serif, Georgia, 'Times New Roman', Times, serif",

          transition: "all 0.2s ease",
        }}
      >
        Search
      </button>
    </div>
  );
}
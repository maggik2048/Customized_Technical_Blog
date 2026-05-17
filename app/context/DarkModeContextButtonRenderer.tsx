"use client";

import React from "react";
import { useDarkMode } from "@/app/context/DarkModeContext";

export default function DarkModeContextButtonRenderer() {
  const { mode, codeDark, toggle, toggleCode } = useDarkMode();

  const isDark = mode === "dark";

  const wrapperStyle: React.CSSProperties = {
    display: "flex",
    gap: 26,
    alignItems: "center",
  };

  const buttonBaseStyle: React.CSSProperties = {
    width: 170,
    height: 42,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(26px)",
    WebkitBackdropFilter: "blur(26px)",
    cursor: "pointer",
    position: "relative",
    transition: "all 0.3s ease",
    boxShadow: "0 14px 34px rgba(0,0,0,0.16)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px",
    overflow: "hidden",
  };

  const leftGroupStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    zIndex: 2,
  };

  const rightGroupStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    zIndex: 2,
  };

  const textStyle: React.CSSProperties = {
    fontSize: 11,
    letterSpacing: "0.12em",
    opacity: 0.7,
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        position: "fixed",
        left: "460px",
        top: 18,
        zIndex: 50,
        display: "flex",
        gap: 26,
        alignItems: "center",
      }}
    >
      {/* ================= DARK MODE ================= */}
      <button
        onClick={toggle}
        style={{
          ...buttonBaseStyle,
          background: isDark
            ? "rgba(20,20,28,0.22)"
            : "rgba(255,255,255,0.14)",
        }}
      >
        {/* thumb */}
        <div
          style={{
            position: "absolute",
            top: 4,
            left: isDark ? 122 : 4,
            width: 36,
            height: 32,
            borderRadius: 999,
            background: isDark ? "#f5f5f5" : "#111111",
            boxShadow: isDark
              ? "0 10px 24px rgba(255,255,255,0.20)"
              : "0 10px 24px rgba(0,0,0,0.30)",
            transition: "all 0.32s cubic-bezier(0.4,0,0.2,1)",
            zIndex: 1,
          }}
        />

        {/* LEFT: sun */}
        <div style={leftGroupStyle}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(170,170,170,0.95)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M4.93 4.93l1.41 1.41" />
            <path d="M17.66 17.66l1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="M4.93 19.07l1.41-1.41" />
            <path d="M17.66 6.34l1.41-1.41" />
          </svg>
        </div>

        {/* RIGHT: moon */}
        <div style={rightGroupStyle}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(175,175,175,0.95)"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </div>

        {/* TEXT INLINE (same line as icons) */}
        <div style={{ ...textStyle, marginLeft: 8 }}>
          DAY / NIGHT
        </div>
      </button>

      {/* ================= CODE MODE ================= */}
      <button
        onClick={toggleCode}
        style={{
          ...buttonBaseStyle,
          background: codeDark
            ? "rgba(40,40,52,0.18)"
            : "rgba(255,255,255,0.10)",
        }}
      >
        {/* thumb */}
        <div
          style={{
            position: "absolute",
            top: 4,
            left: codeDark ? 122 : 4,
            width: 36,
            height: 32,
            borderRadius: 999,
            background: codeDark ? "#dbeafe" : "#f5f5f5",
            boxShadow: "0 10px 22px rgba(0,0,0,0.25)",
            transition: "all 0.32s cubic-bezier(0.4,0,0.2,1)",
            zIndex: 1,
          }}
        />

        {/* LEFT */}
        <div style={leftGroupStyle}>
          <div style={{ fontSize: 13, opacity: 0.7 }}>
            {"</>"}
          </div>
        </div>

        {/* RIGHT */}
        <div style={rightGroupStyle}>
          <div style={{ fontSize: 11, opacity: 0.7 }}>
            ON
          </div>
        </div>

        {/* INLINE TEXT SAME LINE */}
        <div style={{ ...textStyle, marginLeft: 8 }}>
          CODE MODE
        </div>
      </button>
    </div>
  );
}
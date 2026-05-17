"use client";

import React from "react";
import { useDarkMode } from "@/app/context/DarkModeContext";

export default function DarkModeContextButtonRenderer() {
  const { mode, codeDark, toggle, toggleCode } = useDarkMode();

  const isDark = mode === "dark";

  const labelStyle: React.CSSProperties = {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 12,
    letterSpacing: "0.12em",
    opacity: 0.7,
    marginTop: 8,
  };

  const wrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const buttonBaseStyle: React.CSSProperties = {
    width: 150,
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

  const iconStyle: React.CSSProperties = {
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 500,
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
      <div style={wrapperStyle}>
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
              left: isDark ? 104 : 4,
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

          <div style={{ ...iconStyle, opacity: isDark ? 0.35 : 1 }}>
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

          <div style={{ ...iconStyle, opacity: isDark ? 1 : 0.45 }}>
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
        </button>

        <div style={labelStyle}>DAY / NIGHT</div>
      </div>

      {/* ================= CODE MODE ================= */}
      <div style={wrapperStyle}>
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
              left: codeDark ? 104 : 4,
              width: 36,
              height: 32,
              borderRadius: 999,
              background: codeDark ? "#dbeafe" : "#f5f5f5",
              boxShadow: "0 10px 22px rgba(0,0,0,0.25)",
              transition: "all 0.32s cubic-bezier(0.4,0,0.2,1)",
              zIndex: 1,
            }}
          />

          <div style={{ ...iconStyle, opacity: codeDark ? 0.4 : 1 }}>
            {"</>"}
          </div>

          <div style={{ ...iconStyle, opacity: codeDark ? 1 : 0.4 }}>
            ON
          </div>
        </button>

        <div style={labelStyle}>CODE MODE</div>
      </div>
    </div>
  );
}
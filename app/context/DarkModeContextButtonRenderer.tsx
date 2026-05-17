"use client";

import React from "react";
import { useDarkMode } from "@/app/context/DarkModeContext";
import { useCastShadowFilter } from "@/app/context/CastShadowFilterContext";

export default function DarkModeContextButtonRenderer() {
  const { mode, codeDark, toggle, toggleCode } = useDarkMode();
  const { toggle: toggleShadowFilter, enabled } =
    useCastShadowFilter();

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

        <div style={leftGroupStyle}>🌞</div>
        <div style={rightGroupStyle}>🌙</div>

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

        <div style={leftGroupStyle}>
          <div style={{ fontSize: 13, opacity: 0.7 }}>{"</>"}</div>
        </div>

        <div style={rightGroupStyle}>
          <div style={{ fontSize: 11, opacity: 0.7 }}>ON</div>
        </div>

        <div style={{ ...textStyle, marginLeft: 8 }}>
          CODE MODE
        </div>
      </button>

      {/* ================= SHADOW + FILTER ================= */}
      <button
        onClick={toggleShadowFilter}
        style={{
          ...buttonBaseStyle,
          background: enabled
            ? "rgba(255,255,255,0.14)"
            : "rgba(40,40,52,0.18)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 4,
            left: enabled ? 122 : 4,
            width: 36,
            height: 32,
            borderRadius: 999,
            background: enabled ? "#ffffff" : "#111111",
            boxShadow: "0 10px 22px rgba(0,0,0,0.25)",
            transition: "all 0.32s cubic-bezier(0.4,0,0.2,1)",
            zIndex: 1,
          }}
        />

        <div style={leftGroupStyle}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>FX</div>
        </div>

        <div style={rightGroupStyle}>
          <div style={{ fontSize: 11, opacity: 0.7 }}>
            {enabled ? "ON" : "OFF"}
          </div>
        </div>

        <div style={{ ...textStyle, marginLeft: 8 }}>
          SHADOW / FILTER
        </div>
      </button>
    </div>
  );
}
"use client";

import React from "react";
import { useDarkMode } from "@/app/context/DarkModeContext";
import { useCastShadowFilter } from "@/app/context/CastShadowFilterContext";

export default function DarkModeContextButtonRenderer() {
  const { mode, codeDark, toggle, toggleCode } = useDarkMode();
  const { toggle: toggleShadowFilter, enabled } =
    useCastShadowFilter();

  const isDark = mode === "dark";

  const luxuryFont: React.CSSProperties = {
    fontFamily: `"Playfair Display", "Didot", "Bodoni Moda", "Times New Roman", serif`,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
  };

  const buttonBaseStyle: React.CSSProperties = {
    width: 185,
    height: 46,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    backdropFilter: "blur(30px)",
    WebkitBackdropFilter: "blur(30px)",
    cursor: "pointer",
    position: "relative",
    transition: "all 0.35s ease",
    boxShadow: "0 18px 42px rgba(0,0,0,0.28)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 14px",
    overflow: "hidden",
    ...luxuryFont,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 10,
    opacity: 0.75,
    letterSpacing: "0.25em",
    marginLeft: 10,
    whiteSpace: "nowrap",
  };

  const iconWrap: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    zIndex: 5,
  };

  const iconBase: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 800,
    position: "relative",
    zIndex: 5,
  };

  const dotLarge: React.CSSProperties = {
    fontSize: 6,
    lineHeight: 1,
    opacity: 1,
  };

  const dotSmall: React.CSSProperties = {
    fontSize: 3,
    lineHeight: 1,
    opacity: 0.55,
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
        ...luxuryFont,
      }}
    >
      {/* ================= DARK MODE ================= */}
      <button
        onClick={toggle}
        style={{
          ...buttonBaseStyle,
          background: isDark
            ? "rgba(20,20,28,0.28)"
            : "rgba(255,255,255,0.12)",
        }}
      >
        {/* knob */}
        <div
          style={{
            position: "absolute",
            top: 4,
            left: isDark ? 126 : 4,
            width: 40,
            height: 36,
            borderRadius: 999,
            background: isDark ? "#111111" : "#f5f5f5",
            boxShadow: "0 10px 26px rgba(0,0,0,0.35)",
            transition: "all 0.38s cubic-bezier(0.4,0,0.2,1)",
            zIndex: 1,
          }}
        />

        {/* SUN (no dot) */}
        <div style={iconWrap}>
          <span style={iconBase}>☀</span>
        </div>

        {/* MOON (small dot only) */}
        <div style={iconWrap}>
          <span style={dotSmall}>•</span>
          <span style={iconBase}>☾</span>
        </div>

        <div style={labelStyle}>DAY · NIGHT</div>
      </button>

      {/* ================= CODE MODE ================= */}
      <button
        onClick={toggleCode}
        style={{
          ...buttonBaseStyle,
          background: codeDark
            ? "rgba(40,40,52,0.22)"
            : "rgba(255,255,255,0.10)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 4,
            left: codeDark ? 126 : 4,
            width: 40,
            height: 36,
            borderRadius: 999,
            background: codeDark ? "#111111" : "#f5f5f5",
            boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
            transition: "all 0.38s cubic-bezier(0.4,0,0.2,1)",
            zIndex: 1,
          }}
        />

        <div style={iconWrap}>
          <span style={iconBase}>{"</>"}</span>
        </div>

        <div style={labelStyle}>CODE · MODE</div>
      </button>

      {/* ================= SHADOW / FX ================= */}
      <button
        onClick={toggleShadowFilter}
        style={{
          ...buttonBaseStyle,
          background: enabled
            ? "rgba(255,255,255,0.14)"
            : "rgba(40,40,52,0.22)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 4,
            left: enabled ? 126 : 4,
            width: 40,
            height: 36,
            borderRadius: 999,
            background: enabled ? "#ffffff" : "#111111",
            boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
            transition: "all 0.38s cubic-bezier(0.4,0,0.2,1)",
            zIndex: 1,
          }}
        />

        <div style={iconWrap}>
          <span style={iconBase}>◐</span>
        </div>

        <div style={iconWrap}>
          <span style={dotSmall}>•</span>
          <span style={iconBase}>◑</span>
        </div>

        <div style={labelStyle}>SHADOW · FX</div>
      </button>
    </div>
  );
}
"use client";

import React from "react";
import { useDarkMode } from "@/app/contexts/DarkModeContext";
import { useCastShadowFilter } from "@/app/contexts/CastShadowFilterContext";

export default function DarkModeContextButtonRenderer() {
  const { mode, codeDark, toggle, toggleCode } = useDarkMode();
  const { toggle: toggleShadowFilter, enabled } =
    useCastShadowFilter();

  const isDark = mode === "dark";

  // ✅ 폰트 관련 스타일 간소화 (className에 의존)
  const buttonBaseStyle: React.CSSProperties = {
    width: 190,
    height: 48,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    backdropFilter: "blur(32px)",
    WebkitBackdropFilter: "blur(32px)",
    cursor: "pointer",
    position: "relative",
    transition: "all 0.35s ease",
    boxShadow: "0 20px 46px rgba(0,0,0,0.30)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    overflow: "hidden",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 30,
    opacity: 0.75,
    letterSpacing: "0.10em",
    marginLeft: 10,
    whiteSpace: "nowrap",
    fontWeight: 500,
    textShadow: "0 0 4px rgba(0,0,0,0.4)",
  };

  const iconWrap: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    zIndex: 5,
  };

  const iconBase: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 700,
    position: "relative",
    zIndex: 5,
    textShadow: "0 1px 2px rgba(0,0,0,0.25)",
  };

  const dotSmall: React.CSSProperties = {
    fontSize: 3,
    opacity: 0.55,
    lineHeight: 1,
  };

  return (
    <div
      className="font-dorsa" // ✅ 여기! 클래스 추가
      style={{
        position: "fixed",
        left: "460px",
        top: 18,
        zIndex: 50,
        display: "flex",
        gap: 26,
        alignItems: "center",
        letterSpacing: "0.28em",
        textTransform: "uppercase",
      }}
    >
      {/* ================= DARK MODE ================= */}
      <button
        onClick={toggle}
        style={{
          ...buttonBaseStyle,
          background: isDark
            ? "rgba(20,20,28,0.30)"
            : "rgba(255,255,255,0.12)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 4,
            left: isDark ? 128 : 4,
            width: 42,
            height: 38,
            borderRadius: 999,
            background: isDark ? "#111111" : "#f5f5f5",
            boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
            transition: "all 0.38s cubic-bezier(0.4,0,0.2,1)",
            zIndex: 1,
          }}
        />

        <div style={iconWrap}>
          <span style={iconBase}>☀</span>
        </div>

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
            ? "rgba(40,40,52,0.24)"
            : "rgba(255,255,255,0.10)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 4,
            left: codeDark ? 128 : 4,
            width: 42,
            height: 38,
            borderRadius: 999,
            background: "#111111",
            boxShadow: "0 12px 26px rgba(0,0,0,0.28)",
            transition: "all 0.38s cubic-bezier(0.4,0,0.2,1)",
            zIndex: 1,
          }}
        />

        <div style={iconWrap}>
          <span
            style={{
              ...iconBase,
              color: "#ffffff",
            }}
          >
            {"</>"}
          </span>
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
            : "rgba(40,40,52,0.24)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 4,
            left: enabled ? 128 : 4,
            width: 42,
            height: 38,
            borderRadius: 999,
            background: "#ffffff",
            boxShadow: "0 12px 26px rgba(0,0,0,0.28)",
            transition: "all 0.38s cubic-bezier(0.4,0,0.2,1)",
            zIndex: 1,
          }}
        />

        <div style={iconWrap}>
          <span
            style={{
              ...iconBase,
              color: "#111111",
            }}
          >
            ◐
          </span>
        </div>

        <div style={iconWrap}>
          <span style={dotSmall}>•</span>
          <span
            style={{
              ...iconBase,
              color: "#111111",
            }}
          >
            ◑
          </span>
        </div>

        <div style={labelStyle}>SHADOW · FX</div>
      </button>
    </div>
  );
}
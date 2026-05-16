"use client";

import React from "react";
import { useDarkMode } from "@/app/context/DarkModeContext";

export default function DarkModeContextButtonRenderer() {
  const { mode, codeDark, toggle, toggleCode } = useDarkMode();

  const isDark = mode === "dark";

  return (
    <div
      style={{
        position: "fixed",
        left: "340px",
        top: 18,

        zIndex: 50,
        display: "flex",
        gap: 16,
        alignItems: "center",
      }}
    >
      {/* ================= DARK MODE ================= */}
      <button
        onClick={toggle}
        style={{
          width: 86,
          height: 40,
          borderRadius: 999,

          border: "1px solid rgba(255,255,255,0.14)",

          background: isDark
            ? "rgba(20,20,28,0.55)"
            : "rgba(255,255,255,0.55)",

          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",

          cursor: "pointer",
          position: "relative",
          transition: "all 0.3s ease",
        }}
      >
        {/* ORB */}
        <div
          style={{
            position: "absolute",
            top: 4,
            left: isDark ? 46 : 4,

            width: 32,
            height: 32,
            borderRadius: "50%",

            background: isDark ? "#f5f5f5" : "#111111",

            boxShadow: isDark
              ? "0 6px 18px rgba(255,255,255,0.18)"
              : "0 6px 18px rgba(0,0,0,0.35)",

            transition: "all 0.32s cubic-bezier(0.4,0,0.2,1)",
            zIndex: 1,
          }}
        />

        {/* ☀️ SUN (thicker outline) */}
        <div
          style={{
            position: "absolute",
            left: 12,
            top: 8,

            zIndex: 5,

            opacity: isDark ? 0.35 : 1,
            transform: isDark ? "scale(0.92)" : "scale(1)",

            transition: "all 0.25s ease",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(147, 147, 147, 0.95)"
            strokeWidth="3.6"
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

        {/* 🌙 MOON (thicker outline) */}
        <div
          style={{
            position: "absolute",
            right: 12,
            top: 8,

            zIndex: 5,

            opacity: isDark ? 1 : 0.35,
            transform: isDark ? "scale(1)" : "scale(0.92)",

            transition: "all 0.25s ease",
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(140,140,140,0.95)"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </div>
      </button>

      {/* ================= CODE MODE (원래 스타일 복구) ================= */}
      <button
        onClick={toggleCode}
        style={{
          width: 86,
          height: 40,
          borderRadius: 999,

          border: "1px solid rgba(255,255,255,0.14)",

          background: codeDark
            ? "rgba(40,40,52,0.55)"
            : "rgba(255,255,255,0.55)",

          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",

          cursor: "pointer",
          position: "relative",
          transition: "all 0.3s ease",
        }}
      >
        {/* ORB */}
        <div
          style={{
            position: "absolute",
            top: 4,
            left: codeDark ? 46 : 4,

            width: 32,
            height: 32,
            borderRadius: "50%",

            background: codeDark ? "#dbeafe" : "#f5f5f5",

            boxShadow: "0 6px 18px rgba(0,0,0,0.25)",

            transition: "all 0.32s cubic-bezier(0.4,0,0.2,1)",
            zIndex: 1,
          }}
        />

        {/* LEFT ICON (원래대로 복구) */}
        <div
          style={{
            position: "absolute",
            left: 12,
            top: 9,

            zIndex: 5,

            opacity: codeDark ? 0.35 : 1,
            transition: "all 0.25s ease",
          }}
        >
          {"</>"}
        </div>

        {/* RIGHT ICON (원래대로 복구) */}
        <div
          style={{
            position: "absolute",
            right: 12,
            top: 9,

            zIndex: 5,

            opacity: codeDark ? 1 : 0.35,
            transition: "all 0.25s ease",
          }}
        >
          ON
        </div>
      </button>
    </div>
  );
}
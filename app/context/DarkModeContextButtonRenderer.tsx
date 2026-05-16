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

        // sidebar 오른쪽
        left: "340px",
        top: 18,

        zIndex: 50,
        display: "flex",
        gap: 16,
        alignItems: "center",
      }}
    >
      {/* ================= DARK MODE SWITCH ================= */}
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
        {/* 🔥 BACKGROUND ORB (핵심: 항상 뒤에 있음) */}
        <div
          style={{
            position: "absolute",
            top: 4,

            left: isDark ? 46 : 4,

            width: 32,
            height: 32,
            borderRadius: "50%",

            background: isDark ? "#ffffff" : "#111111",

            boxShadow: isDark
              ? "0 6px 18px rgba(255,255,255,0.25)"
              : "0 6px 18px rgba(0,0,0,0.35)",

            transition: "all 0.32s cubic-bezier(0.4,0,0.2,1)",

            zIndex: 1, // 뒤쪽 레이어
          }}
        />

        {/* ☀️ LEFT ICON (앞에 있음) */}
        <div
          style={{
            position: "absolute",
            left: 12,
            top: 8,

            fontSize: 15,

            zIndex: 5, // orb보다 위

            opacity: isDark ? 0.35 : 1,
            transform: isDark ? "scale(0.9)" : "scale(1)",

            transition: "all 0.25s ease",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
          }}
        >
          ☀️
        </div>

        {/* 🌙 RIGHT ICON (앞에 있음) */}
        <div
          style={{
            position: "absolute",
            right: 12,
            top: 8,

            fontSize: 15,

            zIndex: 5, // orb보다 위

            opacity: isDark ? 1 : 0.35,
            transform: isDark ? "scale(1)" : "scale(0.9)",

            transition: "all 0.25s ease",
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))",
          }}
        >
          🌙
        </div>
      </button>

      {/* ================= CODE TOGGLE ================= */}
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

            background: codeDark ? "#38bdf8" : "#ffffff",

            boxShadow: "0 6px 18px rgba(0,0,0,0.25)",

            transition: "all 0.32s cubic-bezier(0.4,0,0.2,1)",

            zIndex: 1,
          }}
        />

        {/* LEFT */}
        <div
          style={{
            position: "absolute",
            left: 12,
            top: 9,

            fontSize: 12,

            zIndex: 5,

            opacity: codeDark ? 0.35 : 1,
            transition: "all 0.25s ease",
          }}
        >
          {"</>"}
        </div>

        {/* RIGHT */}
        <div
          style={{
            position: "absolute",
            right: 12,
            top: 9,

            fontSize: 12,

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
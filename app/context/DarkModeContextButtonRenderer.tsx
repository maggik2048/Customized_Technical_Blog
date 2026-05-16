"use client";

import { useDarkMode } from "@/app/context/DarkModeContext";

export default function DarkModeContextButtonRenderer() {
  const {
    mode,
    codeDark,
    toggle,
    toggleCode,
  } = useDarkMode();

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: 20,
        zIndex: 50,

        display: "flex",
        gap: 12,
      }}
    >
      <button
        onClick={toggle}
        style={{
          padding: "10px 18px",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.15)",

          background:
            mode === "dark"
              ? "rgba(20,20,28,0.72)"
              : "rgba(255,255,255,0.72)",

          color:
            mode === "dark"
              ? "#fff"
              : "#111",

          backdropFilter: "blur(12px)",

          cursor: "pointer",

          transition: "0.25s",
        }}
      >
        {mode === "dark" ? "Dark" : "Light"}
      </button>

      <button
        onClick={toggleCode}
        style={{
          padding: "10px 18px",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.15)",

          background:
            codeDark
              ? "rgba(40,40,52,0.78)"
              : "rgba(255,255,255,0.72)",

          color:
            codeDark
              ? "#7dd3fc"
              : "#111",

          backdropFilter: "blur(12px)",

          cursor: "pointer",

          transition: "0.25s",
        }}
      >
        Code
      </button>
    </div>
  );
}
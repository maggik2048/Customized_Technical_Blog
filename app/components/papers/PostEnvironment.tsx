"use client";

import React, { useState } from "react";
import { useDarkMode } from "@/app/context/DarkModeContext";

export default function PostEnvironment({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mode, toggle } = useDarkMode();
  const [codeDark, setCodeDark] = useState(false);

  const isDark = mode === "dark";

  const bgImage = isDark
    ? "/images/horizon.jpg"
    : "/images/medimath.jpeg";

  const textColor = isDark ? "#eee" : "#111";

  return (
    <>
      {/*  BACKGROUND LAYER */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url("${bgImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
          transition: "0.4s ease",
        }}
      />

      {/*  CONTROL PANEL */}
      <div
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          display: "flex",
          gap: 10,
          zIndex: 50,
        }}
      >
        <button onClick={toggle} style={btnStyle}>
          Dark Mode
        </button>

        <button
          onClick={() => setCodeDark((v) => !v)}
          style={btnStyle}
        >
          Code Theme
        </button>
      </div>

      {/*  CONTENT AREA */}
      <div style={{ color: textColor }}>{children}</div>
    </>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 6,
  cursor: "pointer",
  background: "rgba(0,0,0,0.6)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.2)",
};
"use client";

import React from "react";
import { useDarkMode } from "@/app/context/DarkModeContext";

export default function PostEnvironment({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mode, toggle, toggleCode } = useDarkMode();

  const isDark = mode === "dark";

  const bgImage = isDark
    ? "/images/horizon.jpg"
    : "/images/medimath.jpeg";

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url("${bgImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
        }}
      />

      <div style={{ position: "fixed", top: 20, left: 20, zIndex: 50 }}>
        <button onClick={toggle}>Dark Mode</button>
        <button onClick={toggleCode}>Code Theme</button>
      </div>

      {children}
    </>
  );
}
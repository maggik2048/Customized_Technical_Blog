// InteractionBoxLayout.tsx

"use client";

import React from "react";

export default function InteractionBoxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",

        paddingLeft: 40,
        paddingRight: 40,
        boxSizing: "border-box",

        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
}
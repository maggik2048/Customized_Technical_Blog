"use client";

import React from "react";

export default function NotepageLines({ children, node }: any) {
  const line = node?.position?.start?.line ?? 0;

  const isEven = line % 2 === 0;

  return (
    <p
      style={{
        padding: "6px 0",
        lineHeight: 1.6,

        borderBottom: isEven
          ? "1px dashed rgba(255,255,255,0.08)"
          : "1px solid transparent",

        opacity: isEven ? 1 : 0.85,

        transition: "all 0.2s ease",
      }}
    >
      {children}
    </p>
  );
}
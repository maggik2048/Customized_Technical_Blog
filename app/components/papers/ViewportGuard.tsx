"use client";

import React from "react";

type ViewportGuardProps = {
  children: React.ReactNode;
  width?: string | number;
  maxWidth?: string | number;
};

export default function ViewportGuard({
  children,
  width = "100%",
  maxWidth = "1400px",
}: ViewportGuardProps) {
  return (
    <div
      id="viewport-scroll-container"
      data-scroll-container
      style={{
        position: "relative",

        width: width,

        maxWidth: maxWidth,

        margin: "0 auto",

        overflowX: "hidden",

        overflowY: "auto",

        height: "100vh",

        display: "flex",

        justifyContent: "center",

        WebkitOverflowScrolling: "touch",

        scrollBehavior: "smooth",

        msOverflowStyle: "none",

        scrollbarWidth: "none",

        overscrollBehavior: "contain",

        willChange: "scroll-position",
      }}
      className="hide-scrollbar"
    >
      {children}
    </div>
  );
}
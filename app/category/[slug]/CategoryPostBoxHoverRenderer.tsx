"use client";

import React from "react";

export default function CategoryPostBoxHoverRenderer({
  visible,
  isSimple,
}: {
  visible: boolean;
  isSimple?: boolean;
}) {
  return (
    <>
      {/* LEFT BRACKET */}
      <div
        style={{
          position: "absolute",

          left: 10,
          top: "50%",

          transform: visible
            ? "translateY(-50%) translateX(0px)"
            : "translateY(-50%) translateX(-6px)",

          opacity: visible ? 1 : 0,

          transition:
            "opacity 0.24s ease, transform 0.28s ease",

          pointerEvents: "none",

          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",

          height: "68%",
          width: 18,

          zIndex: 30,

          filter: !isSimple
            ? "drop-shadow(0 0 8px rgba(255,255,255,0.12))"
            : "none",
        }}
      >
        {/* top */}
        <div
          style={{
            width: 14,
            height: 1.4,

            borderRadius: 999,

            background: isSimple
              ? "rgba(255,255,255,0.92)"
              : "rgba(255,255,255,0.96)",
          }}
        />

        {/* middle */}
        <div
          style={{
            width: 1.4,
            flex: 1,

            marginLeft: 0,

            background: isSimple
              ? "rgba(255,255,255,0.92)"
              : "rgba(255,255,255,0.96)",
          }}
        />

        {/* bottom */}
        <div
          style={{
            width: 14,
            height: 1.4,

            borderRadius: 999,

            background: isSimple
              ? "rgba(255,255,255,0.92)"
              : "rgba(255,255,255,0.96)",
          }}
        />
      </div>

      {/* RIGHT BRACKET */}
      <div
        style={{
          position: "absolute",

          right: 10,
          top: "50%",

          transform: visible
            ? "translateY(-50%) translateX(0px)"
            : "translateY(-50%) translateX(6px)",

          opacity: visible ? 1 : 0,

          transition:
            "opacity 0.24s ease, transform 0.28s ease",

          pointerEvents: "none",

          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",

          height: "68%",
          width: 18,

          zIndex: 30,

          filter: !isSimple
            ? "drop-shadow(0 0 8px rgba(255,255,255,0.12))"
            : "none",
        }}
      >
        {/* top */}
        <div
          style={{
            width: 14,
            height: 1.4,

            borderRadius: 999,

            background: isSimple
              ? "rgba(255,255,255,0.92)"
              : "rgba(255,255,255,0.96)",
          }}
        />

        {/* middle */}
        <div
          style={{
            width: 1.4,
            flex: 1,

            marginRight: 0,

            background: isSimple
              ? "rgba(255,255,255,0.92)"
              : "rgba(255,255,255,0.96)",
          }}
        />

        {/* bottom */}
        <div
          style={{
            width: 14,
            height: 1.4,

            borderRadius: 999,

            background: isSimple
              ? "rgba(255,255,255,0.92)"
              : "rgba(255,255,255,0.96)",
          }}
        />
      </div>
    </>
  );
}
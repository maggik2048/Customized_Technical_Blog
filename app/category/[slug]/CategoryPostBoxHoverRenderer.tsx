"use client";

import React from "react";

function BracketImage({
  side,
  visible,
  isSimple,
}: {
  side: "left" | "right";
  visible: boolean;
  isSimple?: boolean;
}) {
  const isLeft =
    side === "left";

  return (
    <div
      style={{
        position: "absolute",

        top: "50%",

        [isLeft
          ? "left"
          : "right"]: -42,

        width: 46,
        height: "92%",

        transform: visible
          ? `
            translateY(-50%)
            translateX(0px)
            scaleX(${isLeft ? -1 : 1})
            scale(1)
          `
          : `
            translateY(-50%)
            translateX(${
              isLeft
                ? "-12px"
                : "12px"
            })
            scaleX(${isLeft ? -1 : 1})
            scale(0.94)
          `,

        transformOrigin:
          "center",

        opacity: visible
          ? 1
          : 0,

        transition: `
          opacity 420ms cubic-bezier(0.22,1,0.36,1),
          transform 620ms cubic-bezier(0.22,1,0.36,1)
        `,

        pointerEvents: "none",

        zIndex: 80,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        filter: isSimple
          ? `
            brightness(1.12)
            drop-shadow(0 0 4px rgba(255,255,255,0.05))
          `
          : `
            brightness(1.18)
            drop-shadow(0 0 10px rgba(255,255,255,0.10))
            drop-shadow(0 0 28px rgba(255,255,255,0.08))
          `,
      }}
    >
      <img
        src="/images/marks/braket-invert.png"
        alt="bracket"
        draggable={false}
        style={{
          width: "100%",
          height: "100%",

          objectFit: "contain",

          userSelect: "none",

          opacity: 0.98,

          display: "block",
        }}
      />
    </div>
  );
}

export default function CategoryPostBoxHoverRenderer({
  visible,
  isSimple,
}: {
  visible: boolean;
  isSimple?: boolean;
}) {
  return (
    <>
      <BracketImage
        side="left"
        visible={visible}
        isSimple={isSimple}
      />

      <BracketImage
        side="right"
        visible={visible}
        isSimple={isSimple}
      />
    </>
  );
}
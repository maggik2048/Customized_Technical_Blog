"use client";

import React from "react";

function seededRandom(seed: number) {

  const x =
    Math.sin(seed) * 10000;

  return x - Math.floor(x);
}

type InkOptions = {

  color?: string;

  maxBlur?: number;

  maxShiftX?: number;

  maxShiftY?: number;

  opacityMin?: number;

  opacityMax?: number;

  bleedChance?: number;
};

export function renderInkText(

  text: React.ReactNode,

  seed: number,

  options?: InkOptions
) {

  const {

    color =
      "rgba(40,20,10,0.9)",

    maxBlur = 0.22,

    maxShiftX = 0.45,

    maxShiftY = 0.7,

    opacityMin = 0.72,

    opacityMax = 1,

    bleedChance = 0.24,
  } = options || {};

  return String(text)
    .split("")
    .map((char, i) => {

      const r =
        seededRandom(seed + i * 13);

      const opacity =
        opacityMin +
        r *
          (opacityMax - opacityMin);

      const shiftY =
        (seededRandom(
          seed + i * 7
        ) - 0.5) *
        maxShiftY;

      const shiftX =
        (seededRandom(
          seed + i * 5
        ) - 0.5) *
        maxShiftX;

      const bleedStrength =
        seededRandom(
          seed + i * 29
        );

      const strongBleed =
        bleedStrength >
        1 - bleedChance;

      return (

        <span
          key={i}
          style={{

            position: "relative",

            display:
              "inline-block",

            opacity,

            transform:
              `translate(${shiftX}px, ${shiftY}px)`,

            textShadow:
              strongBleed
                ? `
                  0 0 0.6px ${color},
                  0 0 1.4px ${color},
                  0 0 2.8px rgba(0,0,0,0.10)
                `
                : `
                  0 0 0.3px rgba(0,0,0,0.08)
                `,

            filter:
              strongBleed
                ? `
                  blur(${
                    0.08 +
                    r * maxBlur
                  }px)
                `
                : `
                  blur(${
                    r * 0.04
                  }px)
                `,
          }}
        >
          {char === " "
            ? "\u00A0"
            : char}
        </span>
      );
    });
}
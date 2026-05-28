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

  maxRotation?: number;

  minScale?: number;

  maxScale?: number;

  opacityMin?: number;

  opacityMax?: number;

  bleedChance?: number;

  kerningVariance?: number;
};

export function renderInkText(

  text: React.ReactNode,

  seed: number,

  options?: InkOptions
) {

  const {

    color =
      "rgba(40,20,10,0.9)",

    maxBlur = 0.182,

    maxShiftX = 0.45,

    maxShiftY = 1.97,

    maxRotation = 4.8,

    minScale = 0.985,

    maxScale = 1.0525,

    opacityMin = 0.62,

    opacityMax = 0.9,

    bleedChance = 0.24,

    kerningVariance = 0.0006,
  } = options || {};

  return String(text)
    .split("")
    .map((char, i) => {

      /* =========================
         RANDOM BASE
      ========================= */

      const r =
        seededRandom(
          seed + i * 13
        );

      /* =========================
         OPACITY
      ========================= */

      const opacity =
        opacityMin +
        r *
          (
            opacityMax -
            opacityMin
          );

      /* =========================
         POSITION JITTER
      ========================= */

      const shiftY =
        (
          seededRandom(
            seed + i * 7
          ) - 0.5
        ) *
        maxShiftY;

      const shiftX =
        (
          seededRandom(
            seed + i * 5
          ) - 0.5
        ) *
        maxShiftX;

      /* =========================
         ROTATION
      ========================= */

      const rotation =
        (
          seededRandom(
            seed + i * 17
          ) - 0.5
        ) *
        maxRotation;

      /* =========================
         SCALE VARIANCE
      ========================= */

      const scale =
        minScale +
        seededRandom(
          seed + i * 23
        ) *
        (
          maxScale -
          minScale
        );

      /* =========================
         KERNING
      ========================= */

      const kerningShift =
        (
          seededRandom(
            seed + i * 31
          ) - 0.5
        ) *
        kerningVariance;

      /* =========================
         BLEED
      ========================= */

      const bleedStrength =
        seededRandom(
          seed + i * 29
        );

      const strongBleed =
        bleedStrength >
        1 - bleedChance;

      /* =========================
         BLUR
      ========================= */

      const blurAmount =
        strongBleed
          ? (
              0.08 +
              r * maxBlur
            )
          : (
              r * 0.04
            );

      /* =========================
         SHADOW
      ========================= */

      const textShadow =
        strongBleed

          ? `
            0 0 0.6px ${color},
            0 0 1.4px ${color},
            0 0 2.8px rgba(0,0,0,0.10)
          `

          : `
            0 0 0.3px rgba(0,0,0,0.08)
          `;

      return (

        <span
          key={i}
          style={{

            position: "relative",

            display:
              "inline-block",

            opacity,

            marginRight:
              `${kerningShift}em`,

            transform:
              `
                translate(
                  ${shiftX}px,
                  ${shiftY}px
                )

                rotate(
                  ${rotation}deg
                )

                scale(
                  ${scale}
                )
              `,

            transformOrigin:
              "center bottom",

            textShadow,

            filter:
              `blur(${blurAmount}px)`,

            willChange:
              "transform, filter, opacity",

            backfaceVisibility:
              "hidden",
          }}
        >
          {
            char === " "
              ? "\u00A0"
              : char
          }
        </span>
      );
    });
}
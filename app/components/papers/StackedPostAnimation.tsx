"use client";

import { motion } from "framer-motion";

/* ========================= */
/* ANIMATION STATE */
/* ========================= */

export function getPostStyle(offset: number) {
  if (offset === 0) {
    return {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      opacity: 1,
      zIndex: 30,
    };
  }

  if (offset === -1) {
    return {
      x: -520,
      y: -40,
      scale: 0.9,
      rotate: -3,
      opacity: 1,
      zIndex: 20,
    };
  }

  if (offset === 1) {
    return {
      x: 520,
      y: -40,
      scale: 0.9,
      rotate: 3,
      opacity: 1,
      zIndex: 20,
    };
  }

  return {
    opacity: 0,
  };
}

/* ========================= */
/* MOTION WRAPPER (optional) */
/* ========================= */

export const springTransition = {
  type: "spring",
  stiffness: 70,
  damping: 26,
  mass: 0.9,
};
"use client";

import { useEffect } from "react";
import {
  useMotionValue,
  useSpring,
  animate,
  useTransform,
} from "framer-motion";

import { overshoot } from "./RateFunctions";

export function useWobblyMorphTransform(active: boolean) {
  // base driver (alpha)
  const raw = useMotionValue(0);

  // Manim-like inertia smoothing layer
  const progress = useSpring(raw, {
    stiffness: 95,
    damping: 14,
    mass: 0.9,
  });

  // animation driver (Manim-style rate_function)
  useEffect(() => {
    const controls = animate(raw, active ? 1 : 0, {
      duration: 0.85,
      ease: overshoot,
    });

    return () => controls.stop();
  }, [active, raw]);

  //  shared deformation field (Manim-style “living space”)
  const wobble = useTransform(progress, (p) => {
    const decay = 1 - p;
    return Math.sin(p * Math.PI * 2) * decay;
  });

  // optional secondary field (reverse phase)
  const wobbleReverse = useTransform(progress, (p) => {
    const decay = p;
    return Math.sin((1 - p) * Math.PI * 2) * decay;
  });

  return {
    progress,
    wobble,
    wobbleReverse,
  };
}


//referenced by paper
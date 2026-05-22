"use client";

import { useEffect, useRef } from "react";

type Props = {
  scrollSpeed?: number;
};

export default function ScrollWithKeyboardArrow({
  scrollSpeed = 12,
}: Props) {
  const pressedKeys = useRef<
    Set<string>
  >(new Set());

  const animationFrame =
    useRef<number | null>(null);

  useEffect(() => {
    const getContainer = () =>
      document.getElementById(
        "viewport-scroll-container"
      );

    // =========================
    // LOOP
    // =========================

    const loop = () => {
      const container =
        getContainer();

      if (!container) {
        animationFrame.current =
          requestAnimationFrame(loop);

        return;
      }

      let delta = 0;

      // continuous movement
      if (
        pressedKeys.current.has(
          "ArrowUp"
        )
      ) {
        delta -= scrollSpeed;
      }

      if (
        pressedKeys.current.has(
          "ArrowDown"
        )
      ) {
        delta += scrollSpeed;
      }

      if (delta !== 0) {
        container.scrollTop += delta;
      }

      animationFrame.current =
        requestAnimationFrame(loop);
    };

    // =========================
    // KEY DOWN
    // =========================

    const handleKeyDown = (
      e: KeyboardEvent
    ) => {
      const target =
        e.target as HTMLElement | null;

      const tag =
        target?.tagName?.toLowerCase();

      const isTyping =
        tag === "input" ||
        tag === "textarea" ||
        target?.isContentEditable;

      if (isTyping) return;

      const container =
        getContainer();

      if (!container) return;

      // prevent browser scroll
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "PageUp",
          "PageDown",
          "Home",
          "End",
        ].includes(e.key)
      ) {
        e.preventDefault();
      }

      // hold support
      pressedKeys.current.add(
        e.key
      );

      // =========================
      // PAGE UP
      // =========================

      if (e.key === "PageUp") {
        container.scrollBy({
          top:
            -window.innerHeight *
            0.82,
          behavior: "smooth",
        });
      }

      // =========================
      // PAGE DOWN
      // =========================

      if (e.key === "PageDown") {
        container.scrollBy({
          top:
            window.innerHeight *
            0.82,
          behavior: "smooth",
        });
      }

      // =========================
      // HOME
      // =========================

      if (e.key === "Home") {
        container.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }

      // =========================
      // END
      // =========================

      if (e.key === "End") {
        container.scrollTo({
          top:
            container.scrollHeight,
          behavior: "smooth",
        });
      }
    };

    // =========================
    // KEY UP
    // =========================

    const handleKeyUp = (
      e: KeyboardEvent
    ) => {
      pressedKeys.current.delete(
        e.key
      );
    };

    // =========================
    // WINDOW BLUR
    // =========================

    const clearKeys = () => {
      pressedKeys.current.clear();
    };

    // =========================
    // START LOOP
    // =========================

    animationFrame.current =
      requestAnimationFrame(loop);

    window.addEventListener(
      "keydown",
      handleKeyDown,
      {
        passive: false,
      }
    );

    window.addEventListener(
      "keyup",
      handleKeyUp
    );

    window.addEventListener(
      "blur",
      clearKeys
    );

    return () => {
      if (
        animationFrame.current
      ) {
        cancelAnimationFrame(
          animationFrame.current
        );
      }

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      window.removeEventListener(
        "keyup",
        handleKeyUp
      );

      window.removeEventListener(
        "blur",
        clearKeys
      );
    };
  }, [scrollSpeed]);

  return null;
}
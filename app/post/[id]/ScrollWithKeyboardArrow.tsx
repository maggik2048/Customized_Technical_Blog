"use client";

import { useEffect, useRef } from "react";

type Props = {
  scrollSpeed?: number;
  acceleration?: number;
  friction?: number;
};

export default function ScrollWithKeyboardArrow({
  scrollSpeed = 1.2,
  acceleration = 0.9,
  friction = 0.9,
}: Props) {
  const pressedKeys = useRef<Set<string>>(
    new Set()
  );

  const animationFrame =
    useRef<number | null>(null);

  const velocity = useRef(0);

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

      // acceleration
      if (
        pressedKeys.current.has(
          "ArrowUp"
        )
      ) {
        velocity.current -=
          acceleration;
      }

      if (
        pressedKeys.current.has(
          "ArrowDown"
        )
      ) {
        velocity.current +=
          acceleration;
      }

      // max speed clamp
      velocity.current = Math.max(
        -20,
        Math.min(
          20,
          velocity.current
        )
      );

      // apply movement
      if (
        Math.abs(
          velocity.current
        ) > 0.01
      ) {
        container.scrollTop +=
          velocity.current *
          scrollSpeed;
      }

      // friction / easing
      velocity.current *= friction;

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

      pressedKeys.current.add(
        e.key
      );

      // PAGE UP
      if (e.key === "PageUp") {
        container.scrollBy({
          top:
            -window.innerHeight *
            0.82,
          behavior: "smooth",
        });
      }

      // PAGE DOWN
      if (e.key === "PageDown") {
        container.scrollBy({
          top:
            window.innerHeight *
            0.82,
          behavior: "smooth",
        });
      }

      // HOME
      if (e.key === "Home") {
        container.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }

      // END
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

    const clearKeys = () => {
      pressedKeys.current.clear();
    };

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
  }, [
    scrollSpeed,
    acceleration,
    friction,
  ]);

  return null;
}
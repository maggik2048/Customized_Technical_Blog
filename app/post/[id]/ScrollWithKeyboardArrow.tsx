"use client";

import { useEffect } from "react";

type Props = {
  scrollStep?: number;
  smooth?: boolean;
};

export default function ScrollWithKeyboardArrow({
  scrollStep = 140,
  smooth = true,
}: Props) {
  useEffect(() => {
    const handleKeyDown = (
      e: KeyboardEvent
    ) => {
      // INPUT / TEXTAREA 등에서는 무시
      const target =
        e.target as HTMLElement | null;

      const tag =
        target?.tagName?.toLowerCase();

      const isTyping =
        tag === "input" ||
        tag === "textarea" ||
        target?.isContentEditable;

      if (isTyping) return;

      // scroll container
      const container =
        document.getElementById(
          "viewport-scroll-container"
        );

      if (!container) return;

      // =========================
      // UP
      // =========================

      if (e.key === "ArrowUp") {
        e.preventDefault();

        container.scrollBy({
          top: -scrollStep,
          behavior: smooth
            ? "smooth"
            : "auto",
        });
      }

      // =========================
      // DOWN
      // =========================

      if (e.key === "ArrowDown") {
        e.preventDefault();

        container.scrollBy({
          top: scrollStep,
          behavior: smooth
            ? "smooth"
            : "auto",
        });
      }

      // =========================
      // PAGE UP
      // =========================

      if (e.key === "PageUp") {
        e.preventDefault();

        container.scrollBy({
          top:
            -window.innerHeight *
            0.82,

          behavior: smooth
            ? "smooth"
            : "auto",
        });
      }

      // =========================
      // PAGE DOWN
      // =========================

      if (e.key === "PageDown") {
        e.preventDefault();

        container.scrollBy({
          top:
            window.innerHeight *
            0.82,

          behavior: smooth
            ? "smooth"
            : "auto",
        });
      }

      // =========================
      // HOME
      // =========================

      if (e.key === "Home") {
        e.preventDefault();

        container.scrollTo({
          top: 0,
          behavior: smooth
            ? "smooth"
            : "auto",
        });
      }

      // =========================
      // END
      // =========================

      if (e.key === "End") {
        e.preventDefault();

        container.scrollTo({
          top:
            container.scrollHeight,

          behavior: smooth
            ? "smooth"
            : "auto",
        });
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
      {
        passive: false,
      }
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [scrollStep, smooth]);

  return null;
}
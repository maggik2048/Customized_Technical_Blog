"use client";

import { useEffect } from "react";

export default function KaTeXPostProcessor() {
  useEffect(() => {
    const apply = () => {

      // subscript 내부 실제 텍스트 span
      const targets = document.querySelectorAll(
        ".katex .msub span, .katex .msubsup span"
      );

      targets.forEach((node) => {
        const el = node as HTMLElement;

        el.style.color =
          "rgba(245, 210, 80, 0.98)";

        el.style.opacity = "1";

        el.style.textShadow =
          "0 0.3px 0.6px rgba(0,0,0,0.45)";
      });
    };

    apply();

    const observer = new MutationObserver(() => {
      apply();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
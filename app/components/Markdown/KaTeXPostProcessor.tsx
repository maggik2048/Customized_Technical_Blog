"use client";

import { useEffect } from "react";

export default function KaTeXPostProcessor() {
  useEffect(() => {
    const elements = document.querySelectorAll(".katex");

    elements.forEach((el) => {
      const scripts = el.querySelectorAll(
        ".msub, .msup, .msubsup"
      );

      scripts.forEach((node) => {
        (node as HTMLElement).style.color =
          "rgba(250, 205, 70, 0.9)";
      });

      const funcs = el.querySelectorAll(".mop");

      funcs.forEach((node) => {
        (node as HTMLElement).style.color =
          "rgba(255, 220, 120, 0.85)";
      });
    });
  }, []);

  return null;
}
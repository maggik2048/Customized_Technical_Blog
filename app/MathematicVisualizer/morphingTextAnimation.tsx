"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
  active: boolean;
  text?: string;
};

export default function MorphingTextAnimation({
  active,
  text = "Σ → ∀",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);

  const [t, setT] = useState(0);

  // animation driver
  useEffect(() => {
    let start: number | null = null;

    const animate = (time: number) => {
      if (!start) start = time;
      const raw = (time - start) / 800; // duration ~0.8s

      const clamped = active ? Math.min(raw, 1) : Math.max(1 - raw, 0);

      setT(clamped);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [active]);

  // render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const off = offscreenRef.current || document.createElement("canvas");
    offscreenRef.current = off;

    const w = (canvas.width = 220);
    const h = (canvas.height = 120);

    off.width = w;
    off.height = h;

    const octx = off.getContext("2d")!;

    // draw text into offscreen buffer
    octx.clearRect(0, 0, w, h);
    octx.fillStyle = "white";
    octx.font = "60px serif";
    octx.textBaseline = "middle";
    octx.fillText(text, 20, h / 2);

    const image = octx.getImageData(0, 0, w, h).data;

    ctx.clearRect(0, 0, w, h);

    // FIELD PARAMETERS (Manim-style space distortion)
    const time = t * Math.PI * 2;

    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        const i = (y * w + x) * 4;
        const alpha = image[i + 3];

        if (alpha > 50) {
          //  FIELD WARP (Manim core idea)
          const dx =
            Math.sin(y * 0.08 + time) * 6 +
            Math.sin((x + y) * 0.03 + time) * 2;

          const dy =
            Math.cos(x * 0.08 + time) * 6 +
            Math.sin(y * 0.05 + time * 1.5) * 2;

          const fade = 1 - Math.abs(t - 0.5) * 1.2;

          ctx.fillStyle = `rgba(255,255,255,${fade})`;

          ctx.fillRect(
            x + dx,
            y + dy,
            2,
            2
          );
        }
      }
    }
  }, [t, text]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: 220,
        height: 120,
        display: "block",
      }}
    />
  );
}
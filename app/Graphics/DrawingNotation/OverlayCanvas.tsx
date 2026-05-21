"use client";
import React, { useRef, useEffect, useState } from "react";

export interface Point { x: number; y: number; }
export interface Line { points: Point[]; color: string; width: number; }

interface OverlayCanvasProps {
  width: number;
  height: number;
  lines: Line[];
  setLines: (lines: Line[]) => void;
  penColor?: string;
  penWidth?: number;
  enabled?: boolean;
}

export default function OverlayCanvas({
  width,
  height,
  lines,
  setLines,
  penColor = "rgba(255,255,255,0.35)", // 검은 배경용
  penWidth = 3,
  enabled = true,
}: OverlayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);

  // ===== 좌표 계산 =====
  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return "touches" in e
      ? {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        }
      : {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!enabled) return;
    const { x, y } = getPos(e);

    setCurrentLine({
      points: [{ x, y }],
      color: penColor,
      width: penWidth,
    });

    setDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!enabled || !drawing || !currentLine) return;
    const { x, y } = getPos(e);

    setCurrentLine({
      ...currentLine,
      points: [...currentLine.points, { x, y }],
    });
  };

  const endDrawing = () => {
    if (currentLine) setLines([...lines, currentLine]);
    setCurrentLine(null);
    setDrawing(false);
  };

  // ===== 렌더링 =====
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.globalCompositeOperation = "lighter"; // 검은 배경 최적

    // ===== 두께 변화 =====
    const getLineWidth = (p1: Point, p2: Point, baseWidth: number) => {
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const speed = Math.min(dist / 10, 1);

      const minWidth = baseWidth * 0.2;
      const maxWidth = baseWidth * 0.7;

      return maxWidth - (maxWidth - minWidth) * speed;
    };

    // ===== jitter =====
    const jitter = (val: number) =>
      val + (Math.random() - 0.5) * 3.2;

    // ===== grain (강화 버전) =====
    const addGrain = (line: Line) => {
      const density = 10; // 입자 수

      line.points.forEach((p) => {
        for (let i = 0; i < density; i++) {
          const spread = line.width * 4; // 퍼짐 범위

          const offsetX = (Math.random() - 0.5) * spread;
          const offsetY = (Math.random() - 0.5) * spread;

          const dist = Math.hypot(offsetX, offsetY);
          const falloff = Math.max(0, 1 - dist / spread);

          const alpha = Math.random() * 0.7 * falloff;

          const size = Math.random() * 1.8;

          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.fillRect(p.x + offsetX, p.y + offsetY, size, size);
        }
      });
    };

    // ===== 라인 드로잉 =====
    const drawLine = (line: Line) => {
      ctx.strokeStyle = line.color;

      // 덧칠
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();

        line.points.forEach((p, i) => {
          const x = jitter(p.x);
          const y = jitter(p.y);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            const prev = line.points[i - 1];
            ctx.lineWidth = getLineWidth(prev, p, line.width);
            ctx.lineTo(x, y);
          }
        });

        ctx.stroke();
      }

      // grain 추가
      addGrain(line);
    };

    lines.forEach(drawLine);
    if (currentLine) drawLine(currentLine);

  }, [lines, currentLine, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: enabled ? "auto" : "none",
        zIndex: 10,
        background: "transparent",
      }}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={endDrawing}
      onMouseLeave={endDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={endDrawing}
    />
  );
}
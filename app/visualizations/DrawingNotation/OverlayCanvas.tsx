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
  penColor = "rgba(255, 255, 255, 1)", // 연필 느낌
  penWidth = 3,
  enabled = true,
}: OverlayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);

  // ===== 입력 처리 =====
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

    // 연필 느낌 기본 세팅
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.globalCompositeOperation = "multiply";

    // 속도 기반 두께 변화
    const getLineWidth = (p1: Point, p2: Point, baseWidth: number) => {
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      return Math.max(1, baseWidth - dist * 0.8);
    };

    // 미세한 흔들림
    const jitter = (val: number) =>
      val + (Math.random() - 0.5) * 1.2;

    const drawLine = (line: Line) => {
      ctx.strokeStyle = line.color;

      // 연필처럼 여러 번 덧칠
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
    };

    lines.forEach(drawLine);
    if (currentLine) drawLine(currentLine);

  }, [lines, currentLine, width, height]);

  // ===== UI =====
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
        background: "transparent", // 실제 배포용
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
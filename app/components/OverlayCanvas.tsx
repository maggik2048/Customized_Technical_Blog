"use client";
import React, { useRef, useEffect, useState } from "react";

interface Point {
  x: number;
  y: number;
}

interface Line {
  points: Point[];
  color: string;
  width: number;
}

interface OverlayCanvasProps {
  width: number;
  height: number;
  penColor?: string;
  penWidth?: number;
}

export default function OverlayCanvas({
  width,
  height,
  penColor = "yellow",
  penWidth = 4,
}: OverlayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);

  // 그리기 시작
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    const newLine: Line = { points: [{ x, y }], color: penColor, width: penWidth };
    setCurrentLine(newLine);
    setDrawing(true);
  };

  // 그리는 중
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing || !currentLine) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    setCurrentLine((prev) => prev && { ...prev, points: [...prev.points, { x, y }] });
  };

  // 그리기 종료
  const endDrawing = () => {
    if (currentLine) setLines((prev) => [...prev, currentLine]);
    setCurrentLine(null);
    setDrawing(false);
  };

  // Canvas 렌더
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // 초기화
    ctx.clearRect(0, 0, width, height);

    const drawLine = (line: Line) => {
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      line.points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    };

    lines.forEach(drawLine);
    if (currentLine) drawLine(currentLine);
  }, [lines, currentLine, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "auto" }}
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
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
  penColor = "yellow",
  penWidth = 4,
  enabled = true,
}: OverlayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!enabled) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    setCurrentLine({ points: [{ x, y }], color: penColor, width: penWidth });
    setDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!enabled || !drawing || !currentLine) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    setCurrentLine({ ...currentLine, points: [...currentLine.points, { x, y }] });
  };

  const endDrawing = () => {
    if (currentLine) setLines([...lines, currentLine]);
    setCurrentLine(null);
    setDrawing(false);
  };

  const undo = () => setLines(lines.slice(0, -1));

  const exportJSON = () => {
    const dataStr = JSON.stringify(lines);
    const blob = new Blob([dataStr], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "drawing.json";
    link.click();
  };

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const drawLine = (line: Line) => {
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      line.points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
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
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: enabled ? "auto" : "none",
        zIndex: 1,
        background: "rgba(0,0,0,0.05)", // 임시 배경으로 영역 확인
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
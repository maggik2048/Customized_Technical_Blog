"use client";
import { useState } from "react";
import OverlayCanvas, { Line } from "./OverlayCanvas";

interface DrawingOverlayProps {
  width: number;
  height: number;
}

export default function DrawingOverlay({ width, height }: DrawingOverlayProps) {
  const [lines, setLines] = useState<Line[]>([]);
  const [drawingMode, setDrawingMode] = useState(false);

  return (
    <div style={{ position: "relative", width, height, marginTop: 20 }}>
      <div style={{ marginBottom: 10, zIndex: 10, position: "relative" }}>
        <button onClick={() => setDrawingMode(!drawingMode)}>
          {drawingMode ? "Exit Draw Mode" : "Draw"}
        </button>
        {drawingMode && (
          <>
            <button onClick={() => setLines(lines.slice(0, -1))} style={{ marginLeft: 8 }}>
              Undo
            </button>
            <button onClick={() => {
              const dataStr = JSON.stringify(lines);
              console.log("Drawing JSON:", dataStr); // 서버로 보내거나 저장 가능
            }} style={{ marginLeft: 8 }}>
              Export JSON
            </button>
          </>
        )}
      </div>

      <OverlayCanvas
        width={width}
        height={height}
        lines={lines}
        setLines={setLines}
        enabled={drawingMode}
      />
    </div>
  );
}
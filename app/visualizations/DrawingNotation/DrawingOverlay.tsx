"use client";

import { useState } from "react";
import OverlayCanvas, { Line } from "./OverlayCanvas";

export default function DrawingOverlay({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const [lines, setLines] = useState<Line[]>([]);
  const [drawingMode, setDrawingMode] = useState(false);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        zIndex: 999,
        pointerEvents: "none", // 중요 (canvas만 이벤트 받게)
      }}
    >
      {/* UI controls */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1000,
          pointerEvents: "auto",
        }}
      >
        <button onClick={() => setDrawingMode(!drawingMode)}>
          {drawingMode ? "Exit Draw Mode" : "Draw"}
        </button>

        {drawingMode && (
          <>
            <button onClick={() => setLines(lines.slice(0, -1))}>
              Undo
            </button>

            <button
              onClick={() =>
                console.log(JSON.stringify(lines))
              }
            >
              Export
            </button>
          </>
        )}
      </div>

      {/* CANVAS */}
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
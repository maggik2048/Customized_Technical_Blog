import React, { useState } from "react";
import MathVisualizer from "../MathematicVisualizer/MathVisualizer";
interface Vector2 {
  x: number;
  y: number;
}

interface Projection {
  min: number;
  max: number;
}

interface MathData {
  projA: Projection;
  projB: Projection;
  overlap: boolean;
  axisIndex: number;
  axis: Vector2;
}

function dot(a: Vector2, b: Vector2): number {
  return a.x * b.x + a.y * b.y;
}

function normalize(v: Vector2): Vector2 {
  const len = Math.hypot(v.x, v.y);
  return { x: v.x / len, y: v.y / len };
}

function sub(a: Vector2, b: Vector2): Vector2 {
  return { x: a.x - b.x, y: a.y - b.y };
}

function perp(v: Vector2): Vector2 {
  return { x: -v.y, y: v.x };
}

function project(points: Vector2[], axis: Vector2): Projection {
  let min = dot(points[0], axis);
  let max = min;

  for (let p of points) {
    const d = dot(p, axis);
    if (d < min) min = d;
    if (d > max) max = d;
  }

  return { min, max };
}

function createBox(cx: number, cy: number, w: number, h: number, angle: number): Vector2[] {
  const hw = w / 2;
  const hh = h / 2;

  const corners = [
    { x: -hw, y: -hh },
    { x: hw, y: -hh },
    { x: hw, y: hh },
    { x: -hw, y: hh },
  ];

  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return corners.map((p) => ({
    x: cx + p.x * cos - p.y * sin,
    y: cy + p.x * sin + p.y * cos,
  }));
}

export default function SatProjection() {
  const [angleA, setAngleA] = useState<number>(0);
  const [angleB, setAngleB] = useState<number>(0);
  const [axisIndex, setAxisIndex] = useState<number>(0);

  const [posAx, setPosAx] = useState<number>(200);
  const [posAy, setPosAy] = useState<number>(200);
  const [posBx, setPosBx] = useState<number>(300);
  const [posBy, setPosBy] = useState<number>(220);

  const boxA: Vector2[] = createBox(posAx, posAy, 120, 80, angleA);
  const boxB: Vector2[] = createBox(posBx, posBy, 120, 80, angleB);

  const edgeA0: Vector2 = normalize(sub(boxA[1], boxA[0]));
  const edgeA1: Vector2 = normalize(sub(boxA[3], boxA[0]));

  const edgeB0: Vector2 = normalize(sub(boxB[1], boxB[0]));
  const edgeB1: Vector2 = normalize(sub(boxB[3], boxB[0]));

  const axes: Vector2[] = [
    normalize(perp(edgeA0)),
    normalize(perp(edgeA1)),
    normalize(perp(edgeB0)),
    normalize(perp(edgeB1)),
  ];

  const axis: Vector2 = axes[axisIndex];

  const projA: Projection = project(boxA, axis);
  const projB: Projection = project(boxB, axis);

  const overlap: boolean = !(projA.max < projB.min || projB.max < projA.min);

  const mathData: MathData = {
    projA,
    projB,
    overlap,
    axisIndex,
    axis,
  };

  const toPoint = (t: number): Vector2 => ({
    x: axis.x * t,
    y: axis.y * t,
  });

  const A1: Vector2 = toPoint(projA.min);
  const A2: Vector2 = toPoint(projA.max);
  const B1: Vector2 = toPoint(projB.min);
  const B2: Vector2 = toPoint(projB.max);

  return (
    <div style={{ display: "flex", gap: 24 }}>
      
      {/* LEFT: ENGINE */}
      <div className="p-4">
        <h1 className="text-xl font-bold mb-2">
          SAT Axis + CrossProduct:: OBB Collision Algorithm Interaction
        </h1>

        {/* AXIS */}
        <div className="mb-2">
          <label>Current Axis: {axisIndex}</label>
          <input
            type="range"
            min="0"
            max="3"
            step="1"
            value={axisIndex}
            onChange={(e) => setAxisIndex(+e.target.value)}
          />
        </div>

        {/* ROTATION */}
        <div className="mb-2">
          <label>Box A Rotation: {angleA.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="6.28"
            step="0.01"
            value={angleA}
            onChange={(e) => setAngleA(+e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label>Box B Rotation: {angleB.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="6.28"
            step="0.01"
            value={angleB}
            onChange={(e) => setAngleB(+e.target.value)}
          />
        </div>

        {/* POSITION */}
        <div className="mb-2">
          <label>Box A X Translation: {posAx}</label>
          <input type="range" min="0" max="500" value={posAx}
            onChange={(e) => setPosAx(+e.target.value)} />
        </div>

        <div className="mb-2">
          <label>Box A Y Translation: {posAy}</label>
          <input type="range" min="0" max="400" value={posAy}
            onChange={(e) => setPosAy(+e.target.value)} />
        </div>

        <div className="mb-2">
          <label>Box B X Translation: {posBx}</label>
          <input type="range" min="0" max="500" value={posBx}
            onChange={(e) => setPosBx(+e.target.value)} />
        </div>

        <div className="mb-2">
          <label>Box B Y Translation: {posBy}</label>
          <input type="range" min="0" max="400" value={posBy}
            onChange={(e) => setPosBy(+e.target.value)} />
        </div>

        <p className="mb-2">
          IsCollide?: {overlap ? "YES, there is Collision" : "No, Seperated"}
        </p>

        {/* SVG */}
        <svg width="500" height="400" style={{ border: "1px solid black" }}>

          {/* BOX A */}
          <polygon
            points={boxA.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="rgba(0,0,255,0.3)"
            stroke="blue"
          />

          {/* BOX B */}
          <polygon
            points={boxB.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="rgba(255,0,0,0.3)"
            stroke="red"
          />

          {/* AXES */}
          {axes.map((ax, i) => (
            <line
              key={i}
              x1={250 - ax.x * 300}
              y1={200 - ax.y * 300}
              x2={250 + ax.x * 300}
              y2={200 + ax.y * 300}
              stroke={i === axisIndex ? "green" : "gray"}
              strokeWidth={i === axisIndex ? 3 : 1}
            />
          ))}

          {/* PROJECTION LINES */}
          <line
            x1={A1.x}
            y1={A1.y}
            x2={A2.x}
            y2={A2.y}
            stroke="yellow"
            strokeWidth="6"
          />

          <line
            x1={B1.x}
            y1={B1.y}
            x2={B2.x}
            y2={B2.y}
            stroke="orange"
            strokeWidth="6"
          />
        </svg>
      </div>

      {/* RIGHT: MATH UI ONLY */}
      <div style={{ width: 420 }}>
        <MathVisualizer data={mathData} />
      </div>

    </div>
  );
}
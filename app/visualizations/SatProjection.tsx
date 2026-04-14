import React, { useState } from "react";

function dot(a, b) {
  return a.x * b.x + a.y * b.y;
}

function normalize(v) {
  const len = Math.hypot(v.x, v.y);
  return { x: v.x / len, y: v.y / len };
}

function project(points, axis) {
  let min = dot(points[0], axis);
  let max = min;

  for (let p of points) {
    const d = dot(p, axis);
    if (d < min) min = d;
    if (d > max) max = d;
  }

  return { min, max };
}

function createBox(cx, cy, w, h, angle) {
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

export default function App() {
  const [angleA, setAngleA] = useState(0);
  const [angleB, setAngleB] = useState(0);
  const [axisAngle, setAxisAngle] = useState(0);

  const [posAx, setPosAx] = useState(200);
  const [posAy, setPosAy] = useState(200);
  const [posBx, setPosBx] = useState(300);
  const [posBy, setPosBy] = useState(220);

  const boxA = createBox(posAx, posAy, 120, 80, angleA);
  const boxB = createBox(posBx, posBy, 120, 80, angleB);

  const axis = normalize({
    x: Math.cos(axisAngle),
    y: Math.sin(axisAngle),
  });

  const projA = project(boxA, axis);
  const projB = project(boxB, axis);

  const overlap = !(projA.max < projB.min || projB.max < projA.min);

  // 투영된 선분을 실제 좌표로 변환
  const toPoint = (t) => ({
    x: axis.x * t,
    y: axis.y * t,
  });

  const A1 = toPoint(projA.min);
  const A2 = toPoint(projA.max);
  const B1 = toPoint(projB.min);
  const B2 = toPoint(projB.max);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">SAT 투영 시각화</h1>

      <div className="mb-2">
        <label>Box A 회전: {angleA.toFixed(2)}</label>
        <input type="range" min="0" max="6.28" step="0.01" value={angleA} onChange={(e) => setAngleA(+e.target.value)} />
      </div>

      <div className="mb-2">
        <label>Box B 회전: {angleB.toFixed(2)}</label>
        <input type="range" min="0" max="6.28" step="0.01" value={angleB} onChange={(e) => setAngleB(+e.target.value)} />
      </div>

      <div className="mb-2">
        <label>투영 축 각도: {axisAngle.toFixed(2)}</label>
        <input type="range" min="0" max="6.28" step="0.01" value={axisAngle} onChange={(e) => setAxisAngle(+e.target.value)} />
      </div>

      <div className="mb-2">
        <label>Box A X: {posAx}</label>
        <input type="range" min="0" max="500" value={posAx} onChange={(e) => setPosAx(+e.target.value)} />
      </div>

      <div className="mb-2">
        <label>Box A Y: {posAy}</label>
        <input type="range" min="0" max="400" value={posAy} onChange={(e) => setPosAy(+e.target.value)} />
      </div>

      <div className="mb-2">
        <label>Box B X: {posBx}</label>
        <input type="range" min="0" max="500" value={posBx} onChange={(e) => setPosBx(+e.target.value)} />
      </div>

      <div className="mb-2">
        <label>Box B Y: {posBy}</label>
        <input type="range" min="0" max="400" value={posBy} onChange={(e) => setPosBy(+e.target.value)} />
      </div>

      <p className="mb-2">충돌 여부: {overlap ? "겹침" : "분리됨"}</p>

      <svg width="500" height="400" style={{ border: "1px solid black" }}>
        {/* 박스 A */}
        <polygon
          points={boxA.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="rgba(0,0,255,0.3)"
          stroke="blue"
        />

        {/* 박스 B */}
        <polygon
          points={boxB.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="rgba(255,0,0,0.3)"
          stroke="red"
        />

        {/* 축 */}
        <line
          x1={250 - axis.x * 300}
          y1={200 - axis.y * 300}
          x2={250 + axis.x * 300}
          y2={200 + axis.y * 300}
          stroke="green"
        />

        {/* 투영 선분 A (노란색) */}
        <line
          x1={A1.x}
          y1={A1.y}
          x2={A2.x}
          y2={A2.y}
          stroke="yellow"
          strokeWidth="6"
        />

        {/* 투영 선분 B (노란색) */}
        <line
          x1={B1.x}
          y1={B1.y}
          x2={B2.x}
          y2={B2.y}
          stroke="orange"
          strokeWidth="6"
        />
      </svg>

      <div className="mt-4">
        <p>Projection A: [{projA.min.toFixed(2)}, {projA.max.toFixed(2)}]</p>
        <p>Projection B: [{projB.min.toFixed(2)}, {projB.max.toFixed(2)}]</p>
      </div>
    </div>
  );
}


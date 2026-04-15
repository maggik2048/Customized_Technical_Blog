import React, { useState, useEffect } from "react";
import MathDocPanel from "./MathDocPanel";
import { generateDoc } from "./content";

/* =========================
   SAT ENGINE (그대로 유지)
========================= */

function dot(a, b) {
  return a.x * b.x + a.y * b.y;
}

function normalize(v) {
  const len = Math.hypot(v.x, v.y);
  return { x: v.x / len, y: v.y / len };
}

function sub(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}

function perp(v) {
  return { x: -v.y, y: v.x };
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

/* ========================= */

export default function App() {
  const [angleA, setAngleA] = useState(0);
  const [angleB, setAngleB] = useState(0);
  const [axisIndex, setAxisIndex] = useState(0);

  const [posAx, setPosAx] = useState(200);
  const [posAy, setPosAy] = useState(200);
  const [posBx, setPosBx] = useState(300);
  const [posBy, setPosBy] = useState(220);

  const [projA, setProjA] = useState({ min: 0, max: 0 });
  const [projB, setProjB] = useState({ min: 0, max: 0 });
  const [overlap, setOverlap] = useState(false);

  const [displayA, setDisplayA] = useState({ min: 0, max: 0 });
  const [displayB, setDisplayB] = useState({ min: 0, max: 0 });

  /* =========================
     ENGINE UPDATE
  ========================= */

  useEffect(() => {
    const boxA = createBox(posAx, posAy, 120, 80, angleA);
    const boxB = createBox(posBx, posBy, 120, 80, angleB);

    const edgeA0 = normalize(sub(boxA[1], boxA[0]));
    const edgeA1 = normalize(sub(boxA[3], boxA[0]));
    const edgeB0 = normalize(sub(boxB[1], boxB[0]));
    const edgeB1 = normalize(sub(boxB[3], boxB[0]));

    const axes = [
      normalize(perp(edgeA0)),
      normalize(perp(edgeA1)),
      normalize(perp(edgeB0)),
      normalize(perp(edgeB1)),
    ];

    const axis = axes[axisIndex];

    const A = project(boxA, axis);
    const B = project(boxB, axis);

    setProjA(A);
    setProjB(B);
    setOverlap(!(A.max < B.min || B.max < A.min));
  }, [angleA, angleB, axisIndex, posAx, posAy, posBx, posBy]);

  /* =========================
     SMOOTH ANIMATION (Manim 느낌)
  ========================= */

  useEffect(() => {
    let t = 0;

    const startA = displayA;
    const startB = displayB;

    const targetA = projA;
    const targetB = projB;

    function animate() {
      t += 0.08;

      setDisplayA({
        min: startA.min + (targetA.min - startA.min) * t,
        max: startA.max + (targetA.max - startA.max) * t,
      });

      setDisplayB({
        min: startB.min + (targetB.min - startB.min) * t,
        max: startB.max + (targetB.max - startB.max) * t,
      });

      if (t < 1) requestAnimationFrame(animate);
    }

    animate();
  }, [projA, projB]);

  /* =========================
     DOC GENERATION
  ========================= */

  const doc = generateDoc({
    projA: displayA,
    projB: displayB,
    overlap,
    axisIndex,
  });

  /* =========================
     UI
  ========================= */

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 1, padding: 20 }}>
        <h2>SAT Engine Control</h2>

        <button onClick={() => setAxisIndex((a) => (a + 1) % 4)}>
          Change Axis
        </button>

        <div>Axis: {axisIndex}</div>

        <div>Collision: {overlap ? "YES" : "NO"}</div>
      </div>

      <MathDocPanel content={doc} />
    </div>
  );
}
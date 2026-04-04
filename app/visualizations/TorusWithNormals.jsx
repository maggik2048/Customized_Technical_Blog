"use client";

import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { ArrowHelper } from "three";

extend({ ArrowHelper });

export default function TorusWithNormals({ R = 2, r = 0.5, steps = 20 }) {
  const pointsAndNormals = useMemo(() => {
    const data = [];

    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * 2 * Math.PI;

      for (let j = 0; j <= steps; j++) {
        const phi = (j / steps) * 2 * Math.PI;

        const x = (R + r * Math.cos(theta)) * Math.cos(phi);
        const y = (R + r * Math.cos(theta)) * Math.sin(phi);
        const z = r * Math.sin(theta);

        const dTheta = [
          -r * Math.sin(theta) * Math.cos(phi),
          -r * Math.sin(theta) * Math.sin(phi),
          r * Math.cos(theta),
        ];

        const dPhi = [
          -(R + r * Math.cos(theta)) * Math.sin(phi),
          (R + r * Math.cos(theta)) * Math.cos(phi),
          0,
        ];

        const nx =
          dTheta[1] * dPhi[2] - dTheta[2] * dPhi[1];
        const ny =
          dTheta[2] * dPhi[0] - dTheta[0] * dPhi[2];
        const nz =
          dTheta[0] * dPhi[1] - dTheta[1] * dPhi[0];

        const length = Math.sqrt(nx * nx + ny * ny + nz * nz);

        data.push({
          position: [x, y, z],
          normal: [nx / length, ny / length, nz / length],
        });
      }
    }

    return data;
  }, [R, r, steps]);

  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      {/* 🔥 토러스 본체 */}
      <mesh>
        <torusGeometry args={[R, r, 64, 100]} />
        <meshStandardMaterial wireframe />
      </mesh>

      {/* 🔥 법선 벡터 */}
      {pointsAndNormals.map((p, idx) => (
        <arrowHelper
          key={idx}
          args={[p.normal, p.position, 0.2, 0xff0000]}
        />
      ))}

      <OrbitControls />
    </Canvas>
  );
}
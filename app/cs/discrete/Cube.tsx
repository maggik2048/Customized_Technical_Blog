"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function Cube() {
  return (
    <Canvas style={{ height: "400px" }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <mesh rotation={[45, 45, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
}
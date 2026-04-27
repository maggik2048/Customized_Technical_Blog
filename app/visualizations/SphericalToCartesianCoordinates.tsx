import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

export default function LidarVisualization() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const pointRef = useRef<THREE.Mesh | null>(null);
  const lineRef = useRef<THREE.Line | null>(null);

  const [theta, setTheta] = useState(Math.PI / 4);
  const [phi, setPhi] = useState(Math.PI / 6);
  const [r, setR] = useState(1.5);

  // 1️⃣ INIT (한 번만)
  useEffect(() => {
    if (!mountRef.current) return;

    const width = 600;
    const height = 400;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      width / height,
      0.1,
      1000
    );
    camera.position.set(3, 3, 3);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const axes = new THREE.AxesHelper(2);
    scene.add(axes);

    const point = new THREE.Mesh(
      new THREE.SphereGeometry(0.05),
      new THREE.MeshBasicMaterial()
    );

    const line = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial()
    );

    scene.add(point);
    scene.add(line);

    pointRef.current = point;
    lineRef.current = line;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // 2️⃣ UPDATE ONLY
  useEffect(() => {
    if (!pointRef.current || !lineRef.current) return;

    const x = r * Math.cos(phi) * Math.cos(theta);
    const y = r * Math.cos(phi) * Math.sin(theta);
    const z = r * Math.sin(phi);

    pointRef.current.position.set(x, y, z);

    lineRef.current.geometry.setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(x, y, z),
    ]);
  }, [theta, phi, r]);

  return (
    <div style={{ display: "flex", gap: 12 }}>
      
      {/* CONTROL */}
      <div style={{ width: 220, background: "#fff", padding: 10 }}>
        <div>
          theta: {theta.toFixed(2)}
          <input
            type="range"
            min={-Math.PI}
            max={Math.PI}
            step={0.01}
            value={theta}
            onChange={(e) => setTheta(+e.target.value)}
          />
        </div>

        <div>
          phi: {phi.toFixed(2)}
          <input
            type="range"
            min={-Math.PI / 2}
            max={Math.PI / 2}
            step={0.01}
            value={phi}
            onChange={(e) => setPhi(+e.target.value)}
          />
        </div>

        <div>
          r: {r.toFixed(2)}
          <input
            type="range"
            min={0}
            max={5}
            step={0.01}
            value={r}
            onChange={(e) => setR(+e.target.value)}
          />
        </div>
      </div>

      {/* VIEWPORT */}
      <div
        ref={mountRef}
        style={{
          width: 600,
          height: 400,
          overflow: "hidden",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
}
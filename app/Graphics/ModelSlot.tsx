"use client";

import { useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function ModelSlot() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  const initThree = (fileUrl: string) => {
    if (!mountRef.current) return;

    // cleanup previous canvas
    mountRef.current.innerHTML = "";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(2, 2, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5);
    scene.add(light);

    const loader = new GLTFLoader();

    loader.load(fileUrl, (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file); //  local blob url
    setLoaded(true);
    initThree(url);
  };

  return (
    <div style={{ width: "100%", height: "500px", position: "relative" }}>
      {!loaded && (
        <div style={{ position: "absolute", zIndex: 10 }}>
          <label style={{ padding: 10, background: "#333", color: "white" }}>
            Upload Model
            <input
              type="file"
              accept=".glb,.gltf"
              onChange={handleUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>
      )}

      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
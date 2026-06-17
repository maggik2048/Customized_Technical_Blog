// app/components/Markdown/Theme/CodeBlock3D.tsx
"use client";

import React, { useRef, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { useHDRI } from "./HDRIProvider";

interface CodeBlock3DProps {
  children: string;
  language?: string;
  index?: number;
}

export function CodeBlock3D({ children, language = "text", index = 0 }: CodeBlock3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { texture: hdriTexture } = useHDRI();
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const wireframeRef = useRef<THREE.LineSegments | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // 🆕 각 블록의 뷰포트 상대 위치 ( -1 ~ 1 )
  const [viewportPosition, setViewportPosition] = useState(0);
  
  // 🆕 랜덤 위치/회전 값 (index 기반 + 랜덤 시드)
  const randomOffset = useMemo(() => {
    // index를 시드로 사용하여 일관된 랜덤 값 생성
    const seed = index * 7.3;
    return {
      x: (Math.sin(seed) * 1.2 + Math.cos(seed * 0.7) * 0.8),
      y: (Math.cos(seed * 1.3) * 0.8 + Math.sin(seed * 0.5) * 1.0),
      z: (Math.sin(seed * 0.9) * 0.4 + Math.cos(seed * 1.7) * 0.3),
      rotX: (Math.sin(seed * 2.1) * 0.15),
      rotY: (Math.cos(seed * 1.7) * 0.15),
      rotZ: (Math.sin(seed * 1.3) * 0.08),
      scale: 0.85 + Math.sin(seed * 1.1) * 0.15,
    };
  }, [index]);

  // 코드를 Canvas Texture로 변환
  const codeTexture = useMemo(() => {
    const lines = String(children).split("\n");
    const lineHeight = 24;
    const padding = 30;
    const maxLines = Math.min(lines.length, 30);
    const canvasHeight = Math.max(300, maxLines * lineHeight + padding * 2);
    const canvasWidth = 800;

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext("2d")!;
    
    // 배경
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 줄 번호
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.font = "14px monospace";
    lines.forEach((line, i) => {
      if (i < maxLines) {
        ctx.fillText(`${i + 1}`, 12, padding + i * lineHeight + 14);
      }
    });

    // 코드
    ctx.fillStyle = "rgba(20, 20, 20, 0.92)";
    ctx.font = "15px monospace";
    lines.forEach((line, i) => {
      if (i < maxLines) {
        const truncated = line.length > 60 ? line.slice(0, 57) + "..." : line;
        ctx.fillText(truncated, 45, padding + i * lineHeight + 14);
      }
    });

    // 구분선
    ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(35, 0);
    ctx.lineTo(35, canvasHeight);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [children]);

  // 🆕 뷰포트 위치 추적 - 각 블록이 독립적으로 계산
  useEffect(() => {
    const updatePosition = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      
      // -1 (화면 아래) ~ 1 (화면 위)
      const normalized = (viewportCenter - center) / (window.innerHeight / 2);
      setViewportPosition(Math.max(-1, Math.min(1, normalized)));
    };

    const handleScroll = () => {
      requestAnimationFrame(updatePosition);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    
    updatePosition();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Three.js 씬 설정
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.clientWidth || 600;
    const height = canvas.clientHeight || 400;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera - 각 블록마다 독립적인 카메라
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 30);
    camera.position.set(0, 0, 7);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    // 오목/볼록 평면
    const geometry = new THREE.PlaneGeometry(4.0, 3.0, 64, 64);
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const u = x / 2.0;
      const v = y / 1.5;
      const distortion = 0.12;
      const z = (u * u + v * v) * distortion;
      positions.setZ(i, z);
    }
    geometry.computeVertexNormals();

    // 크롬 재질
    const material = new THREE.MeshPhysicalMaterial({
      map: codeTexture,
      envMap: hdriTexture || undefined,
      envMapIntensity: hdriTexture ? 2.0 : 0.5,
      metalness: 0.95,
      roughness: 0.1,
      clearcoat: 0.4,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
      transparent: true,
      opacity: 0.93,
      side: THREE.DoubleSide,
      ior: 2.5,
      color: new THREE.Color(0.9, 0.92, 0.95),
      emissive: new THREE.Color(0.03, 0.03, 0.04),
      emissiveIntensity: 0.1,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // 조명
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(2, 3, 4);
    scene.add(dirLight);

    // 테두리
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x8899aa,
      transparent: true,
      opacity: 0.15,
    });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    scene.add(wireframe);
    wireframeRef.current = wireframe;

    // 🆕 랜덤 위치 적용 (초기 위치)
    mesh.position.x = randomOffset.x * 0.3;
    mesh.position.y = randomOffset.y * 0.3;
    mesh.position.z = randomOffset.z * 0.2;
    mesh.rotation.x = randomOffset.rotX;
    mesh.rotation.y = randomOffset.rotY;
    mesh.rotation.z = randomOffset.rotZ;
    mesh.scale.set(randomOffset.scale, randomOffset.scale, randomOffset.scale);

    // 🆕 애니메이션 - viewportPosition + 랜덤 오프셋 결합
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (meshRef.current && cameraRef.current) {
        // 🆕 viewportPosition으로 렌즈 위치 결정 (각 블록 독립적)
        const targetY = viewportPosition * -0.8;
        
        // 랜덤 오프셋 + viewport 반응
        meshRef.current.position.x = randomOffset.x * 0.3 + Math.sin(Date.now() * 0.0003 + index) * 0.02;
        meshRef.current.position.y = randomOffset.y * 0.3 + targetY * 0.2;
        meshRef.current.position.z = randomOffset.z * 0.2 + Math.sin(Date.now() * 0.0004 + index * 0.5) * 0.01;
        
        // 카메라도 각 블록의 위치에 따라 독립적으로 반응
        cameraRef.current.position.y = targetY * 0.3 + randomOffset.y * 0.1;
        cameraRef.current.position.x = randomOffset.x * 0.1;
        cameraRef.current.lookAt(
          meshRef.current.position.x * 0.3,
          meshRef.current.position.y * 0.5,
          0
        );
        
        // 미세한 브레스 효과
        const breathe = Math.sin(Date.now() * 0.0005 + index * 0.7) * 0.002;
        meshRef.current.position.z += breathe;
        
        // 아주 느린 회전 (각 블록마다 다른 속도)
        const rotationSpeed = 0.002 + (viewportPosition * 0.001) + (index * 0.0003);
        meshRef.current.rotation.y += rotationSpeed;
        meshRef.current.rotation.x = Math.sin(Date.now() * 0.0004 + index * 0.3) * 0.02 + viewportPosition * 0.02;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // 리사이즈
    const handleResize = () => {
      if (!canvasRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      if (w > 0 && h > 0) {
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      
      if (geometry) {
        geometry.dispose();
      }
      if (material) {
        material.dispose();
      }
      if (codeTexture) {
        codeTexture.dispose();
      }
      if (edges) {
        edges.dispose();
      }
      if (lineMat) {
        lineMat.dispose();
      }
      
      sceneRef.current = null;
      cameraRef.current = null;
      meshRef.current = null;
      wireframeRef.current = null;
    };
  }, [hdriTexture, codeTexture, viewportPosition, randomOffset, index]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", position: "relative" }}>
      <canvas
        ref={canvasRef}
        className="w-full rounded-2xl"
        style={{
          height: "320px",
          display: "block",
          background: "transparent",
        }}
      />
    </div>
  );
}
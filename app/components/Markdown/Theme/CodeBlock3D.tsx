"use client";

import React, { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useHDRI } from "./HDRIProvider";

interface CodeBlock3DProps {
  children: string;
  language?: string;
}

export function CodeBlock3D({ children, language = "text" }: CodeBlock3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hdriTexture = useHDRI();
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const animationRef = useRef<number | null>(null);

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
    
    // 배경 (반투명 흰색)
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 라인 넘버
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.font = "14px monospace";
    lines.forEach((line, i) => {
      if (i < maxLines) {
        ctx.fillText(`${i + 1}`, 12, padding + i * lineHeight + 14);
      }
    });

    // 코드 텍스트
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

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.clientWidth || 600;
    const height = canvas.clientHeight || 400;

    console.log("🎨 CodeBlock3D: 초기화 시작");

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 20);
    camera.position.set(0, 0.2, 5.5);
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

    console.log("✅ Renderer created");

    // ============================================================
    // 1. PlaneGeometry (오목/볼록 렌즈 효과)
    // ============================================================
    const geometry = new THREE.PlaneGeometry(3.8, 2.8, 64, 64);
    
    // 정점 변형으로 오목/볼록 효과
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const u = x / 1.9;
      const v = y / 1.4;
      
      // 볼록 렌즈 효과 (양수: 볼록, 음수: 오목)
      const distortion = 0.15;
      const z = (u * u + v * v) * distortion;
      positions.setZ(i, z);
    }
    geometry.computeVertexNormals();

    console.log("✅ Geometry created with distortion");

    // ============================================================
    // 2. 크롬 재질 (HDRI 반사 + 코드 텍스처)
    // ============================================================
    const material = new THREE.MeshPhysicalMaterial({
      // 코드 텍스처
      map: codeTexture,
      
      // HDRI 환경 반사
      envMap: hdriTexture || undefined,
      envMapIntensity: hdriTexture ? 2.0 : 0.5,
      
      // ✅ 크롬 재질 설정
      metalness: 0.95,
      roughness: 0.1,
      
      // 광학 특성
      clearcoat: 0.4,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
      
      // 투명도
      transparent: true,
      opacity: 0.93,
      side: THREE.DoubleSide,
      
      // IOR (굴절률)
      ior: 2.5,
      
      // 색상 (크롬 - 약간 청색빛)
      color: new THREE.Color(0.9, 0.92, 0.95),
      
      // Fallback: HDRI 없을 때도 보이도록
      emissive: new THREE.Color(0.03, 0.03, 0.04),
      emissiveIntensity: 0.1,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = 0;
    scene.add(mesh);
    meshRef.current = mesh;

    console.log("✅ Mesh created with chrome material");

    // ============================================================
    // 3. 조명 (HDRI 없을 때 대비)
    // ============================================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(2, 3, 4);
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0x4488ff, 0.2);
    dirLight2.position.set(-3, 1, 2);
    scene.add(dirLight2);

    // ============================================================
    // 4. 얇은 테두리 (크롬 프레임 느낌)
    // ============================================================
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x8899aa,
      transparent: true,
      opacity: 0.2,
    });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    scene.add(wireframe);

    // ============================================================
    // 5. 애니메이션 (회전 + 떨림)
    // ============================================================
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (meshRef.current) {
        // 미세한 떨림 (생동감)
        const breathe = Math.sin(Date.now() * 0.0005) * 0.002;
        meshRef.current.position.z = breathe;
        
        // ✅ 천천히 회전 (크롬 반사 효과 강조)
        meshRef.current.rotation.y += 0.003;
        meshRef.current.rotation.x = Math.sin(Date.now() * 0.0004) * 0.03;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    console.log("✅ Animation started");

    // ============================================================
    // 6. 리사이즈
    // ============================================================
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

    // ============================================================
    // 7. Cleanup
    // ============================================================
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      geometry.dispose();
      material.dispose();
      codeTexture.dispose();
      edges.dispose();
      lineMat.dispose();
    };
  }, [hdriTexture, codeTexture]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-2xl"
      style={{
        height: "320px",
        display: "block",
        background: "transparent",
      }}
    />
  );
}
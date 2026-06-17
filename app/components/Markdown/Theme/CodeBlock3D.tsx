// app/components/Markdown/Theme/CodeBlock3D.tsx
"use client";

import React, { useRef, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { useHDRI } from "./HDRIProvider";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

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
  const animationRef = useRef<number | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const whiteboardRef = useRef<THREE.Mesh | null>(null);
  const frameRef = useRef<THREE.Mesh | null>(null);
  
  const [viewportPosition, setViewportPosition] = useState(0);
  
  // 랜덤 오프셋
  const randomOffset = useMemo(() => {
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
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.font = "14px monospace";
    lines.forEach((line, i) => {
      if (i < maxLines) {
        ctx.fillText(`${i + 1}`, 12, padding + i * lineHeight + 14);
      }
    });

    ctx.fillStyle = "rgba(20, 20, 20, 0.92)";
    ctx.font = "15px monospace";
    lines.forEach((line, i) => {
      if (i < maxLines) {
        const truncated = line.length > 60 ? line.slice(0, 57) + "..." : line;
        ctx.fillText(truncated, 45, padding + i * lineHeight + 14);
      }
    });

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

  // 뷰포트 위치 추적
  useEffect(() => {
    const updatePosition = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
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

  // Three.js 씬 설정 (화이트보드 + 금속 프레임)
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.clientWidth || 600;
    const height = canvas.clientHeight || 400;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 30);
    camera.position.set(3.5, 2.0, 5.5);
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

    // Group
    const group = new THREE.Group();
    groupRef.current = group;

    // ============================================================
    // 1. 화이트보드 (크롬 재질)
    // ============================================================
    const boardWidth = 4.4;
    const boardHeight = 2.8;
    const boardDepth = 0.08;

    const boardGeometry = new THREE.BoxGeometry(boardWidth, boardHeight, boardDepth);
    const boardMaterial = new THREE.MeshPhysicalMaterial({
      map: codeTexture,
      color: new THREE.Color(0.92, 0.93, 0.95),
      roughness: 0.1,
      metalness: 0.9,
      clearcoat: 0.3,
      clearcoatRoughness: 0.1,
      envMap: hdriTexture || undefined,
      envMapIntensity: 1.5,
      reflectivity: 0.9,
      side: THREE.DoubleSide,
      ior: 1.5,
    });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.z = 0;
    group.add(board);
    whiteboardRef.current = board;

    // ============================================================
    // 2. 금속 프레임 (두껍고 반짝)
    // ============================================================
    const frameMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.5, 0.5, 0.55),
      roughness: 0.05,
      metalness: 0.98,
      envMap: hdriTexture || undefined,
      envMapIntensity: 3.5,
      clearcoat: 0.5,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
      ior: 2.0,
    });

    const frameThickness = 0.18;
    const frameWidth = boardWidth + frameThickness * 2.5;
    const frameHeight = boardHeight + frameThickness * 2.5;
    const frameDepth = 0.35;
    const frameZ = 0.06;

    // 상단
    const topFrame = new THREE.Mesh(
      new THREE.BoxGeometry(frameWidth, frameThickness, frameDepth),
      frameMaterial
    );
    topFrame.position.set(0, frameHeight / 2, frameZ);
    group.add(topFrame);

    // 하단
    const bottomFrame = new THREE.Mesh(
      new THREE.BoxGeometry(frameWidth, frameThickness, frameDepth),
      frameMaterial
    );
    bottomFrame.position.set(0, -frameHeight / 2, frameZ);
    group.add(bottomFrame);

    // 좌측
    const leftFrame = new THREE.Mesh(
      new THREE.BoxGeometry(frameThickness, frameHeight, frameDepth),
      frameMaterial
    );
    leftFrame.position.set(-frameWidth / 2, 0, frameZ);
    group.add(leftFrame);

    // 우측
    const rightFrame = new THREE.Mesh(
      new THREE.BoxGeometry(frameThickness, frameHeight, frameDepth),
      frameMaterial
    );
    rightFrame.position.set(frameWidth / 2, 0, frameZ);
    group.add(rightFrame);

    frameRef.current = topFrame;

    // ============================================================
    // 3. 프레임 모서리 (둥근 볼트)
    // ============================================================
    const cornerMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.45, 0.45, 0.50),
      roughness: 0.03,
      metalness: 0.99,
      envMap: hdriTexture || undefined,
      envMapIntensity: 4.0,
      reflectivity: 1.0,
    });

    const cornerPositions = [
      [-frameWidth / 2, -frameHeight / 2],
      [-frameWidth / 2, frameHeight / 2],
      [frameWidth / 2, -frameHeight / 2],
      [frameWidth / 2, frameHeight / 2],
    ];

    cornerPositions.forEach(([x, y]) => {
      const corner = new THREE.Mesh(
        new THREE.CylinderGeometry(frameThickness * 0.9, frameThickness * 0.9, frameDepth * 1.2, 16),
        cornerMaterial
      );
      corner.position.set(x, y, frameZ);
      corner.rotation.x = Math.PI / 2;
      group.add(corner);
    });

    // ============================================================
    // 4. 뒷면 프레임
    // ============================================================
    const backFrameMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.4, 0.4, 0.45),
      roughness: 0.1,
      metalness: 0.95,
      envMap: hdriTexture || undefined,
      envMapIntensity: 2.0,
      side: THREE.BackSide,
    });

    const backFrameZ = -0.06;
    const backDepth = frameDepth * 0.5;

    [
      { x: 0, y: frameHeight / 2, w: frameWidth, h: frameThickness },
      { x: 0, y: -frameHeight / 2, w: frameWidth, h: frameThickness },
      { x: -frameWidth / 2, y: 0, w: frameThickness, h: frameHeight },
      { x: frameWidth / 2, y: 0, w: frameThickness, h: frameHeight },
    ].forEach(({ x, y, w, h }) => {
      const backFrame = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, backDepth),
        backFrameMaterial
      );
      backFrame.position.set(x, y, backFrameZ);
      group.add(backFrame);
    });

    // ============================================================
    // 5. 조명
    // ============================================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);

    scene.add(group);

    // ============================================================
    // 6. 애니메이션
    // ============================================================
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      if (groupRef.current && cameraRef.current) {
        const targetY = viewportPosition * -0.8;
        
        groupRef.current.position.x = randomOffset.x * 0.3 + Math.sin(Date.now() * 0.0003 + index) * 0.02;
        groupRef.current.position.y = randomOffset.y * 0.3 + targetY * 0.2;
        groupRef.current.position.z = randomOffset.z * 0.2 + Math.sin(Date.now() * 0.0004 + index * 0.5) * 0.01;
        
        groupRef.current.rotation.y += 0.002 + (viewportPosition * 0.001) + (index * 0.0003);
        groupRef.current.rotation.x = Math.sin(Date.now() * 0.0004 + index * 0.3) * 0.02 + viewportPosition * 0.02;
        
        cameraRef.current.position.y = targetY * 0.3 + randomOffset.y * 0.1;
        cameraRef.current.position.x = randomOffset.x * 0.1;
        cameraRef.current.lookAt(
          groupRef.current.position.x * 0.3,
          groupRef.current.position.y * 0.5,
          0
        );
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
      
      // Cleanup geometries and materials
      boardGeometry.dispose();
      boardMaterial.dispose();
      frameMaterial.dispose();
      cornerMaterial.dispose();
      backFrameMaterial.dispose();
      if (codeTexture) codeTexture.dispose();
      
      sceneRef.current = null;
      cameraRef.current = null;
      groupRef.current = null;
      whiteboardRef.current = null;
      frameRef.current = null;
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
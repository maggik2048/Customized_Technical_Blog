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
  const animationRef = useRef<number | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const whiteboardRef = useRef<THREE.Mesh | null>(null);
  const frameRef = useRef<THREE.Mesh | null>(null);
  
  const [viewportPosition, setViewportPosition] = useState(0);
  
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

  // 고화질 코드 텍스처
  const codeTexture = useMemo(() => {
    const lines = String(children).split("\n");
    const lineHeight = 28;
    const padding = 40;
    const maxLines = Math.min(lines.length, 30);
    const canvasHeight = Math.max(400, maxLines * lineHeight + padding * 2);
    const canvasWidth = 1200;

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext("2d")!;
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.font = "16px monospace";
    ctx.textBaseline = "top";
    lines.forEach((line, i) => {
      if (i < maxLines) {
        ctx.fillText(`${i + 1}`, 16, padding + i * lineHeight + 4);
      }
    });

    ctx.fillStyle = "rgba(20, 20, 20, 0.95)";
    ctx.font = "17px monospace";
    ctx.textBaseline = "top";
    lines.forEach((line, i) => {
      if (i < maxLines) {
        const truncated = line.length > 70 ? line.slice(0, 67) + "..." : line;
        ctx.fillText(truncated, 55, padding + i * lineHeight + 4);
      }
    });

    ctx.strokeStyle = "rgba(0, 0, 0, 0.06)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(45, 0);
    ctx.lineTo(45, canvasHeight);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.anisotropy = 8;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
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

  // Three.js 씬 설정
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.clientWidth || 600;
    const height = canvas.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 30);
    camera.position.set(3.5, 2.0, 5.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

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

    const group = new THREE.Group();
    groupRef.current = group;

    // ============================================================
    // 1. 화이트보드 본체
    // ============================================================
    const boardWidth = 4.4;
    const boardHeight = 2.8;
    const boardDepth = 0.06; // ✅ 더 얇게

    const boardGeometry = new THREE.BoxGeometry(boardWidth, boardHeight, boardDepth);
    const boardMaterial = new THREE.MeshPhysicalMaterial({
      map: codeTexture,
      color: new THREE.Color(0.98, 0.98, 0.99),
      roughness: 0.05,
      metalness: 0.9,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
      envMap: hdriTexture || undefined,
      envMapIntensity: 1.8,
      reflectivity: 0.95,
      side: THREE.DoubleSide,
      ior: 1.5,
    });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.z = 0;
    group.add(board);
    whiteboardRef.current = board;

    // ============================================================
    // 2. 얇은 금속 프레임 (현실적인 두께)
    // ============================================================
    const frameMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.45, 0.45, 0.50),
      roughness: 0.03,
      metalness: 0.98,
      envMap: hdriTexture || undefined,
      envMapIntensity: 4.0,
      clearcoat: 0.6,
      clearcoatRoughness: 0.03,
      reflectivity: 1.0,
      ior: 2.0,
    });

    // ✅ 얇은 프레임 (0.18 → 0.06)
    const frameThickness = 0.06;
    const frameWidth = boardWidth + frameThickness * 2;
    const frameHeight = boardHeight + frameThickness * 2;
    const frameDepth = 0.12; // ✅ 얇게
    const frameZ = 0.02; // ✅ 앞으로 약간

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
    // 3. 분필 받침대 (트레이)
    // ============================================================
    const trayMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.3, 0.3, 0.35),
      roughness: 0.2,
      metalness: 0.7,
      envMap: hdriTexture || undefined,
      envMapIntensity: 2.0,
      clearcoat: 0.2,
      clearcoatRoughness: 0.2,
    });

    const trayWidth = boardWidth * 0.7;
    const trayHeight = 0.04;
    const trayDepth = 0.12;
    const trayY = -boardHeight / 2 - 0.08;

    // 트레이 본체
    const tray = new THREE.Mesh(
      new THREE.BoxGeometry(trayWidth, trayHeight, trayDepth),
      trayMaterial
    );
    tray.position.set(0, trayY, 0.04);
    group.add(tray);

    // 트레이 앞쪽 테두리 (살짝 올라간 부분)
    const trayLipMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.35, 0.35, 0.4),
      roughness: 0.15,
      metalness: 0.8,
      envMap: hdriTexture || undefined,
      envMapIntensity: 2.5,
    });

    const trayLip = new THREE.Mesh(
      new THREE.BoxGeometry(trayWidth, 0.015, 0.015),
      trayLipMaterial
    );
    trayLip.position.set(0, trayY + 0.025, 0.1);
    group.add(trayLip);

    // ============================================================
    // 4. 분필 (Chalk)
    // ============================================================
    const chalkMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.95, 0.92, 0.85),
      roughness: 0.9,
      metalness: 0.0,
      clearcoat: 0.0,
    });

    const chalkColors = [
      new THREE.Color(0.95, 0.92, 0.85), // 흰색
      new THREE.Color(0.9, 0.7, 0.7),    // 분홍
      new THREE.Color(0.7, 0.8, 0.9),    // 하늘
      new THREE.Color(0.8, 0.9, 0.7),    // 연두
      new THREE.Color(0.9, 0.8, 0.6),    // 노랑
    ];

    const chalkPositions = [
      { x: -0.8, rot: 0.1 },
      { x: -0.5, rot: -0.15 },
      { x: -0.2, rot: 0.05 },
      { x: 0.1, rot: -0.08 },
      { x: 0.4, rot: 0.12 },
    ];

    chalkPositions.forEach((pos, i) => {
      const chalk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.018, 0.08, 8),
        chalkMaterial.clone()
      );
      chalk.material.color = chalkColors[i % chalkColors.length];
      chalk.position.set(pos.x, trayY + 0.04, 0.04);
      chalk.rotation.x = 0.2 + pos.rot;
      chalk.rotation.z = pos.rot * 0.5;
      group.add(chalk);
    });

    // ============================================================
    // 5. 지우개 (Eraser)
    // ============================================================
    const eraserMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.2, 0.2, 0.25),
      roughness: 0.8,
      metalness: 0.0,
    });

    const eraser = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.025, 0.06),
      eraserMaterial
    );
    eraser.position.set(0.7, trayY + 0.025, 0.04);
    group.add(eraser);

    // 지우개 흰색 부분 (지우개 면)
    const eraserTipMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.9, 0.85, 0.8),
      roughness: 0.95,
      metalness: 0.0,
    });

    const eraserTip = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.005, 0.05),
      eraserTipMaterial
    );
    eraserTip.position.set(0.7, trayY + 0.04, 0.04);
    group.add(eraserTip);

    // ============================================================
    // 6. 뒷면 프레임 (얇게)
    // ============================================================
    const backFrameMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.4, 0.4, 0.45),
      roughness: 0.08,
      metalness: 0.95,
      envMap: hdriTexture || undefined,
      envMapIntensity: 2.5,
      side: THREE.BackSide,
    });

    const backFrameZ = -0.02;
    const backDepth = 0.06;

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
    // 7. 조명
    // ============================================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);
    const dirLight2 = new THREE.DirectionalLight(0x8888ff, 0.3);
    dirLight2.position.set(-3, 2, -4);
    scene.add(dirLight2);

    scene.add(group);

    // ============================================================
    // 8. 애니메이션
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
      
      boardGeometry.dispose();
      boardMaterial.dispose();
      frameMaterial.dispose();
      trayMaterial.dispose();
      trayLipMaterial.dispose();
      chalkMaterial.dispose();
      eraserMaterial.dispose();
      eraserTipMaterial.dispose();
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
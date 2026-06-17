"use client";

import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
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
  const frameCountRef = useRef<number>(0);
  
  const [viewportPosition, setViewportPosition] = useState(0);

  // ✅ 캔버스 재사용을 위한 ref
  const codeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const codeTextureRef = useRef<THREE.CanvasTexture | null>(null);
  
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

  // ✅ 최적화된 코드 텍스처 생성 (캔버스 재사용)
  const codeTexture = useMemo(() => {
    const lines = String(children).split("\n");
    const lineHeight = 28;
    const padding = 40;
    const maxLines = Math.min(lines.length, 30);
    const canvasHeight = Math.max(400, maxLines * lineHeight + padding * 2);
    const canvasWidth = 1200;

    // ✅ 기존 캔버스 재사용
    if (!codeCanvasRef.current) {
      codeCanvasRef.current = document.createElement("canvas");
    }
    
    const canvas = codeCanvasRef.current;
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

    // ✅ 기존 텍스처 업데이트 또는 새로 생성
    if (codeTextureRef.current) {
      codeTextureRef.current.needsUpdate = true;
      return codeTextureRef.current;
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    codeTextureRef.current = texture;
    return texture;
  }, [children]);

  // ✅ 메모리 정리 함수 (컴포넌트 레벨에서 정의)
  const disposeObject = useCallback((obj: THREE.Object3D) => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry?.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else if (child.material) {
          child.material.dispose();
        }
      }
    });
  }, []);

  // ✅ 리사이즈 핸들러 (컴포넌트 레벨에서 정의)
  const handleResize = useCallback(() => {
    if (!canvasRef.current || !rendererRef.current || !cameraRef.current) return;
    const w = canvasRef.current.clientWidth;
    const h = canvasRef.current.clientHeight;
    if (w > 0 && h > 0) {
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    }
  }, []);

  // 뷰포트 위치 추적 (최적화)
  useEffect(() => {
    let rafId: number | null = null;
    
    const updatePosition = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const normalized = (viewportCenter - center) / (window.innerHeight / 2);
      setViewportPosition(Math.max(-1, Math.min(1, normalized)));
    };

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    updatePosition();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
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

    // 화이트보드 본체
    const boardWidth = 4.4;
    const boardHeight = 2.8;
    const boardDepth = 0.06;

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

    // 프레임
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

    const frameThickness = 0.05;
    const frameWidth = boardWidth + frameThickness * 2.5;
    const frameHeight = boardHeight + frameThickness * 2.5;
    const frameDepth = 0.10;
    const frameZ = 0.015;

    const topFrame = new THREE.Mesh(
      new THREE.BoxGeometry(frameWidth, frameThickness, frameDepth),
      frameMaterial
    );
    topFrame.position.set(0, frameHeight / 2, frameZ);
    topFrame.rotation.x = 0.02;
    group.add(topFrame);

    const bottomFrame = new THREE.Mesh(
      new THREE.BoxGeometry(frameWidth, frameThickness, frameDepth),
      frameMaterial
    );
    bottomFrame.position.set(0, -frameHeight / 2, frameZ);
    bottomFrame.rotation.x = -0.02;
    group.add(bottomFrame);

    const leftFrame = new THREE.Mesh(
      new THREE.BoxGeometry(frameThickness, frameHeight, frameDepth),
      frameMaterial
    );
    leftFrame.position.set(-frameWidth / 2, 0, frameZ);
    leftFrame.rotation.y = 0.02;
    group.add(leftFrame);

    const rightFrame = new THREE.Mesh(
      new THREE.BoxGeometry(frameThickness, frameHeight, frameDepth),
      frameMaterial
    );
    rightFrame.position.set(frameWidth / 2, 0, frameZ);
    rightFrame.rotation.y = -0.02;
    group.add(rightFrame);

    const cornerMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.48, 0.48, 0.52),
      roughness: 0.02,
      metalness: 0.99,
      envMap: hdriTexture || undefined,
      envMapIntensity: 4.5,
      reflectivity: 1.0,
    });

    const cornerSize = frameThickness * 1.2;
    const cornerPositions = [
      [-frameWidth / 2, -frameHeight / 2],
      [-frameWidth / 2, frameHeight / 2],
      [frameWidth / 2, -frameHeight / 2],
      [frameWidth / 2, frameHeight / 2],
    ];

    cornerPositions.forEach(([x, y]) => {
      const corner = new THREE.Mesh(
        new THREE.BoxGeometry(cornerSize, cornerSize, frameDepth * 1.1),
        cornerMaterial
      );
      corner.position.set(x, y, frameZ);
      corner.rotation.z = 0.01;
      group.add(corner);
    });

    frameRef.current = topFrame;

    // 분필 받침대
    const trayMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.3, 0.3, 0.35),
      roughness: 0.2,
      metalness: 0.7,
      envMap: hdriTexture || undefined,
      envMapIntensity: 2.0,
      clearcoat: 0.2,
      clearcoatRoughness: 0.2,
    });

    const trayWidth = boardWidth * 0.9;
    const trayHeight = 0.035;
    const trayDepth = 0.15;
    const trayY = -boardHeight / 2 - 0.06;

    const tray = new THREE.Mesh(
      new THREE.BoxGeometry(trayWidth, trayHeight, trayDepth),
      trayMaterial
    );
    tray.position.set(0, trayY, 0.04);
    group.add(tray);

    const trayLipMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.35, 0.35, 0.4),
      roughness: 0.15,
      metalness: 0.8,
      envMap: hdriTexture || undefined,
      envMapIntensity: 2.5,
    });

    const trayLip = new THREE.Mesh(
      new THREE.BoxGeometry(trayWidth, 0.025, 0.02),
      trayLipMaterial
    );
    trayLip.position.set(0, trayY + 0.03, 0.12);
    group.add(trayLip);

    const trayEndMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.28, 0.28, 0.32),
      roughness: 0.2,
      metalness: 0.7,
      envMap: hdriTexture || undefined,
      envMapIntensity: 2.0,
    });

    [-trayWidth / 2, trayWidth / 2].forEach((x) => {
      const trayEnd = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, trayHeight, trayDepth),
        trayEndMaterial
      );
      trayEnd.position.set(x, trayY, 0.04);
      group.add(trayEnd);
    });

    // 조명
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);
    const dirLight2 = new THREE.DirectionalLight(0x8888ff, 0.3);
    dirLight2.position.set(-3, 2, -4);
    scene.add(dirLight2);

    scene.add(group);

    // ✅ 최적화된 애니메이션 루프
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      frameCountRef.current++;
      
      // ✅ 5분마다 GPU 메모리 정리 (개발 환경)
      if (process.env.NODE_ENV === 'development' && frameCountRef.current % 18000 === 0) {
        if (rendererRef.current) {
          rendererRef.current.renderLists?.dispose?.();
        }
      }

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

    // ✅ 탭 가시성 변경 처리
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rendererRef.current) {
          rendererRef.current.setAnimationLoop(null);
        }
      } else {
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.setAnimationLoop(() => {
            animate();
          });
        }
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);
    
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      
      if (sceneRef.current) {
        disposeObject(sceneRef.current);
      }
      
      // ✅ 텍스처 정리
      if (codeTextureRef.current) {
        codeTextureRef.current.dispose();
        codeTextureRef.current = null;
      }
      
      sceneRef.current = null;
      cameraRef.current = null;
      groupRef.current = null;
      whiteboardRef.current = null;
      frameRef.current = null;
    };
  }, [hdriTexture, codeTexture, viewportPosition, randomOffset, index, disposeObject, handleResize]);

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
"use client";

import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import * as THREE from "three";
import { useHDRI } from "./HDRIProvider";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

// Prism 언어 임포트
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-docker";
import "prismjs/components/prism-git";

interface CodeBlock3DProps {
  children: string;
  language?: string;
  index?: number;
}

// ✅ 컬러 매핑 함수
const getColorFromClassName = (className: string): string => {
  const colors: Record<string, string> = {
    'token comment': '#6a9955',
    'token string': '#ce9178',
    'token number': '#b5cea8',
    'token keyword': '#c586c0',
    'token function': '#dcdcaa',
    'token variable': '#9cdcfe',
    'token operator': '#d4d4d4',
    'token punctuation': '#d4d4d4',
    'token class-name': '#4ec9b0',
    'token constant': '#4fc1ff',
    'token boolean': '#569cd6',
    'token builtin': '#4ec9b0',
    'token property': '#9cdcfe',
    'token tag': '#569cd6',
    'token attr-value': '#ce9178',
    'token attr-name': '#9cdcfe',
    'token selector': '#d7ba7d',
    'token important': '#c586c0',
    'token deleted': '#f14c4c',
    'token inserted': '#b5cea8',
    'token regex': '#d16969',
    'token atrule': '#c586c0',
    'token url': '#ce9178',
  };
  
  for (const [key, color] of Object.entries(colors)) {
    if (className.includes(key)) {
      return color;
    }
  }
  
  return '#d4d4d4';
};

// ✅ HTML 엔티티 디코딩 함수
const decodeHtmlEntities = (text: string): string => {
  const entities: Record<string, string> = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
  };
  return text.replace(/&[a-z]+;/g, (match) => entities[match] || match);
};

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

  // ✅ 구문 강조가 적용된 코드 텍스처 생성
  const codeTexture = useMemo(() => {
    const codeText = String(children);
    
    // ✅ 빈 줄 제거 (실제 내용이 있는 줄만 필터링)
    const allLines = codeText.split("\n");
    const nonEmptyLines = allLines.filter(line => line.trim() !== "");
    
    // ✅ 빈 줄이 모두 제거되었으면 최소 1줄 유지
    const lines = nonEmptyLines.length > 0 ? nonEmptyLines : [" "];
    
    const fontSize = 22;
    const lineHeight = 36;
    const padding = 48;
    const maxLines = Math.min(lines.length, 30);
    
    // ✅ 실제 내용에 맞게 캔버스 높이 계산
    const canvasWidth = 1600;
    const canvasHeight = Math.max(400, maxLines * lineHeight + padding * 2);

    if (!codeCanvasRef.current) {
      codeCanvasRef.current = document.createElement("canvas");
    }
    
    const canvas = codeCanvasRef.current;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext("2d")!;
    
    // ✅ 어두운 배경
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, "#1a1a2e");
    gradient.addColorStop(0.5, "#16213e");
    gradient.addColorStop(1, "#0f0f23");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // ✅ 구문 강조 적용 (빈 줄 제거된 상태로)
    let highlightedLines: string[] = [];
    
    try {
      const codeToHighlight = lines.join("\n");
      const grammar = Prism.languages[language] || Prism.languages.text;
      const highlighted = Prism.highlight(codeToHighlight, grammar, language);
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `<pre>${highlighted}</pre>`;
      const preElement = tempDiv.querySelector('pre');
      
      if (preElement) {
        const rawLines = preElement.innerHTML.split('\n');
        highlightedLines = rawLines.filter(line => line.trim() !== '');
      } else {
        highlightedLines = lines;
      }
    } catch (error) {
      console.warn('Syntax highlighting failed, using plain text:', error);
      highlightedLines = lines;
    }

    // ✅ 최대 줄 수 제한
    if (highlightedLines.length > maxLines) {
      highlightedLines = highlightedLines.slice(0, maxLines);
    }

    // ✅ 라인 번호 그리기
    ctx.textBaseline = "top";
    
    // ✅ 최대 글자수 계산
    const maxCharsPerLine = 80;
    
    highlightedLines.forEach((line, i) => {
      if (i < maxLines) {
        const y = padding + i * lineHeight;
        
        // 라인 번호
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.font = `${fontSize}px "JetBrains Mono", "Fira Code", monospace`;
        ctx.fillText(`${i + 1}`, 20, y + 4);
        
        // ✅ HTML 태그 파싱하여 컬러 텍스트 렌더링
        if (line.includes('<span')) {
          const tempSpan = document.createElement('div');
          tempSpan.innerHTML = line;
          const spans = tempSpan.querySelectorAll('span');
          
          let currentX = 55;
          if (spans.length > 0) {
            spans.forEach((span) => {
              const text = span.textContent || '';
              const className = span.className || '';
              const color = getColorFromClassName(className);
              
              ctx.fillStyle = color;
              ctx.font = `bold ${fontSize}px "JetBrains Mono", "Fira Code", monospace`;
              const displayText = decodeHtmlEntities(text);
              
              // ✅ 텍스트 자르기
              const truncated = displayText.length > maxCharsPerLine 
                ? displayText.slice(0, maxCharsPerLine) + "…" 
                : displayText;
              
              ctx.fillText(truncated, currentX, y + 4);
              currentX += ctx.measureText(truncated).width;
            });
          } else {
            const cleanText = decodeHtmlEntities(line.replace(/<[^>]*>/g, ''));
            ctx.fillStyle = "#e0e0e0";
            ctx.font = `bold ${fontSize}px "JetBrains Mono", "Fira Code", monospace`;
            const truncated = cleanText.length > maxCharsPerLine 
              ? cleanText.slice(0, maxCharsPerLine) + "…" 
              : cleanText;
            ctx.fillText(truncated, 55, y + 4);
          }
        } else {
          // 일반 텍스트
          ctx.fillStyle = "#e0e0e0";
          ctx.font = `bold ${fontSize}px "JetBrains Mono", "Fira Code", monospace`;
          const cleanText = decodeHtmlEntities(line);
          const truncated = cleanText.length > maxCharsPerLine 
            ? cleanText.slice(0, maxCharsPerLine) + "…" 
            : cleanText;
          ctx.fillText(truncated, 55, y + 4);
        }
      }
    });

    // ✅ 구분선
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(48, padding - 10);
    ctx.lineTo(48, canvasHeight - padding + 10);
    ctx.stroke();

    // ✅ 상단 타이틀 바
    ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
    ctx.fillRect(0, 0, canvasWidth, 34);
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.font = `14px "JetBrains Mono", monospace`;
    ctx.textBaseline = "middle";
    const langDisplay = language || "text";
    ctx.fillText(langDisplay.toUpperCase(), 16, 17);

    // ✅ 창 컨트롤 버튼
    const dots = [
      { x: canvasWidth - 84, color: "#ff5f56" },
      { x: canvasWidth - 62, color: "#ffbd2e" },
      { x: canvasWidth - 40, color: "#27c93f" },
    ];
    dots.forEach((dot) => {
      ctx.beginPath();
      ctx.arc(dot.x, 17, 7, 0, Math.PI * 2);
      ctx.fillStyle = dot.color;
      ctx.fill();
    });

    // ✅ 텍스처 생성 또는 업데이트
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
  }, [children, language]);

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

  // 뷰포트 위치 추적
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

    // ✅ 종횡비 계산
    const textureWidth = codeTexture.image?.width || 1600;
    const textureHeight = codeTexture.image?.height || 400;
    const textureAspect = textureWidth / textureHeight;
    
    // ✅ 보드 크기: 내용에 맞게 최적화 (높이를 기준으로 너비 계산)
    const boardHeight = Math.min(3.0, Math.max(2.0, textureHeight / 200)); // 내용에 따라 높이 조정
    const boardWidth = boardHeight * textureAspect * 0.82; // 비율 유지
    const boardDepth = 0.04;

    const boardGeometry = new THREE.BoxGeometry(boardWidth, boardHeight, boardDepth);
    const boardMaterial = new THREE.MeshPhysicalMaterial({
      map: codeTexture,
      color: new THREE.Color(0.98, 0.98, 0.99),
      roughness: 0.02,
      metalness: 0.85,
      clearcoat: 0.6,
      clearcoatRoughness: 0.05,
      envMap: hdriTexture || undefined,
      envMapIntensity: 2.0,
      reflectivity: 0.9,
      side: THREE.DoubleSide,
      ior: 1.5,
    });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.z = 0;
    group.add(board);
    whiteboardRef.current = board;

    // ✅ 프레임 (보드 크기에 맞춤)
    const frameMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.4, 0.4, 0.48),
      roughness: 0.02,
      metalness: 0.98,
      envMap: hdriTexture || undefined,
      envMapIntensity: 4.0,
      clearcoat: 0.8,
      clearcoatRoughness: 0.02,
      reflectivity: 1.0,
      ior: 2.0,
    });

    const frameThickness = 0.045;
    const frameWidth = boardWidth + frameThickness * 2.5;
    const frameHeight = boardHeight + frameThickness * 2.5;
    const frameDepth = 0.09;
    const frameZ = 0.01;

    const topFrame = new THREE.Mesh(
      new THREE.BoxGeometry(frameWidth, frameThickness, frameDepth),
      frameMaterial
    );
    topFrame.position.set(0, frameHeight / 2, frameZ);
    topFrame.rotation.x = 0.01;
    group.add(topFrame);

    const bottomFrame = new THREE.Mesh(
      new THREE.BoxGeometry(frameWidth, frameThickness, frameDepth),
      frameMaterial
    );
    bottomFrame.position.set(0, -frameHeight / 2, frameZ);
    bottomFrame.rotation.x = -0.01;
    group.add(bottomFrame);

    const leftFrame = new THREE.Mesh(
      new THREE.BoxGeometry(frameThickness, frameHeight, frameDepth),
      frameMaterial
    );
    leftFrame.position.set(-frameWidth / 2, 0, frameZ);
    leftFrame.rotation.y = 0.01;
    group.add(leftFrame);

    const rightFrame = new THREE.Mesh(
      new THREE.BoxGeometry(frameThickness, frameHeight, frameDepth),
      frameMaterial
    );
    rightFrame.position.set(frameWidth / 2, 0, frameZ);
    rightFrame.rotation.y = -0.01;
    group.add(rightFrame);

    // 모서리
    const cornerMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.45, 0.45, 0.5),
      roughness: 0.01,
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
      corner.rotation.z = 0.005;
      group.add(corner);
    });

    frameRef.current = topFrame;

    // 조명
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);
    const dirLight2 = new THREE.DirectionalLight(0x8888ff, 0.4);
    dirLight2.position.set(-3, 2, -4);
    scene.add(dirLight2);

    scene.add(group);

    // 애니메이션
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      frameCountRef.current++;
      
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
          height: "360px",
          display: "block",
          background: "transparent",
        }}
      />
    </div>
  );
}
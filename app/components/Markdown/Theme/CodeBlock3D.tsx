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
  debugId?: string;
}

// 컬러 매핑 함수
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

// ✅ 간단한 해시 함수
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).substring(0, 6);
}

export function CodeBlock3D({ children, language = "text", index = 0, debugId = "unknown" }: CodeBlock3DProps) {
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
  const isMountedRef = useRef<boolean>(true);
  const initAttemptedRef = useRef<boolean>(false);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  
  const [viewportPosition, setViewportPosition] = useState(0);
  const [isWebGLAvailable, setIsWebGLAvailable] = useState<boolean | null>(null);

  const codeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const codeTextureRef = useRef<THREE.CanvasTexture | null>(null);
  
  // ✅ 인스턴스 고유 ID (디버깅용)
  const instanceId = useMemo(() => {
    return `cb3d-${debugId}-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  }, [debugId, index]);
  
  // ✅ index를 ref로 저장
  const indexRef = useRef(index);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);
  
  // ✅ 콘텐츠 기반 안정적인 key 생성
  const stableKey = useMemo(() => {
    const contentHash = simpleHash(String(children));
    return `cb3d-${index}-${contentHash}`;
  }, [children, index]);
  
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

  // WebGL availability check
  useEffect(() => {
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
          console.warn('WebGL not supported');
          setIsWebGLAvailable(false);
          return false;
        }
        setIsWebGLAvailable(true);
        return true;
      } catch (e) {
        console.warn('WebGL check failed:', e);
        setIsWebGLAvailable(false);
        return false;
      }
    };
    checkWebGL();
  }, []);

  // 코드 텍스처 생성
  const codeTexture = useMemo(() => {
    const codeText = String(children);
    
    const allLines = codeText.split("\n");
    const nonEmptyLines = allLines.filter(line => line.trim() !== "");
    const lines = nonEmptyLines.length > 0 ? nonEmptyLines : [" "];
    
    const fontSize = 22;
    const lineHeight = 36;
    const padding = 48;
    const maxLines = Math.min(lines.length, 30);
    
    let maxLineLength = 0;
    const processedLines: string[] = [];
    
    try {
      const codeToHighlight = lines.join("\n");
      const grammar = Prism.languages[language] || Prism.languages.text;
      const highlighted = Prism.highlight(codeToHighlight, grammar, language);
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `<pre>${highlighted}</pre>`;
      const preElement = tempDiv.querySelector('pre');
      
      if (preElement) {
        const rawLines = preElement.innerHTML.split('\n');
        processedLines.push(...rawLines.filter(line => line.trim() !== ''));
      } else {
        processedLines.push(...lines);
      }
    } catch (error) {
      console.warn('Syntax highlighting failed, using plain text:', error);
      processedLines.push(...lines);
    }

    if (processedLines.length > maxLines) {
      processedLines.splice(maxLines);
    }

    processedLines.forEach(line => {
      const cleanText = line.replace(/<[^>]*>/g, '');
      const decodedText = decodeHtmlEntities(cleanText);
      let length = 0;
      for (const char of decodedText) {
        length += char.charCodeAt(0) > 127 ? 1.8 : 1;
      }
      maxLineLength = Math.max(maxLineLength, length);
    });

    const minChars = 20;
    const maxChars = 120;
    const effectiveLength = Math.max(minChars, Math.min(maxChars, maxLineLength));
    
    const charWidth = fontSize * 0.6;
    const canvasWidth = Math.max(600, effectiveLength * charWidth + padding * 2);
    const canvasHeight = Math.max(300, Math.min(processedLines.length, maxLines) * lineHeight + padding * 2 + 34);

    if (!codeCanvasRef.current) {
      codeCanvasRef.current = document.createElement("canvas");
    }
    
    const canvas = codeCanvasRef.current;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext("2d")!;
    
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, "#1a1a2e");
    gradient.addColorStop(0.5, "#16213e");
    gradient.addColorStop(1, "#0f0f23");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.textBaseline = "top";
    const maxDisplayChars = Math.floor((canvasWidth - padding * 2 - 40) / (fontSize * 0.6));
    
    processedLines.forEach((line, i) => {
      if (i < maxLines) {
        const y = padding + i * lineHeight;
        
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.font = `${fontSize}px "JetBrains Mono", "Fira Code", monospace`;
        ctx.fillText(`${i + 1}`, 20, y + 4);
        
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
              
              const remainingSpace = canvasWidth - padding - currentX - 20;
              const maxWidth = Math.min(displayText.length, Math.floor(remainingSpace / (fontSize * 0.6)));
              const truncated = displayText.length > maxWidth && maxWidth > 0 
                ? displayText.slice(0, Math.max(0, maxWidth - 1)) + "…" 
                : displayText;
              
              ctx.fillText(truncated, currentX, y + 4);
              currentX += ctx.measureText(truncated).width;
            });
          } else {
            const cleanText = decodeHtmlEntities(line.replace(/<[^>]*>/g, ''));
            ctx.fillStyle = "#e0e0e0";
            ctx.font = `bold ${fontSize}px "JetBrains Mono", "Fira Code", monospace`;
            const truncated = cleanText.length > maxDisplayChars 
              ? cleanText.slice(0, maxDisplayChars - 1) + "…" 
              : cleanText;
            ctx.fillText(truncated, 55, y + 4);
          }
        } else {
          ctx.fillStyle = "#e0e0e0";
          ctx.font = `bold ${fontSize}px "JetBrains Mono", "Fira Code", monospace`;
          const cleanText = decodeHtmlEntities(line);
          const truncated = cleanText.length > maxDisplayChars 
            ? cleanText.slice(0, maxDisplayChars - 1) + "…" 
            : cleanText;
          ctx.fillText(truncated, 55, y + 4);
        }
      }
    });

    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(48, padding - 10);
    ctx.lineTo(48, canvasHeight - padding + 10);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
    ctx.fillRect(0, 0, canvasWidth, 34);
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.font = `14px "JetBrains Mono", monospace`;
    ctx.textBaseline = "middle";
    const langDisplay = language || "text";
    ctx.fillText(langDisplay.toUpperCase(), 16, 17);

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

    if (codeTextureRef.current) {
      codeTextureRef.current.needsUpdate = true;
      return codeTextureRef.current;
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    codeTextureRef.current = texture;
    return texture;
  }, [children, language]);

  // ✅ 개선된 dispose 함수
  const disposeObject = useCallback((obj: THREE.Object3D) => {
    if (!obj) return;
    
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (Array.isArray(child.material)) {
          child.material.forEach(m => {
            if (m.map) {
              m.map = null;
            }
            m.dispose();
          });
        } else if (child.material) {
          if (child.material.map) {
            child.material.map = null;
          }
          child.material.dispose();
        }
      }
    });
    if (obj.parent) {
      obj.parent.remove(obj);
    }
  }, []);

  const handleResize = useCallback(() => {
    if (!canvasRef.current || !rendererRef.current || !cameraRef.current) return;
    try {
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      if (w > 0 && h > 0) {
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      }
    } catch (error) {
      console.debug('Resize error:', error);
    }
  }, []);

  // 뷰포트 위치 추적
  useEffect(() => {
    let rafId: number | null = null;
    
    const updatePosition = () => {
      if (!containerRef.current) return;
      try {
        const rect = containerRef.current.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const normalized = (viewportCenter - center) / (window.innerHeight / 2);
        setViewportPosition(Math.max(-1, Math.min(1, normalized)));
      } catch (error) {
        // Ignore
      }
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

  // ============================================================
  // ⭐⭐⭐ Three.js 초기화 (최종 개선됨) ⭐⭐⭐
  // ============================================================
  useEffect(() => {
    const currentIndex = indexRef.current;
    
    console.log(`🔍 [${instanceId}] useEffect 실행 - WebGL: ${isWebGLAvailable}, initAttempted: ${initAttemptedRef.current}`);

    // 이미 초기화되었거나 언마운트되었으면 스킵
    if (initAttemptedRef.current || !isMountedRef.current) {
      console.log(`⏭️ [${instanceId}] 스킵 (initAttempted: ${initAttemptedRef.current}, mounted: ${isMountedRef.current})`);
      return;
    }

    // WebGL 사용 불가
    if (isWebGLAvailable === false) {
      console.warn(`⚠️ [${instanceId}] WebGL not available`);
      return;
    }

    // canvas 준비 안됨
    if (!canvasRef.current) {
      console.warn(`⚠️ [${instanceId}] Canvas not ready, retrying...`);
      const retryTimer = setTimeout(() => {
        if (isMountedRef.current && !initAttemptedRef.current) {
          console.log(`🔄 [${instanceId}] Canvas 준비 완료, 재시도`);
          initAttemptedRef.current = false;
        }
      }, 100);
      return () => clearTimeout(retryTimer);
    }

    // WebGL 상태가 null이면 대기
    if (isWebGLAvailable === null) {
      console.log(`⏳ [${instanceId}] WebGL 확인 중...`);
      const timer = setTimeout(() => {
        if (isMountedRef.current && !initAttemptedRef.current) {
          console.log(`🔄 [${instanceId}] WebGL 확인 대기 후 재시도`);
          initAttemptedRef.current = false;
        }
      }, 300);
      return () => clearTimeout(timer);
    }

    // ============================================================
    // 여기서부터 실제 초기화 (isWebGLAvailable === true)
    // ============================================================
    console.log(`🎨 [${instanceId}] Three.js 초기화 시작 (index: ${currentIndex})`);

    const initializeScene = () => {
      if (initAttemptedRef.current || !isMountedRef.current) {
        return;
      }
      
      initAttemptedRef.current = true;
      
      const canvas = canvasRef.current!;
      const width = canvas.clientWidth || 600;
      const height = canvas.clientHeight || 400;

      try {
        console.log(`🎨 [${instanceId}] Three.js 씬 생성 중...`);

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
          powerPreference: "default",
        });

        if (!renderer || !renderer.domElement) {
          throw new Error('Failed to initialize WebGL renderer');
        }

        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        rendererRef.current = renderer;

        const group = new THREE.Group();
        groupRef.current = group;

        // 보드 생성
        const textureWidth = codeTexture.image?.width || 1600;
        const textureHeight = codeTexture.image?.height || 400;
        const textureAspect = textureWidth / textureHeight;
        
        const baseHeight = 2.8;
        const boardHeight = Math.min(3.5, Math.max(1.8, baseHeight * (textureHeight / 500)));
        const boardWidth = boardHeight * textureAspect * 0.85;
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

        // 프레임
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

        console.log(`✅ [${instanceId}] Three.js 씬 생성 완료!`);

        // 애니메이션
        let animationId: number | null = null;
        
        const animate = () => {
          if (!isMountedRef.current) {
            if (animationId) {
              cancelAnimationFrame(animationId);
              animationId = null;
            }
            return;
          }
          
          animationId = requestAnimationFrame(animate);
          
          try {
            frameCountRef.current++;
            
            if (groupRef.current && cameraRef.current) {
              const targetY = viewportPosition * -0.8;
              
              groupRef.current.position.x = randomOffset.x * 0.3 + Math.sin(Date.now() * 0.0003 + currentIndex) * 0.02;
              groupRef.current.position.y = randomOffset.y * 0.3 + targetY * 0.2;
              groupRef.current.position.z = randomOffset.z * 0.2 + Math.sin(Date.now() * 0.0004 + currentIndex * 0.5) * 0.01;
              
              groupRef.current.rotation.y += 0.002 + (viewportPosition * 0.001) + (currentIndex * 0.0003);
              groupRef.current.rotation.x = Math.sin(Date.now() * 0.0004 + currentIndex * 0.3) * 0.02 + viewportPosition * 0.02;
              
              cameraRef.current.position.y = targetY * 0.3 + randomOffset.y * 0.1;
              cameraRef.current.position.x = randomOffset.x * 0.1;
              cameraRef.current.lookAt(
                groupRef.current.position.x * 0.3,
                groupRef.current.position.y * 0.5,
                0
              );
            }

            if (rendererRef.current && sceneRef.current && cameraRef.current && isMountedRef.current) {
              try {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
              } catch (renderError) {
                if (process.env.NODE_ENV === 'development') {
                  console.debug('Render error:', renderError);
                }
              }
            }
          } catch (error) {
            // Animation error - ignore
          }
        };
        
        animate();
        animationRef.current = animationId;

        const handleVisibilityChange = () => {
          if (document.hidden) {
            if (animationRef.current) {
              cancelAnimationFrame(animationRef.current);
              animationRef.current = null;
            }
          } else {
            if (!animationRef.current && isMountedRef.current) {
              animate();
            }
          }
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(canvas);
        
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // ✅ 클린업 함수 저장
        cleanupRef.current = () => {
          console.log(`🧹 [${instanceId}] 클린업 실행`);
          
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
          }
          
          resizeObserver.disconnect();
          document.removeEventListener("visibilitychange", handleVisibilityChange);
          
          if (rendererRef.current) {
            rendererRef.current.dispose();
            rendererRef.current = null;
          }
          
          if (sceneRef.current) {
            disposeObject(sceneRef.current);
            sceneRef.current = null;
          }
          
          if (codeTextureRef.current) {
            codeTextureRef.current.dispose();
            codeTextureRef.current = null;
          }
          
          cameraRef.current = null;
          groupRef.current = null;
          whiteboardRef.current = null;
          frameRef.current = null;
          
          initAttemptedRef.current = false;
        };

        return cleanupRef.current;
      } catch (error) {
        console.error(`❌ [${instanceId}] 초기화 실패:`, error);
        setIsWebGLAvailable(false);
        initAttemptedRef.current = false;
        
        if (rendererRef.current) {
          rendererRef.current.dispose();
          rendererRef.current = null;
        }
        if (sceneRef.current) {
          disposeObject(sceneRef.current);
          sceneRef.current = null;
        }
        
        return () => {
          isMountedRef.current = false;
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
          }
        };
      }
    };

    // 지연 초기화 (첫 번째는 빠르게, 나머지는 부하 분산)
    const initDelay = currentIndex === 0 ? 100 : Math.min(currentIndex * 150 + 100, 600);
    
    const timeoutId = setTimeout(() => {
      if (!isMountedRef.current) return;
      if (initAttemptedRef.current) {
        console.log(`⏭️ [${instanceId}] 초기화 시도했지만 이미 진행 중`);
        return;
      }
      console.log(`⏰ [${instanceId}] ${initDelay}ms 후 초기화 실행`);
      initializeScene();
    }, initDelay);

    // ✅ 메인 클린업
    return () => {
      console.log(`🧹 [${instanceId}] 메인 클린업 실행`);
      clearTimeout(timeoutId);
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      isMountedRef.current = false;
      initAttemptedRef.current = false;
    };
    
  }, [isWebGLAvailable, hdriTexture, codeTexture, viewportPosition, disposeObject, handleResize, instanceId, randomOffset]);

  // ============================================================
  // Fallback UI
  // ============================================================
  if (isWebGLAvailable === false) {
    return (
      <div 
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: '200px',
          background: '#1a1a2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          padding: '20px',
        }}
      >
        <div style={{ textAlign: 'center', color: '#888' }}>
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>
            ⚠️ WebGL not available
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Your browser may not support WebGL
          </div>
        </div>
      </div>
    );
  }

  if (isWebGLAvailable === null) {
    return (
      <div 
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: '200px',
          background: '#1a1a2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
        }}
      >
        <div style={{ color: '#666' }}>Loading...</div>
      </div>
    );
  }

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
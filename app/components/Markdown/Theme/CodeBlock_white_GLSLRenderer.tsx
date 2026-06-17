"use client";

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export interface GLSLRendererRef {
  setScrollPosition: (scrollY: number) => void;
  setHoverState: (isHovered: boolean) => void;
}

interface GLSLRendererProps {
  width?: number | string;
  height?: number | string;
  hdriUrl?: string;
  className?: string;
  scrollSensitivity?: number;
}

const CodeBlock_white_GLSLRenderer = forwardRef<GLSLRendererRef, GLSLRendererProps>(
  (
    {
      width = "100%",
      height = "100%",
      hdriUrl = "/environments/studio_small_09_2k.hdr",
      className = "",
      scrollSensitivity = 0.08,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const frameRef = useRef<THREE.Mesh | null>(null);
    const whiteboardRef = useRef<THREE.Mesh | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const animationRef = useRef<number | null>(null);
    const hdriTextureRef = useRef<THREE.DataTexture | null>(null);
    const groupRef = useRef<THREE.Group | null>(null);

    const scrollPositionRef = useRef<number>(0);
    const hoverStateRef = useRef<boolean>(false);

    // 컴포넌트 마운트/언마운트
    useEffect(() => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();

      // 1. Scene 생성
      const scene = new THREE.Scene();
      scene.background = null; // 배경 투명
      sceneRef.current = scene;

      // 2. Camera 생성
      const camera = new THREE.PerspectiveCamera(40, rect.width / rect.height, 0.1, 100);
      camera.position.set(3.5, 1.8, 5.5);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // 3. Renderer 생성 (alpha: true로 투명 배경)
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true, // 투명 배경 활성화
        powerPreference: "high-performance",
      });
      renderer.setSize(rect.width, rect.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000, 0); // 완전 투명
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // 4. Controls (OrbitControls - 사용자 interaction)
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = false;
      controls.enableZoom = false; // 줌 비활성화 (코드 블록이니까)
      controls.enablePan = false; // 팬 비활성화
      controls.rotateSpeed = 0.5;
      controls.target.set(0, 0, 0);
      controls.update();
      controlsRef.current = controls;

      // 5. HDRI 환경맵 로드
      const loadHDRI = async () => {
        try {
          const loader = new RGBELoader();
          const texture = await loader.loadAsync(hdriUrl);
          texture.mapping = THREE.EquirectangularReflectionMapping;
          
          // scene.environment에만 설정 (background는 투명 유지)
          scene.environment = texture;
          hdriTextureRef.current = texture;

          // HDRI 로드 완료 후 재질 업데이트
          if (whiteboardRef.current || frameRef.current) {
            updateMaterials(texture);
          }
        } catch (error) {
          console.warn("HDRI 로드 실패, 기본 라이팅 사용:", error);
          // Fallback: 기본 라이팅 추가
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
          scene.add(ambientLight);
          const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
          dirLight.position.set(5, 10, 7);
          scene.add(dirLight);
          const dirLight2 = new THREE.DirectionalLight(0x8888ff, 0.3);
          dirLight2.position.set(-5, 0, 5);
          scene.add(dirLight2);
        }
      };

      // 6. 재질 업데이트 함수
      const updateMaterials = (envMap: THREE.DataTexture) => {
        if (whiteboardRef.current) {
          const mat = whiteboardRef.current.material as THREE.MeshPhysicalMaterial;
          mat.envMap = envMap;
          mat.envMapIntensity = 0.4;
          mat.needsUpdate = true;
        }
        if (frameRef.current) {
          const mat = frameRef.current.material as THREE.MeshPhysicalMaterial;
          mat.envMap = envMap;
          mat.envMapIntensity = 1.8;
          mat.needsUpdate = true;
        }
        // 그룹 내 모든 메쉬의 재질 업데이트
        if (groupRef.current) {
          groupRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              const materials = Array.isArray(child.material) ? child.material : [child.material];
              materials.forEach((mat) => {
                if (mat instanceof THREE.MeshPhysicalMaterial) {
                  mat.envMap = envMap;
                  mat.needsUpdate = true;
                }
              });
            }
          });
        }
      };

      // 7. 3D 모델 생성 (화이트보드 + 금속 프레임)
      const createModel = () => {
        const group = new THREE.Group();

        // --- 화이트보드 본체 (미끈한 마커판) ---
        const boardGeometry = new THREE.BoxGeometry(4.6, 3.0, 0.25);
        const boardMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0.97, 0.97, 0.98),
          roughness: 0.2,
          metalness: 0.0,
          clearcoat: 0.2,
          clearcoatRoughness: 0.25,
          envMap: hdriTextureRef.current || undefined,
          envMapIntensity: 0.4,
          reflectivity: 0.3,
          side: THREE.DoubleSide,
        });
        const board = new THREE.Mesh(boardGeometry, boardMaterial);
        board.position.z = -0.05;
        group.add(board);
        whiteboardRef.current = board;

        // --- 화이트보드 뒷면 (약간 다른 재질) ---
        const backMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0.85, 0.85, 0.88),
          roughness: 0.8,
          metalness: 0.0,
          side: THREE.BackSide,
        });
        const back = new THREE.Mesh(boardGeometry.clone(), backMaterial);
        back.position.z = -0.05;
        group.add(back);

        // --- 금속 프레임 (회색 쇠) ---
        const frameMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0.42, 0.42, 0.46),
          roughness: 0.2,
          metalness: 0.95,
          envMap: hdriTextureRef.current || undefined,
          envMapIntensity: 1.8,
          clearcoat: 0.3,
          clearcoatRoughness: 0.15,
        });

        const frameThickness = 0.1;
        const frameWidth = 4.6 + frameThickness * 2;
        const frameHeight = 3.0 + frameThickness * 2;
        const frameDepth = 0.45;

        // 상단 프레임
        const topFrame = new THREE.Mesh(
          new THREE.BoxGeometry(frameWidth, frameThickness, frameDepth),
          frameMaterial
        );
        topFrame.position.set(0, frameHeight / 2, 0);
        group.add(topFrame);

        // 하단 프레임
        const bottomFrame = new THREE.Mesh(
          new THREE.BoxGeometry(frameWidth, frameThickness, frameDepth),
          frameMaterial
        );
        bottomFrame.position.set(0, -frameHeight / 2, 0);
        group.add(bottomFrame);

        // 좌측 프레임
        const leftFrame = new THREE.Mesh(
          new THREE.BoxGeometry(frameThickness, frameHeight, frameDepth),
          frameMaterial
        );
        leftFrame.position.set(-frameWidth / 2, 0, 0);
        group.add(leftFrame);

        // 우측 프레임
        const rightFrame = new THREE.Mesh(
          new THREE.BoxGeometry(frameThickness, frameHeight, frameDepth),
          frameMaterial
        );
        rightFrame.position.set(frameWidth / 2, 0, 0);
        group.add(rightFrame);

        // 프레임 모서리 (둥근 느낌을 위한 작은 큐브)
        const cornerMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0.38, 0.38, 0.42),
          roughness: 0.15,
          metalness: 0.98,
          envMap: hdriTextureRef.current || undefined,
          envMapIntensity: 2.0,
        });

        const cornerPositions = [
          [-frameWidth / 2, -frameHeight / 2],
          [-frameWidth / 2, frameHeight / 2],
          [frameWidth / 2, -frameHeight / 2],
          [frameWidth / 2, frameHeight / 2],
        ];

        cornerPositions.forEach(([x, y]) => {
          const corner = new THREE.Mesh(
            new THREE.BoxGeometry(frameThickness * 1.3, frameThickness * 1.3, frameDepth * 1.1),
            cornerMaterial
          );
          corner.position.set(x, y, 0);
          group.add(corner);
        });

        // --- 화이트보드에 마커 흔적 (데코레이션) ---
        const markerColors = [
          new THREE.Color(0.9, 0.2, 0.2),
          new THREE.Color(0.2, 0.5, 0.9),
          new THREE.Color(0.2, 0.8, 0.3),
          new THREE.Color(0.9, 0.6, 0.1),
        ];

        // 랜덤한 마커 선들
        for (let i = 0; i < 12; i++) {
          const markerMat = new THREE.MeshPhysicalMaterial({
            color: markerColors[i % markerColors.length],
            roughness: 0.7,
            metalness: 0.0,
            transparent: true,
            opacity: 0.08 + Math.random() * 0.12,
          });

          const x = (Math.random() - 0.5) * 3.0;
          const y = (Math.random() - 0.5) * 2.0;
          const width = 0.3 + Math.random() * 0.8;
          const height = 0.005;

          const line = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, 0.28),
            markerMat
          );
          line.position.set(x, y, 0.1);
          line.rotation.z = (Math.random() - 0.5) * 0.3;
          group.add(line);
        }

        // --- 화이트보드 하단에 회사 로고 같은 장식 ---
        const logoMat = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0.3, 0.3, 0.35),
          roughness: 0.3,
          metalness: 0.6,
          transparent: true,
          opacity: 0.15,
        });

        const logo = new THREE.Mesh(
          new THREE.BoxGeometry(0.6, 0.02, 0.28),
          logoMat
        );
        logo.position.set(1.2, -1.3, 0.1);
        group.add(logo);

        const logoText = new THREE.Mesh(
          new THREE.BoxGeometry(0.4, 0.02, 0.28),
          logoMat
        );
        logoText.position.set(-1.2, -1.3, 0.1);
        group.add(logoText);

        scene.add(group);
        groupRef.current = group;
        frameRef.current = topFrame;

        // 재질 업데이트 시도
        if (hdriTextureRef.current) {
          updateMaterials(hdriTextureRef.current);
        }
      };

      // 8. 애니메이션 루프
      const animate = () => {
        animationRef.current = requestAnimationFrame(animate);

        if (controlsRef.current) {
          controlsRef.current.update();
        }

        // 스크롤에 따른 카메라 움직임 (반사 변화)
        if (cameraRef.current) {
          const scrollOffset = scrollPositionRef.current * scrollSensitivity;
          // 카메라를 부드럽게 회전시켜 반사 변화
          const radius = 5.5;
          const angleX = Math.sin(scrollOffset) * 0.3;
          const angleY = Math.cos(scrollOffset * 0.7) * 0.15;
          
          cameraRef.current.position.x = Math.sin(angleX) * radius * 0.3;
          cameraRef.current.position.y = 1.8 + Math.sin(angleY) * 0.5;
          cameraRef.current.position.z = 5.5 + Math.cos(angleX) * 0.5;
          cameraRef.current.lookAt(0, 0, 0);
        }

        // 화이트보드의 미세한 떨림/반응
        if (whiteboardRef.current) {
          const breathe = Math.sin(Date.now() * 0.0003) * 0.0005;
          whiteboardRef.current.position.z = -0.05 + breathe;
        }

        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };

      // 9. 윈도우 리사이즈 핸들러
      const handleResize = () => {
        if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        if (w > 0 && h > 0) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      };

      // 10. 스크롤 이벤트 핸들러
      const handleScroll = () => {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        scrollPositionRef.current = scrollY;
      };

      // 초기화 실행
      loadHDRI();
      createModel();
      animate();

      // ResizeObserver로 컨테이너 크기 변화 감지
      const resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, { passive: true });

      // 초기 scroll 위치 설정
      setTimeout(handleScroll, 100);

      // 언마운트 클린업
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll);
        resizeObserver.disconnect();

        if (rendererRef.current) {
          rendererRef.current.dispose();
          const domElement = rendererRef.current.domElement;
          if (domElement && domElement.parentNode) {
            domElement.parentNode.removeChild(domElement);
          }
        }

        if (hdriTextureRef.current) {
          hdriTextureRef.current.dispose();
        }

        // 모든 씬 오브젝트 정리
        if (sceneRef.current) {
          sceneRef.current.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.geometry?.dispose();
              if (Array.isArray(object.material)) {
                object.material.forEach((m) => m.dispose());
              } else {
                object.material?.dispose();
              }
            }
          });
        }

        rendererRef.current = null;
        sceneRef.current = null;
        cameraRef.current = null;
        controlsRef.current = null;
        whiteboardRef.current = null;
        frameRef.current = null;
        groupRef.current = null;
        hdriTextureRef.current = null;
      };
    }, [hdriUrl]);

    // 외부에서 제어 가능한 메서드 노출
    useImperativeHandle(ref, () => ({
      setScrollPosition: (scrollY: number) => {
        scrollPositionRef.current = scrollY;
      },
      setHoverState: (isHovered: boolean) => {
        hoverStateRef.current = isHovered;
        // 호버시 톤매핑 강도 조절
        if (rendererRef.current) {
          rendererRef.current.toneMappingExposure = isHovered ? 1.4 : 1.2;
        }
        // 호버시 프레임 재질 강조
        if (frameRef.current) {
          const mat = frameRef.current.material as THREE.MeshPhysicalMaterial;
          mat.envMapIntensity = isHovered ? 2.5 : 1.8;
          mat.needsUpdate = true;
        }
        // 호버시 화이트보드 살짝 밝아짐
        if (whiteboardRef.current) {
          const mat = whiteboardRef.current.material as THREE.MeshPhysicalMaterial;
          mat.envMapIntensity = isHovered ? 0.7 : 0.4;
          mat.needsUpdate = true;
        }
      },
    }));

    return (
      <div
        ref={containerRef}
        className={`glsl-renderer-container ${className}`}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
          position: "relative",
          overflow: "hidden",
          borderRadius: "inherit",
          pointerEvents: "none", // 마우스 이벤트가 아래로 전달되도록
        }}
      />
    );
  }
);

CodeBlock_white_GLSLRenderer.displayName = "CodeBlock_white_GLSLRenderer";

export default CodeBlock_white_GLSLRenderer;
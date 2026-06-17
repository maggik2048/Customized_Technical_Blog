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
      // ✅ 4K HDR 파일로 기본 경로 변경
      hdriUrl = "/environments/poly_haven_studio_4k.hdr",
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

    useEffect(() => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();

      const scene = new THREE.Scene();
      scene.background = null;
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(40, rect.width / rect.height, 0.1, 100);
      camera.position.set(3.5, 1.8, 5.5);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(rect.width, rect.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = false;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.rotateSpeed = 0.5;
      controls.target.set(0, 0, 0);
      controls.update();
      controlsRef.current = controls;

      const loadHDRI = async () => {
        try {
          const loader = new RGBELoader();
          const texture = await loader.loadAsync(hdriUrl);
          texture.mapping = THREE.EquirectangularReflectionMapping;
          
          scene.environment = texture;
          hdriTextureRef.current = texture;

          if (whiteboardRef.current || frameRef.current) {
            updateMaterials(texture);
          }
        } catch (error) {
          console.warn("HDRI 로드 실패, 기본 라이팅 사용:", error);
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

      const createModel = () => {
        const group = new THREE.Group();

        const boardGeometry = new THREE.BoxGeometry(4.6, 3.0, 0.25);
        const boardMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0.95, 0.95, 0.97),
          roughness: 0.15,
          metalness: 0.85,
          clearcoat: 0.3,
          clearcoatRoughness: 0.2,
          envMap: hdriTextureRef.current || undefined,
          envMapIntensity: 1.2,
          reflectivity: 0.8,
          side: THREE.DoubleSide,
          ior: 1.5,
        });
        const board = new THREE.Mesh(boardGeometry, boardMaterial);
        board.position.z = 0;
        group.add(board);
        whiteboardRef.current = board;

        const frameMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0.45, 0.45, 0.50),
          roughness: 0.15,
          metalness: 0.98,
          envMap: hdriTextureRef.current || undefined,
          envMapIntensity: 2.5,
          clearcoat: 0.4,
          clearcoatRoughness: 0.1,
          reflectivity: 1.0,
          ior: 2.0,
        });

        const frameThickness = 0.08;
        const frameWidth = 4.6 + frameThickness * 2;
        const frameHeight = 3.0 + frameThickness * 2;
        const frameDepth = 0.35;

        const topFrame = new THREE.Mesh(
          new THREE.BoxGeometry(frameWidth, frameThickness, frameDepth),
          frameMaterial
        );
        topFrame.position.set(0, frameHeight / 2, 0);
        group.add(topFrame);

        const bottomFrame = new THREE.Mesh(
          new THREE.BoxGeometry(frameWidth, frameThickness, frameDepth),
          frameMaterial
        );
        bottomFrame.position.set(0, -frameHeight / 2, 0);
        group.add(bottomFrame);

        const leftFrame = new THREE.Mesh(
          new THREE.BoxGeometry(frameThickness, frameHeight, frameDepth),
          frameMaterial
        );
        leftFrame.position.set(-frameWidth / 2, 0, 0);
        group.add(leftFrame);

        const rightFrame = new THREE.Mesh(
          new THREE.BoxGeometry(frameThickness, frameHeight, frameDepth),
          frameMaterial
        );
        rightFrame.position.set(frameWidth / 2, 0, 0);
        group.add(rightFrame);

        const cornerMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0.4, 0.4, 0.45),
          roughness: 0.1,
          metalness: 0.99,
          envMap: hdriTextureRef.current || undefined,
          envMapIntensity: 3.0,
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
            new THREE.BoxGeometry(frameThickness * 1.5, frameThickness * 1.5, frameDepth * 1.2),
            cornerMaterial
          );
          corner.position.set(x, y, 0);
          group.add(corner);
        });

        group.children.forEach((child) => {
          if (child !== board) {
            child.position.z = 0.05;
          }
        });

        scene.add(group);
        groupRef.current = group;
        frameRef.current = topFrame;

        if (hdriTextureRef.current) {
          updateMaterials(hdriTextureRef.current);
        }
      };

      const animate = () => {
        animationRef.current = requestAnimationFrame(animate);

        if (controlsRef.current) {
          controlsRef.current.update();
        }

        if (cameraRef.current) {
          const scrollOffset = scrollPositionRef.current * scrollSensitivity;
          const radius = 5.5;
          const angleX = Math.sin(scrollOffset) * 0.3;
          const angleY = Math.cos(scrollOffset * 0.7) * 0.15;
          
          cameraRef.current.position.x = Math.sin(angleX) * radius * 0.3;
          cameraRef.current.position.y = 1.8 + Math.sin(angleY) * 0.5;
          cameraRef.current.position.z = 5.5 + Math.cos(angleX) * 0.5;
          cameraRef.current.lookAt(0, 0, 0);
        }

        if (whiteboardRef.current) {
          const breathe = Math.sin(Date.now() * 0.0003) * 0.0005;
          whiteboardRef.current.position.z = breathe;
        }

        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };

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

      const handleScroll = () => {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        scrollPositionRef.current = scrollY;
      };

      loadHDRI();
      createModel();
      animate();

      const resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, { passive: true });

      setTimeout(handleScroll, 100);

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

    useImperativeHandle(ref, () => ({
      setScrollPosition: (scrollY: number) => {
        scrollPositionRef.current = scrollY;
      },
      setHoverState: (isHovered: boolean) => {
        hoverStateRef.current = isHovered;
        if (rendererRef.current) {
          rendererRef.current.toneMappingExposure = isHovered ? 1.4 : 1.2;
        }
        if (frameRef.current) {
          const mat = frameRef.current.material as THREE.MeshPhysicalMaterial;
          mat.envMapIntensity = isHovered ? 3.5 : 2.5;
          mat.needsUpdate = true;
        }
        if (whiteboardRef.current) {
          const mat = whiteboardRef.current.material as THREE.MeshPhysicalMaterial;
          mat.envMapIntensity = isHovered ? 1.8 : 1.2;
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
          pointerEvents: "none",
        }}
      />
    );
  }
);

CodeBlock_white_GLSLRenderer.displayName = "CodeBlock_white_GLSLRenderer";

export default CodeBlock_white_GLSLRenderer;
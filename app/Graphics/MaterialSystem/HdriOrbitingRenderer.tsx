'use client';

import { useEffect, useRef } from 'react';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

import { World } from './ecs/World';

import { Scene } from './scene/Scene';

import { RenderSystem } from './systems/RenderSystem';

//  추가: Props 타입 정의
type HdriOrbitingRendererProps = {
  shouldDoMapping?: boolean;
  selectedModelId?: string | null;
};

export default function HdriOrbitingRenderer({ 
  shouldDoMapping, 
  selectedModelId 
}: HdriOrbitingRendererProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    //  추가: props 변경 시 로깅 (디버깅용)
    console.log('HdriOrbitingRenderer props:', { shouldDoMapping, selectedModelId });

    //
    // Scene (Three.js)
    //
    const scene = new THREE.Scene();

    //
    // ECS World
    //
    const world = new World();

    const ecsScene = new Scene(scene, world);

    const renderSystem = new RenderSystem(world);

    //
    // Camera
    //
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    camera.position.set(0, 0, 3);

    //
    // Renderer
    //
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;

    containerRef.current.appendChild(renderer.domElement);

    //
    // Controls
    //
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.rotateSpeed = -0.25;

    //
    // HDRI
    //
    const exrLoader = new EXRLoader();

    exrLoader.load(
      '/images/materialsystem/hdri/white_cliff_top_1k.exr',
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;

        scene.background = texture;
        scene.environment = texture;

        console.log('EXR HDRI Loaded');
      },
      undefined,
      (error) => {
        console.error('EXR Load Error:', error);
      }
    );

    //
    // ECS Entity (Sphere moved into ECS)
    //
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1,
        roughness: 0,
      })
    );

    ecsScene.addMeshEntity(sphere);

    //
    // Light (unchanged)
    //
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    //
    //  추가: shouldDoMapping이 true일 때 특정 동작 수행 (예: 와이어프레임 토글)
    // 필요에 따라 수정 가능
    if (shouldDoMapping) {
      console.log('Mapping mode enabled');
      // 예: sphere 머티리얼을 와이어프레임으로 변경
      if (sphere.material instanceof THREE.MeshStandardMaterial) {
        sphere.material.wireframe = true;
      }
    } else {
      if (sphere.material instanceof THREE.MeshStandardMaterial) {
        sphere.material.wireframe = false;
      }
    }

    //
    //  추가: selectedModelId가 변경될 때 해당 모델 로드 로직
    // 필요에 따라 구현
    if (selectedModelId) {
      console.log('Selected model changed:', selectedModelId);
      // 여기에 모델 로드 로직 추가 가능
      // 예: loadModel(selectedModelId);
    }

    //
    // Animate
    //
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      renderSystem.update();

      controls.update();

      renderer.render(scene, camera);
    };

    animate();

    //
    // Resize
    //
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onResize);

    //
    // Cleanup
    //
    return () => {
      cancelAnimationFrame(animationId);

      window.removeEventListener('resize', onResize);

      controls.dispose();
      renderer.dispose();

      if (
        containerRef.current &&
        renderer.domElement.parentNode
      ) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [shouldDoMapping, selectedModelId]); //  추가: props가 변경될 때 effect 재실행

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'black',
      }}
    />
  );
}
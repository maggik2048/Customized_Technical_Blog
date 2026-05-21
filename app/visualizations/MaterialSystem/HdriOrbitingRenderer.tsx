'use client';

import { useEffect, useRef } from 'react';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

import { World } from './ecs/World';

import { Scene } from './scene/Scene';

import { RenderSystem } from './systems/RenderSystem';

export default function HdriOrbitingRenderer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

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
  }, []);

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
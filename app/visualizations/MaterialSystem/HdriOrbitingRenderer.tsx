'use client';

import {
  useEffect,
  useRef,
} from 'react';

import * as THREE
from 'three';

import { OrbitControls }
from 'three/examples/jsm/controls/OrbitControls.js';

import { EXRLoader }
from 'three/examples/jsm/loaders/EXRLoader.js';

import LoadRegisteredMaterial
from './LoadRegisteredMaterial';

interface Props {

  shouldDoMapping?: boolean;
}

export default function HdriOrbitingRenderer({
  shouldDoMapping,
}: Props) {

  const containerRef =
    useRef<HTMLDivElement>(null);

  const materialRef =
    useRef<
      THREE.MeshStandardMaterial | null
    >(null);

  useEffect(() => {

    if (!containerRef.current)
      return;

    //
    // SCENE
    //

    const scene =
      new THREE.Scene();

    //
    // CAMERA
    //

    const camera =
      new THREE.PerspectiveCamera(
        75,

        window.innerWidth /
        window.innerHeight,

        0.1,

        1000
      );

    camera.position.set(
      0,
      0,
      3
    );

    //
    // RENDERER
    //

    const renderer =
      new THREE.WebGLRenderer({
        antialias: true,
      });

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    renderer.setPixelRatio(
      window.devicePixelRatio
    );

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    renderer.toneMapping =
      THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure =
      1.5;

    containerRef.current.appendChild(
      renderer.domElement
    );

    //
    // CONTROLS
    //

    const controls =
      new OrbitControls(
        camera,
        renderer.domElement
      );

    controls.enableDamping =
      true;

    controls.enablePan =
      false;

    controls.rotateSpeed =
      -0.25;

    //
    // HDRI
    //

    const exrLoader =
      new EXRLoader();

    const hdriPath =
      '/images/materialsystem/hdri/white_cliff_top_1k.exr';

    exrLoader.load(

      hdriPath,

      (texture) => {

        texture.mapping =
          THREE.EquirectangularReflectionMapping;

        scene.background =
          texture;

        scene.environment =
          texture;

        console.log(
          'EXR HDRI Loaded'
        );
      },

      undefined,

      (error) => {

        console.error(
          'EXR Load Error:',
          error
        );
      }
    );

    //
    // GEOMETRY
    //

    const geometry =
      new THREE.SphereGeometry(
        1,
        256,
        256
      );

    //
    // AO NEEDS UV2
    //

    geometry.setAttribute(

      'uv2',

      new THREE.BufferAttribute(
        geometry.attributes.uv.array,
        2
      )
    );

    //
    // MATERIAL
    //

    const material =
      new THREE.MeshStandardMaterial({

        color: 0xffffff,

        metalness: 0,

        roughness: 1,
      });

    materialRef.current =
      material;

    //
    // MESH
    //

    const sphere =
      new THREE.Mesh(
        geometry,
        material
      );

    scene.add(sphere);

    //
    // LIGHT
    //

    const light =
      new THREE.DirectionalLight(
        0xffffff,
        1
      );

    light.position.set(
      5,
      5,
      5
    );

    scene.add(light);

    //
    // ANIMATION
    //

    let animationId: number;

    const animate = () => {

      animationId =
        requestAnimationFrame(
          animate
        );

      controls.update();

      renderer.render(
        scene,
        camera
      );
    };

    animate();

    //
    // RESIZE
    //

    const onResize = () => {

      camera.aspect =
        window.innerWidth /
        window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );
    };

    window.addEventListener(
      'resize',
      onResize
    );

    //
    // CLEANUP
    //

    return () => {

      cancelAnimationFrame(
        animationId
      );

      window.removeEventListener(
        'resize',
        onResize
      );

      controls.dispose();

      renderer.dispose();

      geometry.dispose();

      material.dispose();

      if (
        containerRef.current &&
        renderer.domElement.parentNode
      ) {

        containerRef.current.removeChild(
          renderer.domElement
        );
      }
    };

  }, []);

  //
  // APPLY REGISTERED MATERIAL
  //

  useEffect(() => {

    const applyMaterial =
      async () => {

        if (
          shouldDoMapping &&
          materialRef.current
        ) {

          //
          // 네 실제 material folder 이름
          //

          await LoadRegisteredMaterial(

            materialRef.current,

            'material_1746583021'
          );
        }
      };

    applyMaterial();

  }, [shouldDoMapping]);

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
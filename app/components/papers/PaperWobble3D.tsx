// app/components/papers/PaperWobble3D.tsx
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';

interface PaperWobble3DProps {
  imagePath: string;
  isActive: boolean;
  progress: number;
  direction: 'forward' | 'backward' | null;
  onFlipComplete?: () => void;
}

// 3D 종이 메쉬 컴포넌트
function PaperMesh({ 
  texture, 
  progress, 
  direction, 
  isActive,
  onComplete
}: { 
  texture: THREE.Texture | null;
  progress: number;
  direction: 'forward' | 'backward' | null;
  isActive: boolean;
  onComplete?: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const vertexPositions = useRef<Float32Array | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  
  // 🔥 세그먼트를 64개로 늘려서 부드러운 변형
  const segments = 64;

  useFrame(({ clock }) => {
    if (!meshRef.current || !isActive) return;

    const mesh = meshRef.current;
    const geometry = mesh.geometry;
    const positions = geometry.attributes.position;
    const time = clock.getElapsedTime();
    
    const isForward = direction === 'forward';
    const p = Math.min(Math.max(progress, 0), 1);
    
    // 종이 넘김 각도
    const rotateY = isForward ? -Math.PI * p : Math.PI * p;
    mesh.rotation.y = rotateY;
    
    // 종이 위치
    const offset = isForward ? -viewport.width * 0.3 * p : viewport.width * 0.3 * p;
    mesh.position.x = offset;
    mesh.position.z = -Math.sin(p * Math.PI) * 0.3;

    // 버텍스 변형
    const posArray = positions.array;
    const vertexCount = positions.count;
    
    const width = viewport.width * 0.7;
    const height = viewport.height * 0.5;
    
    // 🔥 wobble 강도 대폭 증가
    const wobbleStrength = Math.sin(p * Math.PI) * 0.35;
    const windStrength = 0.15 + wobbleStrength * 0.5;
    
    // 바람 파라미터
    const windSpeed = 1.8;
    
    // 각 버텍스 변형
    for (let i = 0; i < vertexCount; i++) {
      const i3 = i * 3;
      const x = posArray[i3];
      const y = posArray[i3 + 1];
      
      // UV 좌표
      const u = (x / (width / 2) + 1) / 2;
      const v = (y / (height / 2) + 1) / 2;
      
      // 🔥 종이 가장자리에서 더 많이 움직임
      const edgeX = Math.sin(u * Math.PI);
      const edgeY = Math.sin(v * Math.PI);
      const edgeFactor = edgeX * edgeY * 0.7 + 0.3;
      
      // 🔥 복잡한 바람 패턴 (진짜 종이처럼 팔랑거림)
      const wave1 = Math.sin(u * 6 + time * windSpeed * 0.6) * 0.5;
      const wave2 = Math.cos(v * 7 + time * windSpeed * 1.0) * 0.45;
      const wave3 = Math.sin((u + v) * 5 + time * windSpeed * 1.4) * 0.4;
      const wave4 = Math.cos(u * 8 - time * windSpeed * 0.7) * 0.35;
      const wave5 = Math.sin(v * 9 + time * windSpeed * 0.8) * 0.3;
      const wave6 = Math.sin(u * 10 + v * 8 + time * windSpeed * 1.1) * 0.25;
      
      // 🔥 종이 휘어짐 (진짜 종이처럼 접히는 느낌)
      const foldX = Math.sin(u * Math.PI * 2 + p * 3) * 0.4;
      const foldY = Math.cos(v * Math.PI * 2 + p * 2.5) * 0.3;
      const foldDiag = Math.sin((u + v) * Math.PI * 2 + p * 2) * 0.2;
      
      // 방향에 따른 휘어짐
      const dirFactor = isForward ? 1 : -1;
      
      // 🔥 Z축 변위 (종이 두께 방향) - 강도 증가
      const zOffset = (
        wave1 * 0.4 +
        wave2 * 0.3 +
        wave3 * 0.25 +
        wave4 * 0.15 +
        wave5 * 0.1 +
        wave6 * 0.1 +
        foldX * 0.25 * wobbleStrength * 4 +
        foldY * 0.2 * wobbleStrength * 4 +
        foldDiag * 0.15 * wobbleStrength * 3
      ) * windStrength * 2.5 * dirFactor;
      
      // 가장자리에서 더 많이 휘어짐
      const finalZ = zOffset * edgeFactor;
      
      // X, Y 축 미세 변형 (종이 늘어짐)
      const xOffset = Math.sin(v * 5 + time * 0.5) * 0.03 * wobbleStrength;
      const yOffset = Math.cos(u * 5 + time * 0.7) * 0.03 * wobbleStrength;
      
      if (vertexPositions.current) {
        const origX = vertexPositions.current[i3];
        const origY = vertexPositions.current[i3 + 1];
        posArray[i3] = origX + xOffset * 2;
        posArray[i3 + 1] = origY + yOffset * 2;
        posArray[i3 + 2] = finalZ;
      } else {
        vertexPositions.current = new Float32Array(posArray);
      }
    }
    
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
    
    // 종이 반투명 효과
    mesh.material.transparent = true;
    mesh.material.opacity = 0.95 + Math.sin(p * Math.PI) * 0.05;
    
    // 그림자 효과
    const shadowIntensity = Math.sin(p * Math.PI) * 0.15;
    mesh.material.color.setHSL(0, 0, 0.95 - shadowIntensity * 0.1);
    
    if (p >= 1 && !isFlipping) {
      setIsFlipping(true);
      if (onComplete) {
        setTimeout(onComplete, 100);
      }
    }
  });

  if (!texture) {
    return null;
  }

  return (
    <Plane
      ref={meshRef}
      args={[viewport.width * 0.7, viewport.height * 0.5, segments, segments]}
      position={[0, 0, 0]}
    >
      <meshStandardMaterial 
        map={texture}
        roughness={0.3}
        metalness={0.0}
        side={THREE.DoubleSide}
        transparent={true}
        opacity={0.95}
        depthWrite={true}
      />
    </Plane>
  );
}

// 메인 컴포넌트
export default function PaperWobble3D({
  imagePath,
  isActive,
  progress,
  direction,
  onFlipComplete,
}: PaperWobble3DProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imagePath) return;

    setIsLoading(true);
    const loader = new THREE.TextureLoader();
    
    loader.load(
      imagePath,
      (tex) => {
        tex.needsUpdate = true;
        setTexture(tex);
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error('Failed to load image:', error);
        setIsLoading(false);
      }
    );
  }, [imagePath]);

  if (isLoading || !texture) {
    return (
      <div
        style={{
          width: '100%',
          height: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f0f0f0',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#666',
        }}
      >
        Loading 3D paper...
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '600px',
        borderRadius: '8px',
        overflow: 'hidden',
        background: '#e8e8e8',
        position: 'relative',
      }}
    >
      <Canvas
        camera={{ 
          position: [0, 0, 2.5],
          fov: 40,
          near: 0.1,
          far: 10,
        }}
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%)',
        }}
      >
        {/* 조명 */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 3, 2]} intensity={1.0} />
        <directionalLight position={[-2, 1, -1]} intensity={0.4} />
        <directionalLight position={[0, -1, 1]} intensity={0.2} />
        <pointLight position={[0, 0, 2]} intensity={0.3} />
        
        {/* 종이 */}
        <PaperMesh
          texture={texture}
          progress={progress}
          direction={direction}
          isActive={isActive}
          onComplete={onFlipComplete}
        />
        
        {/* 그림자 바닥 */}
        <mesh position={[0, -0.55, -0.3]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.5, 1.8]} />
          <meshBasicMaterial 
            color={0x000000}
            transparent
            opacity={0.08}
          />
        </mesh>
      </Canvas>
      
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          backdropFilter: 'blur(4px)',
        }}
      >
        {Math.round(progress * 100)}%
      </div>
    </div>
  );
}
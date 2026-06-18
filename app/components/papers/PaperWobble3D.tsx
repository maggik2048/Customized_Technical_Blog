// app/components/papers/PaperWobble3D.tsx
"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

interface PaperWobble3DProps {
  imagePath: string;
  isActive: boolean;
  progress: number;
  direction: 'forward' | 'backward' | null;
  onFlipComplete?: () => void;
}

// 🔥 순수 물리 기반 종이 (파동 없음, 오직 물리 엔진만)
class PhysicsPaper {
  public mesh: THREE.Mesh;
  public particles: CANNON.Body[] = [];
  public constraints: CANNON.Constraint[] = [];
  public world: CANNON.World;
  
  private width: number;
  private height: number;
  private segments: number;
  private cols: number;
  private rows: number;

  constructor(
    mesh: THREE.Mesh,
    world: CANNON.World,
    width: number,
    height: number,
    segments: number
  ) {
    this.mesh = mesh;
    this.world = world;
    this.width = width;
    this.height = height;
    this.segments = segments;
    this.cols = segments + 1;
    this.rows = segments + 1;
    
    this.createPhysicsParticles();
    this.connectParticles();
  }

  // 🔥 입자 생성 (모든 버텍스에 물리 입자 할당)
  private createPhysicsParticles() {
    const positions = this.mesh.geometry.attributes.position;
    const posArray = positions.array;
    const vertexCount = positions.count;
    
    for (let i = 0; i < vertexCount; i++) {
      const i3 = i * 3;
      const x = posArray[i3];
      const y = posArray[i3 + 1];
      const z = posArray[i3 + 2];
      
      const col = i % this.cols;
      const row = Math.floor(i / this.cols);
      
      // 🔥 가장자리 고정 (왼쪽/오른쪽 가장자리 완전 고정)
      const isLeftEdge = col === 0;
      const isRightEdge = col === this.cols - 1;
      const isEdge = isLeftEdge || isRightEdge;
      
      // 입자 생성
      const particle = new CANNON.Body({
        mass: isEdge ? 0 : 0.015, // 가장자리는 고정, 내부는 가볍게
        shape: new CANNON.Sphere(0.005),
        position: new CANNON.Vec3(x, y, z),
        linearDamping: 0.01,
        angularDamping: 0.01,
      });
      
      if (isEdge) {
        particle.type = CANNON.Body.STATIC;
        particle.mass = 0;
      }
      
      this.world.addBody(particle);
      this.particles.push(particle);
    }
  }

  // 🔥 입자 연결 (강한 스프링으로 찢어짐 방지)
  private connectParticles() {
    // 수평 연결
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols - 1; col++) {
        const idx = row * this.cols + col;
        const nextIdx = row * this.cols + (col + 1);
        this.addConstraint(idx, nextIdx, 0.8); // 강성 0.8
      }
    }
    
    // 수직 연결
    for (let row = 0; row < this.rows - 1; row++) {
      for (let col = 0; col < this.cols; col++) {
        const idx = row * this.cols + col;
        const nextIdx = (row + 1) * this.cols + col;
        this.addConstraint(idx, nextIdx, 0.8);
      }
    }
    
    // 🔥 대각선 연결 (찢어짐 방지를 위해 강하게)
    for (let row = 0; row < this.rows - 1; row++) {
      for (let col = 0; col < this.cols - 1; col++) {
        const idx = row * this.cols + col;
        const diag1 = (row + 1) * this.cols + (col + 1);
        const diag2 = row * this.cols + (col + 1);
        const diag3 = (row + 1) * this.cols + col;
        
        this.addConstraint(idx, diag1, 0.5);
        this.addConstraint(diag2, diag3, 0.5);
      }
    }
  }

  private addConstraint(idx1: number, idx2: number, stiffness: number) {
    const p1 = this.particles[idx1];
    const p2 = this.particles[idx2];
    if (!p1 || !p2) return;
    
    // 거리 계산
    const dx = p1.position.x - p2.position.x;
    const dy = p1.position.y - p2.position.y;
    const dz = p1.position.z - p2.position.z;
    const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
    
    if (distance === 0) return;
    
    const constraint = new CANNON.DistanceConstraint(p1, p2, distance, stiffness);
    this.world.addConstraint(constraint);
    this.constraints.push(constraint);
  }

  // 🔥 바람 힘 적용 (순수 물리, 파동 없음)
  public applyWind(windStrength: number, windDirection: THREE.Vector3) {
    const vertexCount = this.particles.length;
    
    for (let i = 0; i < vertexCount; i++) {
      const particle = this.particles[i];
      
      // 고정 입자 스킵
      if (particle.type === CANNON.Body.STATIC) continue;
      
      // 🔥 랜덤 노이즈 (Perlin noise 대신 Math.random 사용)
      const noiseX = (Math.random() - 0.5) * 0.3;
      const noiseY = (Math.random() - 0.5) * 0.2;
      const noiseZ = (Math.random() - 0.5) * 0.3;
      
      // 바람 힘 (불규칙성 부여)
      const force = new CANNON.Vec3(
        (windDirection.x + noiseX) * windStrength * 0.4,
        (windDirection.y + noiseY) * windStrength * 0.15,
        (windDirection.z + noiseZ) * windStrength * 0.5
      );
      
      particle.applyForce(force, particle.position);
    }
  }

  // 물리 결과 동기화
  public syncToMesh() {
    const positions = this.mesh.geometry.attributes.position;
    const posArray = positions.array;
    const vertexCount = positions.count;
    
    for (let i = 0; i < vertexCount; i++) {
      const particle = this.particles[i];
      if (!particle) continue;
      
      const i3 = i * 3;
      posArray[i3] = particle.position.x;
      posArray[i3 + 1] = particle.position.y;
      posArray[i3 + 2] = particle.position.z;
    }
    
    positions.needsUpdate = true;
    this.mesh.geometry.computeVertexNormals();
  }

  // 리소스 정리
  public dispose() {
    this.particles.forEach(p => this.world.removeBody(p));
    this.constraints.forEach(c => this.world.removeConstraint(c));
  }
}

// 3D 종이 메쉬 컴포넌트
function PaperMesh({ 
  texture, 
  progress, 
  direction, 
  isActive,
  onComplete,
  isWobble
}: { 
  texture: THREE.Texture | null;
  progress: number;
  direction: 'forward' | 'backward' | null;
  isActive: boolean;
  onComplete?: () => void;
  isWobble: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const physicsRef = useRef<PhysicsPaper | null>(null);
  const worldRef = useRef<CANNON.World | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const timeRef = useRef(0);
  const windTimerRef = useRef(0);
  
  // 🔥 세그먼트 20으로 충분히 나누면서도 성능 유지
  const segments = 20;
  const width = viewport.width * 0.7;
  const height = viewport.height * 0.5;

  // 물리 세계 초기화
  useEffect(() => {
    if (!meshRef.current || !isWobble) return;

    // 물리 세계 생성
    const world = new CANNON.World();
    world.gravity.set(0, -0.2, 0);
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.allowSleep = true;
    world.sleepTimeLimit = 0.5;
    
    // 🔥 물리 스텝을 작게 해서 안정성 증가
    world.stepFrequency = 120;
    
    worldRef.current = world;

    // 물리 종이 생성
    const physics = new PhysicsPaper(
      meshRef.current,
      world,
      width,
      height,
      segments
    );
    physicsRef.current = physics;

    console.log(`✅ Physics paper created with ${(segments+1)*(segments+1)} vertices`);

    return () => {
      if (physicsRef.current) {
        physicsRef.current.dispose();
      }
    };
  }, [isWobble, width, height, segments]);

  // 물리 시뮬레이션
  useFrame(({ clock }) => {
    if (!meshRef.current || !worldRef.current || !physicsRef.current) return;
    
    const mesh = meshRef.current;
    const world = worldRef.current;
    const physics = physicsRef.current;
    const time = clock.getElapsedTime();
    timeRef.current = time;
    
    const isForward = direction === 'forward';
    const p = Math.min(Math.max(progress, 0), 1);
    
    // 종이 넘김 각도
    const rotateY = isForward ? -Math.PI * p : Math.PI * p;
    mesh.rotation.y = rotateY;
    
    // 종이 위치
    const offset = isForward ? -viewport.width * 0.3 * p : viewport.width * 0.3 * p;
    mesh.position.x = offset;
    mesh.position.z = -Math.sin(p * Math.PI) * 0.3;

    if (isWobble && isActive) {
      // 🔥 바람 강도 (물리적으로만 제어)
      const windStrength = Math.sin(p * Math.PI) * 2.5 + 1.0;
      
      // 🔥 바람 방향 (시간에 따라 천천히 변화)
      windTimerRef.current += 0.01;
      const windAngle = Math.sin(windTimerRef.current * 0.2) * 0.5;
      const windDir = new THREE.Vector3(
        0.6 + Math.sin(windTimerRef.current * 0.15) * 0.3,
        0.1 + Math.cos(windTimerRef.current * 0.1) * 0.1,
        0.3 + Math.sin(windTimerRef.current * 0.12) * 0.2
      ).normalize();
      
      // 🔥 물리 바람 적용 (파동 없음, 순수 물리 엔진)
      physics.applyWind(windStrength, windDir);
      
      // 🔥 물리 스텝 (더 작은 스텝으로 안정성 증가)
      world.step(1 / 120, 1 / 120, 5);
      
      // 물리 결과 동기화
      physics.syncToMesh();
    }
    
    // 애니메이션 완료
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
      args={[width, height, segments, segments]}
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
  const [isWobble, setIsWobble] = useState(true);

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

  useEffect(() => {
    setIsWobble(isActive);
  }, [isActive]);

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
        Loading 3D paper physics...
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
        background: 'linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%)',
        position: 'relative',
      }}
    >
      <Canvas
        camera={{ 
          position: [0, 0, 2.8],
          fov: 40,
          near: 0.1,
          far: 10,
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 3, 2]} intensity={1.2} />
        <directionalLight position={[-2, 1, -1]} intensity={0.5} />
        <directionalLight position={[0, -1, 1]} intensity={0.3} />
        <pointLight position={[0, 0, 2]} intensity={0.4} />
        
        <PaperMesh
          texture={texture}
          progress={progress}
          direction={direction}
          isActive={isActive}
          onComplete={onFlipComplete}
          isWobble={isWobble}
        />
        
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
          background: 'rgba(0,0,0,0.6)',
          color: 'white',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <span>{Math.round(progress * 100)}%</span>
        <span style={{ opacity: 0.5 }}>|</span>
        <span style={{ color: isActive ? '#4ade80' : '#888' }}>
          {isActive ? '🌊 Physics ON' : '⏸ Paused'}
        </span>
      </div>
    </div>
  );
}
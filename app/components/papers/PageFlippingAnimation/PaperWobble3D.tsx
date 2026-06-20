// app/components/papers/PaperWobble3D.tsx
"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { WindConfig, windConfigs } from '@/app/data/windConfigs';

interface PaperWobble3DProps {
  imagePath: string;
  isActive: boolean;
  progress: number;
  direction: 'forward' | 'backward' | null;
  onFlipComplete?: () => void;
  windConfig?: WindConfig; // 🆕 바람 설정 받기
}

// 🔥 순수 물리 기반 종이
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
  private config: WindConfig;

  constructor(
    mesh: THREE.Mesh,
    world: CANNON.World,
    width: number,
    height: number,
    segments: number,
    config: WindConfig
  ) {
    this.mesh = mesh;
    this.world = world;
    this.width = width;
    this.height = height;
    this.segments = segments;
    this.cols = segments + 1;
    this.rows = segments + 1;
    this.config = config;
    
    this.createPhysicsParticles();
    this.connectParticles();
  }

  // 입자 생성
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
      
      const isLeftEdge = col === 0;
      const isRightEdge = col === this.cols - 1;
      const isEdge = isLeftEdge || isRightEdge;
      
      // 🔥 config에서 가져온 파라미터로 입자 생성
      const mass = isEdge ? 0 : 0.015 * (1 - this.config.paperStiffness * 0.5);
      const damping = 0.01 + this.config.paperDamping * 0.05;
      
      const particle = new CANNON.Body({
        mass: mass,
        shape: new CANNON.Sphere(0.005),
        position: new CANNON.Vec3(x, y, z),
        linearDamping: damping,
        angularDamping: damping,
      });
      
      if (isEdge) {
        particle.type = CANNON.Body.STATIC;
        particle.mass = 0;
      }
      
      this.world.addBody(particle);
      this.particles.push(particle);
    }
  }

  // 입자 연결
  private connectParticles() {
    // 🔥 config에서 가져온 강성
    const stiffness = 0.3 + this.config.paperStiffness * 0.6;
    
    // 수평 연결
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols - 1; col++) {
        const idx = row * this.cols + col;
        const nextIdx = row * this.cols + (col + 1);
        this.addConstraint(idx, nextIdx, stiffness);
      }
    }
    
    // 수직 연결
    for (let row = 0; row < this.rows - 1; row++) {
      for (let col = 0; col < this.cols; col++) {
        const idx = row * this.cols + col;
        const nextIdx = (row + 1) * this.cols + col;
        this.addConstraint(idx, nextIdx, stiffness);
      }
    }
    
    // 대각선 연결
    const diagStiffness = stiffness * 0.6;
    for (let row = 0; row < this.rows - 1; row++) {
      for (let col = 0; col < this.cols - 1; col++) {
        const idx = row * this.cols + col;
        const diag1 = (row + 1) * this.cols + (col + 1);
        const diag2 = row * this.cols + (col + 1);
        const diag3 = (row + 1) * this.cols + col;
        
        this.addConstraint(idx, diag1, diagStiffness);
        this.addConstraint(diag2, diag3, diagStiffness);
      }
    }
  }

  private addConstraint(idx1: number, idx2: number, stiffness: number) {
    const p1 = this.particles[idx1];
    const p2 = this.particles[idx2];
    if (!p1 || !p2) return;
    
    const dx = p1.position.x - p2.position.x;
    const dy = p1.position.y - p2.position.y;
    const dz = p1.position.z - p2.position.z;
    const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
    
    if (distance === 0) return;
    
    const constraint = new CANNON.DistanceConstraint(p1, p2, distance, stiffness);
    this.world.addConstraint(constraint);
    this.constraints.push(constraint);
  }

  // 🔥 바람 적용 (config 사용)
  public applyWind(time: number, progress: number) {
    const vertexCount = this.particles.length;
    const p = Math.min(Math.max(progress, 0), 1);
    
    // 🔥 config에서 가져온 파라미터
    const baseStrength = this.config.windStrength;
    const turbulence = this.config.turbulence;
    const directionSpeed = this.config.directionChangeSpeed;
    const strengthVariation = this.config.strengthVariation;
    const edgeWeight = this.config.edgeWeight;
    const wobbleIntensity = this.config.wobbleIntensity;
    
    // 바람 강도 (progress에 따라 변동)
    const progressFactor = Math.sin(p * Math.PI);
    const windStrength = baseStrength * (0.5 + progressFactor * 0.5) * (1 + strengthVariation * 0.5);
    
    // 바람 방향 (시간에 따라 변화)
    const angleX = time * directionSpeed * 0.5;
    const angleY = time * directionSpeed * 0.3;
    const angleZ = time * directionSpeed * 0.2;
    
    const baseDir = this.config.windDirection;
    const dirX = baseDir.x + Math.sin(angleX) * turbulence * 0.5;
    const dirY = baseDir.y + Math.cos(angleY) * turbulence * 0.3;
    const dirZ = baseDir.z + Math.sin(angleZ) * turbulence * 0.4;
    
    const windDir = new THREE.Vector3(dirX, dirY, dirZ).normalize();
    
    for (let i = 0; i < vertexCount; i++) {
      const particle = this.particles[i];
      if (particle.type === CANNON.Body.STATIC) continue;
      
      const col = i % this.cols;
      const row = Math.floor(i / this.cols);
      const u = col / this.cols;
      const v = row / this.rows;
      
      // 가장자리 효과
      const edgeX = Math.sin(u * Math.PI);
      const edgeY = Math.sin(v * Math.PI);
      const edgeFactor = edgeX * edgeY * edgeWeight + (1 - edgeWeight);
      
      // 🔥 난기류 (turbulence 사용)
      const noise1 = (Math.random() - 0.5) * turbulence * 2;
      const noise2 = (Math.random() - 0.5) * turbulence * 1.5;
      const noise3 = (Math.random() - 0.5) * turbulence * 2;
      
      // wobble 강도
      const wobble = wobbleIntensity * (0.5 + Math.sin(time * 2 + u * 5 + v * 3) * 0.5);
      
      const force = new CANNON.Vec3(
        (windDir.x + noise1 * 0.3) * windStrength * 0.4 * (1 + wobble * 0.3),
        (windDir.y + noise2 * 0.2) * windStrength * 0.15 * (1 + wobble * 0.2),
        (windDir.z + noise3 * 0.3) * windStrength * 0.5 * (1 + wobble * 0.4)
      );
      
      // edgeFactor 적용
      force.scale(edgeFactor, force);
      
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
  isWobble,
  windConfig
}: { 
  texture: THREE.Texture | null;
  progress: number;
  direction: 'forward' | 'backward' | null;
  isActive: boolean;
  onComplete?: () => void;
  isWobble: boolean;
  windConfig: WindConfig;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const physicsRef = useRef<PhysicsPaper | null>(null);
  const worldRef = useRef<CANNON.World | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const timeRef = useRef(0);
  
  const segments = 20;
  const width = viewport.width * 0.7;
  const height = viewport.height * 0.5;

  // 물리 세계 초기화
  useEffect(() => {
    if (!meshRef.current || !isWobble) return;

    const world = new CANNON.World();
    world.gravity.set(0, -0.2, 0);
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.allowSleep = true;
    world.sleepTimeLimit = 0.5;
    
    worldRef.current = world;

    const physics = new PhysicsPaper(
      meshRef.current,
      world,
      width,
      height,
      segments,
      windConfig
    );
    physicsRef.current = physics;

    return () => {
      if (physicsRef.current) {
        physicsRef.current.dispose();
      }
    };
  }, [isWobble, width, height, segments, windConfig]);

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
    
    const rotateY = isForward ? -Math.PI * p : Math.PI * p;
    mesh.rotation.y = rotateY;
    
    const offset = isForward ? -viewport.width * 0.3 * p : viewport.width * 0.3 * p;
    mesh.position.x = offset;
    mesh.position.z = -Math.sin(p * Math.PI) * 0.3;

    if (isWobble && isActive) {
      // 🔥 config 기반 바람 적용
      physics.applyWind(time, p);
      
      world.step(1 / 120, 1 / 120, 5);
      physics.syncToMesh();
    }
    
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
  windConfig = windConfigs.gentleBreeze, // 기본값
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
          windConfig={windConfig}
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
          {isActive ? `🌊 ${windConfig.name}` : '⏸ Paused'}
        </span>
      </div>
    </div>
  );
}
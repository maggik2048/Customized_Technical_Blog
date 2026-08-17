// app/components/papers/PaperWobble3D.tsx
"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { WindConfig, windConfigs } from '@/app/data/windConfigs';

// 🔥 위치/크기 설정 import
import {
  CONTAINER_CONFIG,
  CAMERA_CONFIG,
  PAPER_CONFIG,
  POSITION_CONFIG,
  LIGHTING_CONFIG,
  SHADOW_CONFIG,
  LOADING_CONFIG,
  OVERLAY_CONFIG,
  calculatePaperSize,
  calculatePaperPosition,
  calculatePaperRotation,
} from './PaperWobble3DPositioning';

interface PaperWobble3DProps {
  imagePath: string;
  isActive: boolean;
  progress: number;
  direction: 'forward' | 'backward' | null;
  onFlipComplete?: () => void;
  windConfig?: WindConfig;
  onClose?: () => void;
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

  private connectParticles() {
    const stiffness = 0.3 + this.config.paperStiffness * 0.6;
    
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols - 1; col++) {
        const idx = row * this.cols + col;
        const nextIdx = row * this.cols + (col + 1);
        this.addConstraint(idx, nextIdx, stiffness);
      }
    }
    
    for (let row = 0; row < this.rows - 1; row++) {
      for (let col = 0; col < this.cols; col++) {
        const idx = row * this.cols + col;
        const nextIdx = (row + 1) * this.cols + col;
        this.addConstraint(idx, nextIdx, stiffness);
      }
    }
    
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

  public applyWind(time: number, progress: number) {
    const vertexCount = this.particles.length;
    const p = Math.min(Math.max(progress, 0), 1);
    
    const baseStrength = this.config.windStrength;
    const turbulence = this.config.turbulence;
    const directionSpeed = this.config.directionChangeSpeed;
    const strengthVariation = this.config.strengthVariation;
    const edgeWeight = this.config.edgeWeight;
    const wobbleIntensity = this.config.wobbleIntensity;
    
    const progressFactor = Math.sin(p * Math.PI);
    const windStrength = baseStrength * (0.5 + progressFactor * 0.5) * (1 + strengthVariation * 0.5);
    
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
      
      const edgeX = Math.sin(u * Math.PI);
      const edgeY = Math.sin(v * Math.PI);
      const edgeFactor = edgeX * edgeY * edgeWeight + (1 - edgeWeight);
      
      const noise1 = (Math.random() - 0.5) * turbulence * 2;
      const noise2 = (Math.random() - 0.5) * turbulence * 1.5;
      const noise3 = (Math.random() - 0.5) * turbulence * 2;
      
      const wobble = wobbleIntensity * (0.5 + Math.sin(time * 2 + u * 5 + v * 3) * 0.5);
      
      const force = new CANNON.Vec3(
        (windDir.x + noise1 * 0.3) * windStrength * 0.4 * (1 + wobble * 0.3),
        (windDir.y + noise2 * 0.2) * windStrength * 0.15 * (1 + wobble * 0.2),
        (windDir.z + noise3 * 0.3) * windStrength * 0.5 * (1 + wobble * 0.4)
      );
      
      force.scale(edgeFactor, force);
      particle.applyForce(force, particle.position);
    }
  }

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
  
  const segments = PAPER_CONFIG.segments;
  const { width, height } = calculatePaperSize(viewport.width, viewport.height);

  useEffect(() => {
    if (!meshRef.current || !isWobble) return;

    const world = new CANNON.World();
    world.gravity.set(0, -0.2, 0);
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.allowSleep = true;
    // ✅ REMOVED: world.sleepTimeLimit = 0.5; - Property doesn't exist in this version
    
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

  useFrame(({ clock }) => {
    if (!meshRef.current || !worldRef.current || !physicsRef.current) return;
    
    const mesh = meshRef.current;
    const world = worldRef.current;
    const physics = physicsRef.current;
    const time = clock.getElapsedTime();
    timeRef.current = time;
    
    const isForward = direction === 'forward';
    const p = Math.min(Math.max(progress, 0), 1);
    
    const rotateY = calculatePaperRotation(p, isForward);
    mesh.rotation.y = rotateY;
    
    const { x, z } = calculatePaperPosition(p, viewport.width, isForward);
    mesh.position.x = x;
    mesh.position.z = z;

    if (isWobble && isActive) {
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
        roughness={PAPER_CONFIG.roughness}
        metalness={PAPER_CONFIG.metalness}
        side={THREE.DoubleSide}
        transparent={true}
        opacity={PAPER_CONFIG.opacity}
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
  windConfig = windConfigs.gentleBreeze,
  onClose,
}: PaperWobble3DProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWobble, setIsWobble] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isActive]);

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

  if (!isActive) {
    return null;
  }

  if (isLoading || !texture) {
    return (
      <div
        ref={containerRef}
        style={{
          width: CONTAINER_CONFIG.width,
          height: CONTAINER_CONFIG.height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.3)', // 🔥 투명한 로딩
          borderRadius: LOADING_CONFIG.borderRadius,
          fontSize: LOADING_CONFIG.fontSize,
          color: '#fff',
          position: CONTAINER_CONFIG.position,
          top: CONTAINER_CONFIG.top,
          left: CONTAINER_CONFIG.left,
          zIndex: CONTAINER_CONFIG.zIndex,
        }}
      >
        <span style={{ background: 'rgba(0,0,0,0.5)', padding: '20px 40px', borderRadius: '12px' }}>
          Loading 3D paper...
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: CONTAINER_CONFIG.width,
        height: CONTAINER_CONFIG.height,
        borderRadius: CONTAINER_CONFIG.borderRadius,
        overflow: CONTAINER_CONFIG.overflow,
        background: CONTAINER_CONFIG.background,
        position: CONTAINER_CONFIG.position,
        top: CONTAINER_CONFIG.top,
        left: CONTAINER_CONFIG.left,
        zIndex: CONTAINER_CONFIG.zIndex,
        pointerEvents: CONTAINER_CONFIG.pointerEvents,
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {/* 닫기 버튼 */}
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '30px',
            right: '40px',
            zIndex: 100000,
            background: 'rgba(0,0,0,0.4)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            fontSize: '20px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            pointerEvents: 'auto',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.background = 'rgba(255,0,0,0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
          }}
        >
          ✕
        </button>
      )}

      {/* 상단 정보 */}
      <div
        style={{
          position: 'absolute',
          top: '30px',
          left: '40px',
          zIndex: 100000,
          color: 'white',
          fontSize: '12px',
          background: 'rgba(0,0,0,0.3)',
          padding: '6px 12px',
          borderRadius: '6px',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'auto',
        }}
      >
        <span>🌊 3D</span>
        <span style={{ opacity: 0.4 }}>|</span>
        <span style={{ fontSize: '10px', opacity: 0.6 }}>ESC 닫기</span>
      </div>

      <Canvas
        camera={{ 
          position: CAMERA_CONFIG.position,
          fov: CAMERA_CONFIG.fov,
          near: CAMERA_CONFIG.near,
          far: CAMERA_CONFIG.far,
        }}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
        }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        {/* 배경 제거 - 약한 조명만 유지 */}
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 3]} intensity={1.2} />
        <directionalLight position={[-3, 2, -2]} intensity={0.5} />
        <directionalLight position={[0, -2, 2]} intensity={0.3} />
        <pointLight position={[0, 0, 3]} intensity={0.4} />
        
        <PaperMesh
          texture={texture}
          progress={progress}
          direction={direction}
          isActive={isActive}
          onComplete={onFlipComplete}
          isWobble={isWobble}
          windConfig={windConfig}
        />
        
        {/* 그림자 제거 */}
      </Canvas>
      
      {/* 하단 오버레이 */}
      <div style={OVERLAY_CONFIG}>
        <span>{Math.round(progress * 100)}%</span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span style={{ color: isActive ? '#4ade80' : '#888', fontSize: '12px' }}>
          {isActive ? `🌊 ${windConfig.name}` : '⏸ Paused'}
        </span>
      </div>
    </div>
  );
}
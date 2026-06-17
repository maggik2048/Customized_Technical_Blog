// components/CodeBlock3D.tsx
'use client'

import { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useHDRI } from './HDRIProvider'

export function CodeBlock3D({ children, language }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hdriTexture = useHDRI()
  
  // 1. 코드를 Canvas Texture로 변환
  const codeTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 768
    
    const ctx = canvas.getContext('2d')!
    // 배경
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // 코드 렌더링 (간단히 텍스트로)
    ctx.fillStyle = '#1a1a1a'
    ctx.font = '16px monospace'
    const lines = String(children).split('\n')
    lines.forEach((line, i) => {
      ctx.fillText(line, 20, 30 + i * 24)
    })
    
    return new THREE.CanvasTexture(canvas)
  }, [children])

  useEffect(() => {
    if (!canvasRef.current || !hdriTexture) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10)
    camera.position.z = 3

    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true 
    })
    renderer.setSize(600, 400)

    // 2. 오목/볼록 평면 (렌즈 효과)
    const geometry = new THREE.PlaneGeometry(3.5, 2.5, 64, 64)
    const positions = geometry.attributes.position
    
    // 정점 휘게 만들기 (볼록)
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const u = x / 1.75  // -2 ~ 2
      const v = y / 1.25  // -1.5 ~ 1.5
      
      // 렌즈 왜곡: z = (u² + v²) * 강도
      const distortion = 0.12  // 양수=볼록, 음수=오목
      const z = (u * u + v * v) * distortion
      positions.setZ(i, z)
    }
    geometry.computeVertexNormals()

    // 3. 재질 (HDRI 반사)
    const material = new THREE.MeshPhysicalMaterial({
      map: codeTexture,        // 코드 텍스처
      envMap: hdriTexture,     // HDRI 반사
      envMapIntensity: 0.8,
      metalness: 0.0,
      roughness: 0.15,
      clearcoat: 0.3,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // 4. 애니메이션 (부드러운 회전)
    const animate = () => {
      requestAnimationFrame(animate)
      mesh.rotation.y += 0.002
      renderer.render(scene, camera)
    }
    animate()

    return () => renderer.dispose()
  }, [hdriTexture, codeTexture])

  return <canvas ref={canvasRef} className="w-full rounded-2xl" />
}
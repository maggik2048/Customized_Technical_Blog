"use client";

import "katex/dist/katex.min.css";
import Sidebar from "./components/Sidebar";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden">
        {/* 왼쪽 사이드바 */}
        <Sidebar />

        {/* 오른쪽 메인 콘텐츠 */}
        <main className="flex-1 bg-gray-100 p-6 overflow-auto relative">
          {/* 3D Canvas */}
          <div className="w-full h-96 mb-6 border rounded shadow">
            <Canvas camera={{ position: [3, 3, 3] }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} />
              <mesh rotation={[0.4, 0.2, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="peru" />
              </mesh>
              <OrbitControls />
            </Canvas>
          </div>

          {/* 수식 + 본문 */}
          <div className="prose max-w-none">{children}</div>
        </main>
      </body>
    </html>
  );
}
// app/page.tsx
"use client";

import { InlineMath, BlockMath } from "react-katex";
import Cube from "./components/Cube";

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Page Header */}
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900">Graphics Lab V2</h1>
        <p className="text-gray-600 mt-2">
          Interactive 3D visualizations & mathematical expressions with KaTeX
        </p>
      </header>

      {/* Math Examples */}
      <section className="prose max-w-none bg-white p-6 rounded shadow">
        <h2>Mathematical Expressions</h2>
        <p>
          Inline Example: <InlineMath math="E=mc^2" />
        </p>
        <p>
          Block Example:
          <BlockMath math="\int_0^\infty e^{-x} dx = 1" />
        </p>
        <p>
          여러 수식:
          <BlockMath math="\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}" />
        </p>
      </section>

      {/* 3D Cube Example */}
      <section className="prose max-w-none bg-white p-6 rounded shadow">
        <h2>3D Cube Example</h2>
        <div className="w-full h-96 mt-4">
          <Cube />
        </div>
      </section>

      {/* About Section */}
      <section className="prose max-w-none bg-white p-6 rounded shadow">
        <h2>About</h2>
        <p>
          This lab integrates Three.js/WebGL, React interactive UI, and
          KaTeX for mathematical typesetting. Sidebar is fully scrollable
          with nested menus and hover effects.
        </p>
      </section>
    </div>
  );
}
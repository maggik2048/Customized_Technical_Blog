"use client";

import { InlineMath } from "react-katex";
import dynamic from "next/dynamic";
import Cube from "./components/Cube";

const BlockMathNoSSR = dynamic(
  () => import("react-katex").then(mod => mod.BlockMath),
  { ssr: false }
);

export default function HomePage() {
  return (
    <div className="space-y-10">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900">Graphics Lab V2</h1>
        <p className="text-gray-600 mt-2">
          Interactive 3D visualizations & mathematical expressions with KaTeX
        </p>
      </header>

      <section className="prose max-w-none bg-white p-6 rounded shadow">
        <h2>Mathematical Expressions</h2>
        <p>Inline Example: <InlineMath math="E=mc^2" /></p>

        <div>
          Block Example:
          <BlockMathNoSSR math="\int_0^\infty e^{-x} dx = 1" />
        </div>

        <div>
          여러 수식:
          <BlockMathNoSSR math="\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}" />
        </div>
      </section>

      <section className="prose max-w-none bg-white p-6 rounded shadow">
        <h2>3D Cube Example</h2>
        <div className="w-full h-96 mt-4">
          <Cube />
        </div>
      </section>

      <section className="prose max-w-none bg-white p-6 rounded shadow">
        <h2>About</h2>
        <p>
          This lab demonstrates the integration of Three.js/WebGL with
          React, interactive UI via Tailwind, and mathematical typesetting
          using KaTeX.
        </p>
      </section>
    </div>
  );
}
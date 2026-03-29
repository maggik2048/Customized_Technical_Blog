"use client";

import { InlineMath, BlockMath } from "react-katex";
import dynamic from "next/dynamic";

// Correct import path relative to page.tsx
const Cube = dynamic(() => import("../../components/Cube"), { ssr: false });

export default function DiscreteMathPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Discrete Mathematics</h1>

      {/* KaTeX Section */}
      <section className="bg-gray-800 p-4 rounded">
        <h2>Example Formulas</h2>
        <p>Inline: <InlineMath math="a^2 + b^2 = c^2" /></p>
        <p>Block: <BlockMath math="\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}" /></p>
      </section>

      {/* 3D Cube Section */}
      <section className="bg-gray-800 p-4 rounded">
        <h2>3D Visualization</h2>
        <div className="w-full h-96">
          <Cube />
        </div>
      </section>
    </div>
  );
}
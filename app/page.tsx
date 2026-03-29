"use client";

import { InlineMath, BlockMath } from "react-katex";
import Cube from "./components/Cube";

export default function HomePage() {
  return (
    <div>
      <h1>Graphics Lab V2</h1>

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

      <h2>3D Cube Example</h2>
      <Cube />
    </div>
  );
}
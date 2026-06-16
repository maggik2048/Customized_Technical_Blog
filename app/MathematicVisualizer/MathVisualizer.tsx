import React, { useEffect, useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

// Add these interfaces
interface Projection {
  min: number;
  max: number;
}

interface MathVisualizerProps {
  data: {
    projA: Projection;
    projB: Projection;
    overlap: boolean;
    axisIndex: number;
    axis: { x: number; y: number };
  };
}

// Fix the function signature by adding the type
export default function MathVisualizer({ data }: MathVisualizerProps) {
  const { projA, projB, overlap, axisIndex } = data;

  const [t, setT] = useState(0);

  useEffect(() => {
    setT(0);
    let frame: number;
    let start: number;

    function animate(time: number) {
      if (!start) start = time;
      const progress = Math.min((time - start) / 300, 1);
      setT(progress);

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [data]);

  const format = (v: number) => v.toFixed(2);

  return (
    <div style={{ width: 400, padding: 16 }}>
      <div style={{ opacity: t }}>
        <BlockMath math={`\\text{axis} = ${axisIndex}`} />

        <BlockMath
          math={`A = [${format(projA.min)},\\; ${format(projA.max)}]`}
        />

        <BlockMath
          math={`B = [${format(projB.min)},\\; ${format(projB.max)}]`}
        />

        <BlockMath
          math={`A \\cap B = ${overlap ? "\\neq \\emptyset" : "\\emptyset"}`}
        />
      </div>
    </div>
  );
}
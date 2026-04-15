import React, { useEffect, useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function MathVisualizer({ data }) {
  const { projA, projB, overlap, axisIndex } = data;

  const [t, setT] = useState(0);

  // 간단한 fade / morph 애니메이션 step
  useEffect(() => {
    setT(0);
    let frame;
    let start;

    function animate(time) {
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

  // interpolation 느낌 (텍스트 애니메이션용)
  const format = (v) => v.toFixed(2);

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
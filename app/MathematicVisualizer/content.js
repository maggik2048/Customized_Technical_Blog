export function generateDoc({ projA, projB, overlap, axisIndex }) {
  return `
# SAT Projection Visualization

## Projection Results

- Axis index: **${axisIndex}**

$$
A_{proj} = [${projA.min.toFixed(3)}, ${projA.max.toFixed(3)}]
$$

$$
B_{proj} = [${projB.min.toFixed(3)}, ${projB.max.toFixed(3)}]
$$

## Collision Test

We test interval intersection:

$$
A \\cap B =
\\begin{cases}
\\emptyset & \\text{if no overlap} \\\\
\\neq \\emptyset & \\text{if overlap exists}
\\end{cases}
$$

## Result

**Collision: ${overlap ? "TRUE" : "FALSE"}**

---

## SAT Condition

Two convex shapes collide if:

$$
\\exists \\; axis \\; s.t. \\; projection(A) \\cap projection(B) = \\emptyset
$$
`;
}
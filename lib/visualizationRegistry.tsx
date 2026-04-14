// lib/visualizationRegistry.tsx

import dynamic from "next/dynamic";

// lazy loading
const SatProjection = dynamic(
  () => import("@/app/visualizations/SatProjection"),
  { ssr: false }
);

const Torus = dynamic(
  () => import("@/app/visualizations/TorusWithNormals"),
  { ssr: false }
);

// 🔥 registry
export const visualizationRegistry: Record<string, any> = {
  SAT: (props: any) => <SatProjection {...props} />,
  TORUS: (props: any) => <Torus {...props} />,
};
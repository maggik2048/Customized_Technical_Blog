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

//  ModelSlot = upload + viewer wrapper
const ModelSlot = dynamic(
  () => import("@/app/visualizations/ModelSlot"),
  { ssr: false }
);


const DrawingOverlay = dynamic(
  () => import("@/app/visualizations/DrawingNotation/DrawingOverlay"),
  { ssr: false }
);

export const visualizationRegistry: Record<string, any> = {
  SAT: (props: any) => <SatProjection {...props} />,
  TORUS: (props: any) => <Torus {...props} />,
  MODEL: (props: any) => <ModelSlot {...props} />,
  ANNOTATE: (props: any) => (
    <DrawingOverlay width={800} height={500} {...props} />
  ),
};
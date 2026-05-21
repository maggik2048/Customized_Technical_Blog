import dynamic from "next/dynamic";

const SatProjection = dynamic(() => import("@/app/Graphics/SatProjection"), { ssr: false });
const Torus = dynamic(() => import("@/app/Graphics/TorusWithNormals"), { ssr: false });
const ModelSlot = dynamic(() => import("@/app/Graphics/ModelSlot"), { ssr: false });
const DrawingOverlay = dynamic(() => import("@/app/Graphics/DrawingNotation/DrawingOverlay"), { ssr: false });
const Lidar = dynamic(() => import("@/app/Graphics/SphericalToCartesianCoordinates"), { ssr: false });

export const visualizationRegistry: Record<string, any> = {
  SAT: (props: any) => <SatProjection {...props} />,
  TORUS: (props: any) => <Torus {...props} />,
  MODEL: (props: any) => <ModelSlot {...props} />,
  ANNOTATE: (props: any) => (
    <DrawingOverlay width={800} height={500} {...props} />
  ),
  LIDAR: (props: any) => <Lidar {...props} />,
};
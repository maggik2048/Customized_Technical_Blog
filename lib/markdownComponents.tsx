import dynamic from "next/dynamic";

// 🔥 lazy loading
const Torus = dynamic(() => import("@/app/visualizations/TorusWithNormals"), {
  ssr: false,
});



// 🔥 registry (핵심)
export const markdownComponents = {
  Torus: (props: any) => (
    <div style={{ width: 600, height: 400 }}>
      <Torus {...props} />
    </div>
  )
};
"use client";

import dynamic from "next/dynamic";

const SatProjection = dynamic(
  () => import("@/app/Graphics/SatProjection"),
  { ssr: false }
);

const Torus = dynamic(
  () => import("@/app/Graphics/TorusWithNormals"),
  { ssr: false }
);

const ModelSlot = dynamic(
  () => import("@/app/Graphics/ModelSlot"),
  { ssr: false }
);

const DrawingOverlay = dynamic(
  () =>
    import("@/app/Graphics/DrawingNotation/DrawingOverlay"),
  { ssr: false }
);

const Lidar = dynamic(
  () =>
    import("@/app/Graphics/SphericalToCartesianCoordinates"),
  { ssr: false }
);

export const visualizationRegistry: Record<
  string,
  any
> = {
  SAT: SatProjection,

  TORUS: Torus,

  MODEL: ModelSlot,

  ANNOTATE: (props: any) => (
    <DrawingOverlay
      width={800}
      height={500}
      {...props}
    />
  ),

  LIDAR: Lidar,
};

export function extractVisualization(
  content?: string
) {
  if (!content) return null;

  const match = content.match(
    /\[(SAT|TORUS|MODEL|ANNOTATE|LIDAR)\]/
  );

  return match?.[1] ?? null;
}

export function isInteractivePost(post: any) {
  return !!extractVisualization(post?.content);
}

export function partitionPostsByInteraction(
  posts: any[]
) {
  const interactivePosts = posts.filter(
    isInteractivePost
  );

  const normalPosts = posts.filter(
    (post) => !isInteractivePost(post)
  );

  return {
    interactivePosts,
    normalPosts,
  };
}
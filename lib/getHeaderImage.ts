type Post = {
  header_image?: string | null;
  category?: string | null;
};

const categoryHeaderMap: Record<string, string> = {
  // ===== Physics =====
  fluid_mechanics: "/images/headers/fluid_mechanics.jpg",
  thermodynamics: "/images/headers/thermodynamics.jpg",

  // ===== Math =====
  linear_algebra: "/images/headers/linear_algebra.jpg",
  diff_eq: "/images/headers/diffEQ2.png",
  complex_analysis: "/images/headers/complex_analysis.jpg",
  prob_stats: "/images/headers/prob_stats.jpg",
  comp_geometry: "/images/headers/comp_geometry.jpg",
  numerical_analysis: "/images/headers/numerical_analysis.jpg",
  optimization: "/images/headers/optimization.jpg",

  // ===== CS =====
  network: "/images/headers/network.png",
  ai: "/images/headers/ai.jpg",
  sqldb: "/images/headers/sqldb.png",
  compiler: "/images/headers/compiler.jpg",
  embed: "/images/headers/embed.jpg",
  discrete: "/images/headers/discrete.jpg",
  digitalelec: "/images/headers/digitalelec.jpg",
  os: "/images/headers/os.jpg",
  systems: "/images/headers/systems.jpg",
  dsa: "/images/headers/dsa.jpg",
  cpp: "/images/headers/cpp.jpg",
  se: "/images/headers/se5.png",
  security: "/images/headers/security.jpg",
  mt_concurrency: "/images/headers/concurrency.jpg",
  graphics_pipeline: "/images/headers/graphics_pipeline.jpg",
  unreal: "/images/headers/unrealengine.jpg",
  digitalTwin: "/images/headers/digitalTwin2.png",

  // ===== fallback =====
  default: "/images/headers/default.jpg",
};

export function getHeaderImage(post: Post): string {
  // 1️ post 직접 지정!
  if (post.header_image) return post.header_image;

  // 2️ category 기반
  if (post.category && categoryHeaderMap[post.category]) {
    return categoryHeaderMap[post.category];
  }

  // 3️ fallback
  return categoryHeaderMap.default;
}
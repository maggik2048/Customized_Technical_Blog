// getHeaderImage.ts

export const CATEGORY_TREE = [
  {
    name: "University Physics Revisited",
    slug: "physics_revisited",
    children: [
      { name: "la langue française(French Language)", slug: "french" },
      { name: "Fluid Mechanics", slug: "fluid_mechanics" },
      { name: "Thermodynamics", slug: "thermodynamics" },
    ],
  },
  {
    name: "University Mathematics Revisited",
    slug: "math_revisited",
    children: [
      { name: "Linear Algebra", slug: "linear_algebra" },
      { name: "Differential equations", slug: "diff_eq" },
      { name: "Complex Analysis", slug: "complex_analysis" },
      { name: "Probability&Statistics", slug: "prob_stats" },
      { name: "Computational Geometry ", slug: "comp_geometry" },
      { name: "Numerical Analysis", slug: "numerical_analysis" },
      { name: "Optimization", slug: "optimization" },
    ],
  },
  {
    name: "Computer Science Revisited(학부 기초 정리)",
    slug: "cs_revisited",
    children: [
      { name: "Network", slug: "network" },
      { name: "Artificial intelligence", slug: "ai" },
      { name: "SQL&Database", slug: "sqldb" },
      { name: "Compiler & Programming Language", slug: "compiler" },
      { name: "Embeded", slug: "embed" },
      { name: "Discrete Mathematics", slug: "discrete" },
      { name: "Digital Electronics", slug: "digitalelec" },
      { name: "Operating Systems", slug: "os" },
      { name: "Systems Programming", slug: "systems" },
      { name: "DataStructure & Algorithm", slug: "dsa" },
      { name: "C++", slug: "cpp" },
      { name: "ObjectOrientedProgramming(OOP) & Design Pattern", slug: "oop" },
      { name: "Software Engineering", slug: "se" },
      { name: "Security", slug: "security" },
      { name: "Multithreading & Concurrency", slug: "mt_concurrency" },
      { name: "Graphics Pipeline & HLSL", slug: "graphics_pipeline" },
      { name: "UnrealEngine Client programming", slug: "unreal" },
      { name: "Digital Twin & Unreal Engine Project", slug: "digitalTwin" },
      { name: "Mathematics for Games", slug: "gameMath" },
    ],
  },
];

type Post = {
  header_image?: string | null;
  category?: string | null;
};

const categoryHeaderMap: Record<string, string> = {
  // ===== Physics =====
  french: "/images/headers/french.jpg",
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
  dsa: "/images/headers/algorithm234567.jpg",
  cpp: "/images/headers/cpp555566.jpg",
  java: "/images/headers/java.jpg",
  python: "/images/headers/python1.jpg",
  oop: "/images/headers/oop1111.jpg",
  se: "/images/headers/se5.png",
  security: "/images/headers/security2.jpg",
  mt_concurrency: "/images/headers/concurrency2.jpg",
  graphics_pipeline: "/images/headers/graphics_pipeline.jpg",
  unreal: "/images/headers/unrealengine.jpg",
  digitalTwin: "/images/headers/digitalTwin2.png",
  gameMath: "/images/headers/gameMath.jpg",
  gitDiff_visualizer: "/images/headers/git45.png",

  // ===== fallback =====
  default: "/images/headers/default.jpg",
};

export function getHeaderImage(post: Post): string {
  // 1️ post 직접 지정
  if (post.header_image) return post.header_image;

  // 2️ category 기반
  if (post.category && categoryHeaderMap[post.category]) {
    return categoryHeaderMap[post.category];
  }

  // 3️ fallback
  return categoryHeaderMap.default;
}
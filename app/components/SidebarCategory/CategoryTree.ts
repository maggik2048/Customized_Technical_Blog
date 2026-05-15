import { Item } from "../types";

export const CATEGORY_TREE: Omit<Item, "href" | "count">[] = [
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
  // 나머지 상위 카테고리도 같은 구조로 추가
];
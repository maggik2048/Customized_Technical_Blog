import { Item } from "./types";

export const CATEGORY_TREE: Omit<Item, "href" | "count">[] = [
  {
    name: "University Physics Revisited (대학 물리)",
    slug: "physics_revisited",
    children: [
      { name: "la langue française(French Language)", slug: "french" },
      { name: "Fluid Mechanics(유체역학)_Munson", slug: "fluid_mechanics" },
      { name: "Thermodynamics(열역학)_Cangel", slug: "thermodynamics" },
    ],
  },
  {
    name: "University Mathematics Revisited",
    slug: "math_revisited",
    children: [
      { name: "Linear Algebra(선형대수학)", slug: "linear_algebra" },
      { name: "Differential equations(미분방정식)", slug: "diff_eq" },
      { name: "Complex Analysis(복소해석학)", slug: "complex_analysis" },
      { name: "Probability&Statistics(확률론)", slug: "prob_stats" },
      { name: "Computational Geometry (계산기하학)", slug: "comp_geometry" },
      { name: "Numerical Analysis (수치해석)", slug: "numerical_analysis" },
      { name: "Optimization(최적화)", slug: "optimization" },
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
      { name: "Discrete Mathematics(이산수학)", slug: "discrete" },
      { name: "Digital Electronics(디지털회로 이론)", slug: "digitalelec" },
      { name: "Operating Systems(운영체제)", slug: "os" },
      { name: "Systems Programming(컴퓨터구조)", slug: "systems" },
      { name: "DataStructure & Algorithm", slug: "dsa" },
      { name: "C++", slug: "cpp" },
      { name: "ObjectOrientedProgramming(OOP) & Design Pattern", slug: "oop" },
      { name: "Software Engineering(소프트웨어공학)", slug: "se" },
      { name: "Security(정보보안)", slug: "security" },
      { name: "Multithreading & Concurrency(동시성)", slug: "mt_concurrency" },
      { name: "Graphics Pipeline & HLSL", slug: "graphics_pipeline" },
      { name: "UnrealEngine Client programming", slug: "unreal" },
      { name: "Digital Twin & Unreal Engine Project", slug: "digitalTwin" },
      { name: "Mathematics for Games(게임수학)", slug: "gameMath" },
    ],
  },
  // 나머지 상위 카테고리도 같은 구조로 추가
];
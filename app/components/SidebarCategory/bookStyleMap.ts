// bookStyleMap.ts

export type BookStyle = {
  font: "serif400" | "serif500" | "serif600" | "serif700";
  color: string;
  image?: string;
  mark: string;
  authorOverride?: string;
};

/**
 * slug 기준으로 모든 책 스타일 관리
 * (여기만 수정하면 UI 전부 바뀜)
 */
export const BOOK_STYLE_MAP: Record<string, BookStyle> = {
  // Physics
  physics_revisited: {
    font: "serif700",
    color: "#1A1A1A",
    image: "/covers/physics.jpg",
    mark: "✦",
  },

  french: {
    font: "serif500",
    color: "#20242B",
    image: "/covers/french.jpg",
    mark: "✧",
  },

  fluid_mechanics: {
    font: "serif600",
    color: "#1D2621",
    image: "/covers/fluid.jpg",
    mark: "❖",
  },

  thermodynamics: {
    font: "serif700",
    color: "#2A1F1F",
    image: "/covers/thermo.jpg",
    mark: "✺",
  },

  // Math
  math_revisited: {
    font: "serif700",
    color: "#111111",
    image: "/covers/math.jpg",
    mark: "✹",
  },

  linear_algebra: {
    font: "serif600",
    color: "#191919",
    image: "/covers/linear.jpg",
    mark: "✢",
  },

  diff_eq: {
    font: "serif500",
    color: "#1E1A1A",
    image: "/covers/diff.jpg",
    mark: "✧",
  },

  complex_analysis: {
    font: "serif600",
    color: "#262626",
    image: "/covers/complex.jpg",
    mark: "✦",
  },

  prob_stats: {
    font: "serif500",
    color: "#2A2420",
    image: "/covers/prob.jpg",
    mark: "✹",
  },

  comp_geometry: {
    font: "serif600",
    color: "#1D2621",
    image: "/covers/geometry.jpg",
    mark: "❖",
  },

  numerical_analysis: {
    font: "serif500",
    color: "#20242B",
    image: "/covers/numerical.jpg",
    mark: "✺",
  },

  optimization: {
    font: "serif700",
    color: "#1A1A1A",
    image: "/covers/opt.jpg",
    mark: "✦",
  },

  // CS
  cs_revisited: {
    font: "serif700",
    color: "#111111",
    image: "/covers/cs.jpg",
    mark: "✹",
  },

  network: {
    font: "serif500",
    color: "#191919",
    image: "/covers/network.jpg",
    mark: "✧",
  },

  ai: {
    font: "serif600",
    color: "#1E1A1A",
    image: "/covers/ai.jpg",
    mark: "✦",
  },

  sqldb: {
    font: "serif500",
    color: "#2A1F1F",
    image: "/covers/sql.jpg",
    mark: "❖",
  },

  compiler: {
    font: "serif600",
    color: "#262626",
    image: "/covers/compiler.jpg",
    mark: "✺",
  },

  embed: {
    font: "serif400",
    color: "#1D2621",
    image: "/covers/embed.jpg",
    mark: "✢",
  },

  discrete: {
    font: "serif500",
    color: "#20242B",
    image: "/covers/discrete.jpg",
    mark: "✧",
  },

  digitalelec: {
    font: "serif600",
    color: "#1A1A1A",
    image: "/covers/digital.jpg",
    mark: "✹",
  },

  os: {
    font: "serif700",
    color: "#191919",
    image: "/covers/os.jpg",
    mark: "✦",
  },

  systems: {
    font: "serif500",
    color: "#1E1A1A",
    image: "/covers/systems.jpg",
    mark: "❖",
  },

  dsa: {
    font: "serif600",
    color: "#262626",
    image: "/covers/dsa.jpg",
    mark: "✺",
  },

  cpp: {
    font: "serif500",
    color: "#2A2420",
    image: "/covers/cpp.jpg",
    mark: "✢",
  },

  oop: {
    font: "serif600",
    color: "#1D2621",
    image: "/covers/oop.jpg",
    mark: "✦",
  },

  se: {
    font: "serif700",
    color: "#111111",
    image: "/covers/se.jpg",
    mark: "✹",
  },

  security: {
    font: "serif500",
    color: "#20242B",
    image: "/covers/security.jpg",
    mark: "✧",
  },

  mt_concurrency: {
    font: "serif600",
    color: "#1E1A1A",
    image: "/covers/concurrency.jpg",
    mark: "❖",
  },

  graphics_pipeline: {
    font: "serif700",
    color: "#2A1F1F",
    image: "/covers/graphics.jpg",
    mark: "✺",
  },

  unreal: {
    font: "serif600",
    color: "#1D2621",
    image: "/covers/unreal.jpg",
    mark: "✢",
  },

  digitalTwin: {
    font: "serif500",
    color: "#262626",
    image: "/covers/twin.jpg",
    mark: "✦",
  },

  gameMath: {
    font: "serif700",
    color: "#111111",
    image: "/covers/game.jpg",
    mark: "✹",
  },
};
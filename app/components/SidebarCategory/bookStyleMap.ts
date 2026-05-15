// bookStyleMap.ts

export type BookStyle = {
  /**
   * Google Font family name
   * CSS variable / Tailwind 연동 기준
   */
  font:
    | "cinzel"
    | "cormorant"
    | "playfair"
    | "baskervville"
    | "ebgaramond"
    | "dmserif"
    | "alegreya"
    | "marcellus"
    | "prata"
    | "librebaskerville"
    | "unbounded"
    | "orbitron";

  color: string;
  image?: string;
  mark: string;
  authorOverride?: string;
};

/**
 * slug 기준 스타일 매핑
 * cover 이미지 분위기 + 과목 성격 기준으로
 * serif / art-deco / classical / technical 조합
 */
export const BOOK_STYLE_MAP: Record<string, BookStyle> = {
  // =========================
  // Physics
  // =========================

  physics_revisited: {
    font: "cinzel",
    color: "#1A1A1A",
    image: "/covers/physics.jpg",
    mark: "✦",
  },

  french: {
    font: "cormorant",
    color: "#20242B",
    image: "/covers/french.jpg",
    mark: "✧",
  },

  fluid_mechanics: {
    font: "marcellus",
    color: "#1D2621",
    image: "/covers/fluid.jpg",
    mark: "❖",
  },

  thermodynamics: {
    font: "prata",
    color: "#2A1F1F",
    image: "/covers/thermo.jpg",
    mark: "✺",
  },

  // =========================
  // Math
  // =========================

  math_revisited: {
    font: "cinzel",
    color: "#111111",
    image: "/covers/math.jpg",
    mark: "✹",
  },

  linear_algebra: {
    font: "ebgaramond",
    color: "#191919",
    image: "/covers/linear.jpg",
    mark: "✢",
  },

  diff_eq: {
    font: "alegreya",
    color: "#1E1A1A",
    image: "/covers/diff.jpg",
    mark: "✧",
  },

  complex_analysis: {
    font: "cormorant",
    color: "#262626",
    image: "/covers/complex.jpg",
    mark: "✦",
  },

  prob_stats: {
    font: "baskervville",
    color: "#2A2420",
    image: "/covers/prob.jpg",
    mark: "✹",
  },

  comp_geometry: {
    font: "marcellus",
    color: "#1D2621",
    image: "/covers/geometry.jpg",
    mark: "❖",
  },

  numerical_analysis: {
    font: "librebaskerville",
    color: "#20242B",
    image: "/covers/numerical.jpg",
    mark: "✺",
  },

  optimization: {
    font: "prata",
    color: "#1A1A1A",
    image: "/covers/opt.jpg",
    mark: "✦",
  },

  // =========================
  // CS
  // =========================

  cs_revisited: {
    font: "cinzel",
    color: "#111111",
    image: "/covers/cs.jpg",
    mark: "✹",
  },

  network: {
    font: "librebaskerville",
    color: "#191919",
    image: "/covers/network.jpg",
    mark: "✧",
  },

  ai: {
    font: "orbitron",
    color: "#1E1A1A",
    image: "/covers/ai.jpg",
    mark: "✦",
  },

  sqldb: {
    font: "baskervville",
    color: "#2A1F1F",
    image: "/covers/sql.jpg",
    mark: "❖",
  },

  compiler: {
    font: "ebgaramond",
    color: "#262626",
    image: "/covers/compiler.jpg",
    mark: "✺",
  },

  embed: {
    font: "marcellus",
    color: "#1D2621",
    image: "/covers/embed.jpg",
    mark: "✢",
  },

  discrete: {
    font: "alegreya",
    color: "#20242B",
    image: "/covers/discrete.jpg",
    mark: "✧",
  },

  digitalelec: {
    font: "unbounded",
    color: "#1A1A1A",
    image: "/covers/digital.jpg",
    mark: "✹",
  },

  os: {
    font: "prata",
    color: "#191919",
    image: "/covers/os.jpg",
    mark: "✦",
  },

  systems: {
    font: "librebaskerville",
    color: "#1E1A1A",
    image: "/covers/systems.jpg",
    mark: "❖",
  },

  dsa: {
    font: "ebgaramond",
    color: "#262626",
    image: "/covers/dsa.jpg",
    mark: "✺",
  },

  cpp: {
    font: "baskervville",
    color: "#2A2420",
    image: "/covers/cpp.jpg",
    mark: "✢",
  },

  oop: {
    font: "marcellus",
    color: "#1D2621",
    image: "/covers/oop.jpg",
    mark: "✦",
  },

  se: {
    font: "cinzel",
    color: "#111111",
    image: "/covers/se.jpg",
    mark: "✹",
  },

  security: {
    font: "alegreya",
    color: "#20242B",
    image: "/covers/security.jpg",
    mark: "✧",
  },

  mt_concurrency: {
    font: "dmserif",
    color: "#1E1A1A",
    image: "/covers/concurrency.jpg",
    mark: "❖",
  },

  graphics_pipeline: {
    font: "playfair",
    color: "#2A1F1F",
    image: "/covers/graphics.jpg",
    mark: "✺",
  },

  unreal: {
    font: "cinzel",
    color: "#1D2621",
    image: "/covers/unreal.jpg",
    mark: "✢",
  },

  digitalTwin: {
    font: "orbitron",
    color: "#262626",
    image: "/covers/twin.jpg",
    mark: "✦",
  },

  gameMath: {
    font: "playfair",
    color: "#111111",
    image: "/covers/game.jpg",
    mark: "✹",
  },
};
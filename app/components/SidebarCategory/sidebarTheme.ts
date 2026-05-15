// sidebarTheme.ts

export type SidebarBookTheme = {
  color: string;
  mark: string;

  /**
   * px
   */
  height: number;
  width: number;

  /**
   * font-weight
   */
  fontWeight: "400" | "500" | "600" | "700";

  /**
   * optional google font key
   */
  font?: 
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

  image?: string;

  /**
   * optional author override
   */
  authorOverride?: string;
};

/**
 * slug 기준 sidebar book theme 관리
 * (여기만 수정하면 전체 sidebar UI 변경)
 */
export const SIDEBAR_BOOK_THEME_MAP: Record<string, SidebarBookTheme> = {
  // =========================
  // Physics
  // =========================

  physics_revisited: {
    font: "cinzel",
    fontWeight: "700",
    color: "#111111",
    image: "/covers/physics.jpg",
    mark: "✦",
    height: 92,
    width: 320,
    authorOverride: "Thomas Kuhn",
  },

  french: {
    font: "cormorant",
    fontWeight: "500",
    color: "#20242B",
    image: "/covers/french.jpg",
    mark: "✧",
    height: 84,
    width: 290,
    authorOverride: "Roland Barthes",
  },

  fluid_mechanics: {
    font: "marcellus",
    fontWeight: "600",
    color: "#1D2621",
    image: "/covers/fluid.jpg",
    mark: "❖",
    height: 78,
    width: 260,
    authorOverride: "Marshall McLuhan",
  },

  thermodynamics: {
    font: "prata",
    fontWeight: "700",
    color: "#2A1F1F",
    image: "/covers/thermo.jpg",
    mark: "✺",
    height: 92,
    width: 320,
    authorOverride: "Thomas Kuhn",
  },

  // =========================
  // Math
  // =========================

  math_revisited: {
    font: "cinzel",
    fontWeight: "700",
    color: "#111111",
    image: "/covers/math.jpg",
    mark: "✹",
    height: 92,
    width: 320,
    authorOverride: "Walter Benjamin",
  },

  linear_algebra: {
    font: "ebgaramond",
    fontWeight: "600",
    color: "#191919",
    image: "/covers/linear.jpg",
    mark: "✢",
    height: 84,
    width: 290,
    authorOverride: "Jacques Derrida",
  },

  diff_eq: {
    font: "alegreya",
    fontWeight: "500",
    color: "#1E1A1A",
    image: "/covers/diff.jpg",
    mark: "✧",
    height: 78,
    width: 260,
    authorOverride: "John Rawls",
  },

  complex_analysis: {
    font: "cormorant",
    fontWeight: "600",
    color: "#262626",
    image: "/covers/complex.jpg",
    mark: "✦",
    height: 84,
    width: 290,
    authorOverride: "Umberto Eco",
  },

  prob_stats: {
    font: "baskervville",
    fontWeight: "500",
    color: "#2A2420",
    image: "/covers/prob.jpg",
    mark: "✹",
    height: 78,
    width: 260,
    authorOverride: "Susan Sontag",
  },

  comp_geometry: {
    font: "marcellus",
    fontWeight: "600",
    color: "#1D2621",
    image: "/covers/geometry.jpg",
    mark: "❖",
    height: 84,
    width: 290,
    authorOverride: "Joseph Campbell",
  },

  numerical_analysis: {
    font: "librebaskerville",
    fontWeight: "500",
    color: "#20242B",
    image: "/covers/numerical.jpg",
    mark: "✺",
    height: 78,
    width: 260,
    authorOverride: "Edward Said",
  },

  optimization: {
    font: "prata",
    fontWeight: "700",
    color: "#111111",
    image: "/covers/opt.jpg",
    mark: "✦",
    height: 92,
    width: 320,
    authorOverride: "Michel Foucault",
  },

  // =========================
  // CS
  // =========================

  cs_revisited: {
    font: "cinzel",
    fontWeight: "700",
    color: "#111111",
    image: "/covers/cs.jpg",
    mark: "✹",
    height: 92,
    width: 320,
    authorOverride: "Noam Chomsky",
  },

  network: {
    font: "librebaskerville",
    fontWeight: "500",
    color: "#191919",
    image: "/covers/network.jpg",
    mark: "✧",
    height: 78,
    width: 260,
    authorOverride: "Donna Haraway",
  },

  ai: {
    font: "orbitron",
    fontWeight: "600",
    color: "#1E1A1A",
    image: "/covers/ai.jpg",
    mark: "✦",
    height: 84,
    width: 290,
    authorOverride: "Slavoj Žižek",
  },

  sqldb: {
    font: "baskervville",
    fontWeight: "500",
    color: "#2A1F1F",
    image: "/covers/sql.jpg",
    mark: "❖",
    height: 78,
    width: 260,
    authorOverride: "Michel Foucault",
  },

  compiler: {
    font: "ebgaramond",
    fontWeight: "600",
    color: "#262626",
    image: "/covers/compiler.jpg",
    mark: "✺",
    height: 84,
    width: 290,
    authorOverride: "Roland Barthes",
  },

  embed: {
    font: "marcellus",
    fontWeight: "400",
    color: "#1D2621",
    image: "/covers/embed.jpg",
    mark: "✢",
    height: 72,
    width: 230,
    authorOverride: "Marshall McLuhan",
  },

  discrete: {
    font: "alegreya",
    fontWeight: "500",
    color: "#20242B",
    image: "/covers/discrete.jpg",
    mark: "✧",
    height: 78,
    width: 260,
    authorOverride: "Judith Butler",
  },

  digitalelec: {
    font: "unbounded",
    fontWeight: "600",
    color: "#111111",
    image: "/covers/digital.jpg",
    mark: "✹",
    height: 84,
    width: 290,
    authorOverride: "Thomas Kuhn",
  },

  os: {
    font: "prata",
    fontWeight: "700",
    color: "#191919",
    image: "/covers/os.jpg",
    mark: "✦",
    height: 92,
    width: 320,
    authorOverride: "Carl Jung",
  },

  systems: {
    font: "librebaskerville",
    fontWeight: "500",
    color: "#1E1A1A",
    image: "/covers/systems.jpg",
    mark: "❖",
    height: 78,
    width: 260,
    authorOverride: "Walter Benjamin",
  },

  dsa: {
    font: "ebgaramond",
    fontWeight: "600",
    color: "#262626",
    image: "/covers/dsa.jpg",
    mark: "✺",
    height: 84,
    width: 290,
    authorOverride: "Virginia Woolf",
  },

  cpp: {
    font: "baskervville",
    fontWeight: "500",
    color: "#2A2420",
    image: "/covers/cpp.jpg",
    mark: "✢",
    height: 78,
    width: 260,
    authorOverride: "John Rawls",
  },

  oop: {
    font: "marcellus",
    fontWeight: "600",
    color: "#1D2621",
    image: "/covers/oop.jpg",
    mark: "✦",
    height: 84,
    width: 290,
    authorOverride: "Joseph Campbell",
  },

  se: {
    font: "cinzel",
    fontWeight: "700",
    color: "#111111",
    image: "/covers/se.jpg",
    mark: "✹",
    height: 92,
    width: 320,
    authorOverride: "Edward Said",
  },

  security: {
    font: "alegreya",
    fontWeight: "500",
    color: "#20242B",
    image: "/covers/security.jpg",
    mark: "✧",
    height: 78,
    width: 260,
    authorOverride: "Susan Sontag",
  },

  mt_concurrency: {
    font: "dmserif",
    fontWeight: "600",
    color: "#1E1A1A",
    image: "/covers/concurrency.jpg",
    mark: "❖",
    height: 84,
    width: 290,
    authorOverride: "Donna Haraway",
  },

  graphics_pipeline: {
    font: "playfair",
    fontWeight: "700",
    color: "#2A1F1F",
    image: "/covers/graphics.jpg",
    mark: "✺",
    height: 92,
    width: 320,
    authorOverride: "Umberto Eco",
  },

  unreal: {
    font: "cinzel",
    fontWeight: "600",
    color: "#1D2621",
    image: "/covers/unreal.jpg",
    mark: "✢",
    height: 84,
    width: 290,
    authorOverride: "Slavoj Žižek",
  },

  digitalTwin: {
    font: "orbitron",
    fontWeight: "500",
    color: "#262626",
    image: "/covers/twin.jpg",
    mark: "✦",
    height: 78,
    width: 260,
    authorOverride: "Noam Chomsky",
  },

  gameMath: {
    font: "playfair",
    fontWeight: "700",
    color: "#111111",
    image: "/covers/game.jpg",
    mark: "✹",
    height: 92,
    width: 320,
    authorOverride: "Carl Jung",
  },
};
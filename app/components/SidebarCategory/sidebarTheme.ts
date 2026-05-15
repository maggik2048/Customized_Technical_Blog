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
   * 이미지 전용 모드
   */
  onlyShowImage?: boolean;

  /**
   * image opacity
   */
  imageOpacity?: number;

  /**
   * vignette opacity
   */
  vignetteOpacity?: number;

  /**
   * optional author override
   */
  authorOverride?: string;
};

/**
 * slug 기준 sidebar book theme 관리
 * (여기만 수정하면 전체 sidebar UI 변경)
 */
export const SIDEBAR_BOOK_THEME_MAP: Record<
  string,
  SidebarBookTheme
> = {
  // =========================
  // Physics
  // =========================

  physics_revisited: {
    font: "cinzel",
    fontWeight: "700",
    color: "#111111",
    image: "/images/covers/physics.jpg",

    imageOpacity: 0.58,
    vignetteOpacity: 0.08,

    mark: "✦",
    height: 92,
    width: 320,
    authorOverride: "Thomas Kuhn",
  },

  french: {
    font: "cormorant",
    fontWeight: "500",
    color: "#20242B",
    image: "/images/covers/french.jpg",

    imageOpacity: 0.62,
    vignetteOpacity: 0.06,

    mark: "✧",
    height: 84,
    width: 290,
    authorOverride: "Roland Barthes",
  },

  fluid_mechanics: {
    font: "marcellus",
    fontWeight: "600",
    color: "#1D2621",

    image: "/images/covers/fluid.png",

    onlyShowImage: true,

    imageOpacity: 0.98,
    vignetteOpacity: 0.015,

    mark: "❖",

    height: 78,
    width: 260,

    authorOverride: "Marshall McLuhan",
  },

  thermodynamics: {
    font: "prata",
    fontWeight: "700",
    color: "#2A1F1F",
    image: "/images/covers/thermo.jpg",

    imageOpacity: 0.58,
    vignetteOpacity: 0.08,

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
    image: "/images/covers/math.jpg",

    imageOpacity: 0.58,
    vignetteOpacity: 0.08,

    mark: "✹",
    height: 92,
    width: 320,
    authorOverride: "Walter Benjamin",
  },

  linear_algebra: {
    font: "ebgaramond",
    fontWeight: "600",
    color: "#191919",
    image: "/images/covers/linear.jpg",

    imageOpacity: 0.6,
    vignetteOpacity: 0.08,

    mark: "✢",
    height: 84,
    width: 290,
    authorOverride: "Jacques Derrida",
  },

  diff_eq: {
    font: "alegreya",
    fontWeight: "500",
    color: "#1E1A1A",
    image: "/images/covers/diff.jpg",

    imageOpacity: 0.6,
    vignetteOpacity: 0.08,

    mark: "✧",
    height: 78,
    width: 260,
    authorOverride: "John Rawls",
  },

  complex_analysis: {
    font: "cormorant",
    fontWeight: "600",
    color: "#262626",
    image: "/images/covers/complex.jpg",

    imageOpacity: 0.62,
    vignetteOpacity: 0.08,

    mark: "✦",
    height: 84,
    width: 290,
    authorOverride: "Umberto Eco",
  },

  prob_stats: {
    font: "baskervville",
    fontWeight: "500",
    color: "#2A2420",
    image: "/images/covers/prob.jpg",

    imageOpacity: 0.58,
    vignetteOpacity: 0.08,

    mark: "✹",
    height: 78,
    width: 260,
    authorOverride: "Susan Sontag",
  },

  comp_geometry: {
    font: "marcellus",
    fontWeight: "600",
    color: "#1D2621",
    image: "/images/covers/geometry.jpg",

    imageOpacity: 0.6,
    vignetteOpacity: 0.08,

    mark: "❖",
    height: 84,
    width: 290,
    authorOverride: "Joseph Campbell",
  },

  numerical_analysis: {
    font: "librebaskerville",
    fontWeight: "500",
    color: "#20242B",
    image: "/images/covers/numerical.jpg",

    imageOpacity: 0.58,
    vignetteOpacity: 0.08,

    mark: "✺",
    height: 78,
    width: 260,
    authorOverride: "Edward Said",
  },

  optimization: {
    font: "prata",
    fontWeight: "700",
    color: "#111111",
    image: "/images/covers/opt.jpg",

    imageOpacity: 0.58,
    vignetteOpacity: 0.08,

    mark: "✦",
    height: 92,
    width: 320,
    authorOverride: "Michel Foucault",
  },
};
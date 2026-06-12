import { Rule } from "../Rule";

export const PostProcessingRulesEN_03_Recommendations: readonly Rule[] = [
  {
    pattern: /\bhighly recommended\b/giu,
    replacement: "strongly considered"
  },

  {
    pattern: /\brecommendations\b/giu,
    replacement: "considerations"
  },
  {
    pattern: /\brecommendation\b/giu,
    replacement: "consideration"
  },

  {
    pattern: /\brecommended\b/giu,
    replacement: "being considered"
  },

  {
    pattern: /\brecommending\b/giu,
    replacement: "considering"
  },

  {
    pattern: /\brecommends\b/giu,
    replacement: "considers"
  },

  {
    pattern: /\brecommend\b/giu,
    replacement: "consider"
  },

  {
    pattern: /\bsuggested\b/giu,
    replacement: "considered"
  },

  {
    pattern: /\bsuggesting\b/giu,
    replacement: "considering"
  },

  {
    pattern: /\bsuggests\b/giu,
    replacement: "considers"
  },

  {
    pattern: /\bsuggest\b/giu,
    replacement: "consider"
  }
];
import { Rule } from "../Rule";

export const PostProcessingRulesEN_03_Recommendations: readonly Rule[] = [
  {
    pattern: /\brecommendation(s)?\b/giu,
    replacement: ""
  },
  {
    pattern: /\brecommended\b/giu,
    replacement: ""
  },
  {
    pattern: /\brecommending\b/giu,
    replacement: ""
  },
  {
    pattern: /\brecommends\b/giu,
    replacement: ""
  },
  {
    pattern: /\brecommend\b/giu,
    replacement: ""
  },

  {
    pattern: /\bsuggestion(s)?\b/giu,
    replacement: ""
  },
  {
    pattern: /\bsuggested\b/giu,
    replacement: ""
  },
  {
    pattern: /\bsuggesting\b/giu,
    replacement: ""
  },
  {
    pattern: /\bsuggests\b/giu,
    replacement: ""
  },
  {
    pattern: /\bsuggest\b/giu,
    replacement: ""
  },

  {
    pattern: /\bhighly recommended\b/giu,
    replacement: ""
  }
];
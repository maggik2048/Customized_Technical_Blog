import { Rule } from "../Rule";

export const PostProcessingRulesFR_01_Sentences: readonly Rule[] = [
  {
    pattern: /\bMon avis est que\b/giu,
    replacement: ""
  },
  {
    pattern: /\bNotre avis est que\b/giu,
    replacement: ""
  },

  {
    pattern: /\bJe pense que\b/giu,
    replacement: ""
  },
  {
    pattern: /\bNous pensons que\b/giu,
    replacement: ""
  },

  {
    pattern: /\bJe crois que\b/giu,
    replacement: ""
  },
  {
    pattern: /\bNous croyons que\b/giu,
    replacement: ""
  },

  {
    pattern: /\bJe dirais que\b/giu,
    replacement: ""
  },

  {
    pattern: /\bIl est possible que\b/giu,
    replacement: ""
  },

  {
    pattern: /\bÀ mon avis\b/giu,
    replacement: ""
  }
];
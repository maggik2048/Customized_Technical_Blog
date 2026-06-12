import { Rule } from "../Rule";

export const PostProcessingRulesFR_03_Recommendations: readonly Rule[] = [
  {
    pattern: /\brecommandation(s)?\b/giu,
    replacement: ""
  },
  {
    pattern: /\brecommandé\b/giu,
    replacement: ""
  },
  {
    pattern: /\brecommandée\b/giu,
    replacement: ""
  },
  {
    pattern: /\brecommandés\b/giu,
    replacement: ""
  },
  {
    pattern: /\brecommandées\b/giu,
    replacement: ""
  },

  {
    pattern: /\brecommande\b/giu,
    replacement: ""
  },
  {
    pattern: /\brecommandent\b/giu,
    replacement: ""
  },

  {
    pattern: /\bsuggestion(s)?\b/giu,
    replacement: ""
  },
  {
    pattern: /\bsuggère\b/giu,
    replacement: ""
  },
  {
    pattern: /\bsuggèrent\b/giu,
    replacement: ""
  },

  {
    pattern: /\bfortement recommandé\b/giu,
    replacement: ""
  }
];
import { Rule } from "../Rule";

export const PostProcessingRulesFR_03_Recommendations: readonly Rule[] = [
  {
    pattern: /\bfortement recommandé\b/giu,
    replacement: "fortement envisagé"
  },
  {
    pattern: /\bfortement recommandée\b/giu,
    replacement: "fortement envisagée"
  },

  {
    pattern: /\brecommandations\b/giu,
    replacement: "considérations"
  },
  {
    pattern: /\brecommandation\b/giu,
    replacement: "considération"
  },

  {
    pattern: /\brecommandé\b/giu,
    replacement: "envisagé"
  },
  {
    pattern: /\brecommandée\b/giu,
    replacement: "envisagée"
  },
  {
    pattern: /\brecommandés\b/giu,
    replacement: "envisagés"
  },
  {
    pattern: /\brecommandées\b/giu,
    replacement: "envisagées"
  },

  {
    pattern: /\brecommande\b/giu,
    replacement: "envisage"
  },
  {
    pattern: /\brecommandent\b/giu,
    replacement: "envisagent"
  },

  {
    pattern: /\bsuggère\b/giu,
    replacement: "envisage"
  },
  {
    pattern: /\bsuggèrent\b/giu,
    replacement: "envisagent"
  }
];
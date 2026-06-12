import { Rule } from "../Rule";

export const PostProcessingRulesFR_01_Sentences: readonly Rule[] = [
  {
    pattern: /\bMon avis est que\b/giu,
    replacement: "Observation :"
  },
  {
    pattern: /\bNotre avis est que\b/giu,
    replacement: "Observation :"
  },

  {
    pattern: /\bJe pense que\b/giu,
    replacement: "Observation :"
  },
  {
    pattern: /\bNous pensons que\b/giu,
    replacement: "Observation :"
  },

  {
    pattern: /\bJe crois que\b/giu,
    replacement: "Observation :"
  },
  {
    pattern: /\bNous croyons que\b/giu,
    replacement: "Observation :"
  },

  {
    pattern: /\bMa recommandation est de\b/giu,
    replacement: "Une considération est de"
  },
  {
    pattern: /\bNotre recommandation est de\b/giu,
    replacement: "Une considération est de"
  },

  {
    pattern: /\bJe recommande\b/giu,
    replacement: "Envisageant"
  },
  {
    pattern: /\bNous recommandons\b/giu,
    replacement: "Envisageant"
  },

  {
    pattern: /\bJe suggère\b/giu,
    replacement: "Envisageant"
  },
  {
    pattern: /\bNous suggérons\b/giu,
    replacement: "Envisageant"
  }
];
import { Rule } from "../Rule";

export const PostProcessingRulesFR_02_Phrases: readonly Rule[] = [
  {
    pattern: /\bton code\b/giu,
    replacement: "ce code"
  },
  {
    pattern: /\bton projet\b/giu,
    replacement: "ce projet"
  },
  {
    pattern: /\bton système\b/giu,
    replacement: "ce système"
  },
  {
    pattern: /\bton systeme\b/giu,
    replacement: "ce système"
  },

  {
    pattern: /\bta solution\b/giu,
    replacement: "cette solution"
  },
  {
    pattern: /\bta conception\b/giu,
    replacement: "cette conception"
  },
  {
    pattern: /\bta logique\b/giu,
    replacement: "cette logique"
  },
  {
    pattern: /\bta stratégie\b/giu,
    replacement: "cette stratégie"
  },
  {
    pattern: /\bta strategie\b/giu,
    replacement: "cette stratégie"
  },

  {
    pattern: /\btes idées\b/giu,
    replacement: "ces idées"
  },
  {
    pattern: /\btes idees\b/giu,
    replacement: "ces idées"
  },
  {
    pattern: /\btes configurations\b/giu,
    replacement: "ces configurations"
  },
  {
    pattern: /\btes paramètres\b/giu,
    replacement: "ces paramètres"
  },
  {
    pattern: /\btes parametres\b/giu,
    replacement: "ces paramètres"
  },

  {
    pattern: /\bton architecture\b/giu,
    replacement: "cette architecture"
  },
  {
    pattern: /\bton implémentation\b/giu,
    replacement: "cette implémentation"
  },
  {
    pattern: /\bton implementation\b/giu,
    replacement: "cette implémentation"
  },

  {
    pattern: /\bton algorithme\b/giu,
    replacement: "cet algorithme"
  },
  {
    pattern: /\bton modèle\b/giu,
    replacement: "ce modèle"
  },
  {
    pattern: /\bton modele\b/giu,
    replacement: "ce modèle"
  }
];
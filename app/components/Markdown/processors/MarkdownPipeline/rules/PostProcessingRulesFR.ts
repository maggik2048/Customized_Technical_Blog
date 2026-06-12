import { Rule } from "./Rule";

export const PostProcessingRulesFR: readonly Rule[] = [
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
  },

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
    pattern: /\bta solution\b/giu,
    replacement: "cette solution"
  },
  {
    pattern: /\bta conception\b/giu,
    replacement: "cette conception"
  },

  {
    pattern: /\brecommandation\b/giu,
    replacement: "considération"
  },
  {
    pattern: /\brecommandations\b/giu,
    replacement: "considérations"
  },
  {
    pattern: /\brecommandé\b/giu,
    replacement: "envisagé"
  },
  {
    pattern: /\brecommande\b/giu,
    replacement: "envisage"
  },

  {
    pattern: /\btu peux\b/giu,
    replacement: "il est possible de"
  },
  {
    pattern: /\btu dois\b/giu,
    replacement: "il est nécessaire de"
  },
  {
    pattern: /\btu devrais\b/giu,
    replacement: "il serait préférable de"
  },

  {
    pattern: /\bton\b/giu,
    replacement: "ce"
  },
  {
    pattern: /\bta\b/giu,
    replacement: "cette"
  },
  {
    pattern: /\btes\b/giu,
    replacement: "ces"
  },

  {
    pattern: /\bje\b/giu,
    replacement: ""
  },
  {
    pattern: /\bnous\b/giu,
    replacement: ""
  },
  {
    pattern: /\btu\b/giu,
    replacement: ""
  },
  {
    pattern: /\btoi\b/giu,
    replacement: ""
  }
];
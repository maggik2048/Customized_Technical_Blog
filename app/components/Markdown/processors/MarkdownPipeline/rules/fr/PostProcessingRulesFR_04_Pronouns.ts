import { Rule } from "../Rule";

export const PostProcessingRulesFR_04_Pronouns: readonly Rule[] = [
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
    pattern: /\bmon\b/giu,
    replacement: "ce"
  },
  {
    pattern: /\bma\b/giu,
    replacement: "cette"
  },
  {
    pattern: /\bmes\b/giu,
    replacement: "ces"
  },

  {
    pattern: /\bnotre\b/giu,
    replacement: "ce"
  },
  {
    pattern: /\bnos\b/giu,
    replacement: "ces"
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
    pattern: /\bje suis\b/giu,
    replacement: ""
  },
  {
    pattern: /\bnous sommes\b/giu,
    replacement: ""
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
  },

  {
    pattern: /\bmoi\b/giu,
    replacement: ""
  }
];
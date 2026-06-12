import { Rule } from "../Rule";

export const PostProcessingRulesFR_04_Pronouns: readonly Rule[] = [
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
    pattern: /\bmon\b/giu,
    replacement: ""
  },
  {
    pattern: /\bma\b/giu,
    replacement: ""
  },
  {
    pattern: /\bmes\b/giu,
    replacement: ""
  },

  {
    pattern: /\bnotre\b/giu,
    replacement: ""
  },
  {
    pattern: /\bnos\b/giu,
    replacement: ""
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
    pattern: /\bje pense\b/giu,
    replacement: ""
  },
  {
    pattern: /\bnous pensons\b/giu,
    replacement: ""
  },

  {
    pattern: /\bje crois\b/giu,
    replacement: ""
  },
  {
    pattern: /\bnous croyons\b/giu,
    replacement: ""
  }
];
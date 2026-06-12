import { Rule } from "../Rule";

export const PostProcessingRulesEN_04_Pronouns: readonly Rule[] = [
  {
    pattern: /\byou should\b/giu,
    replacement: "it may be beneficial to"
  },
  {
    pattern: /\byou can\b/giu,
    replacement: "it is possible to"
  },
  {
    pattern: /\byou need to\b/giu,
    replacement: "it is necessary to"
  },
  {
    pattern: /\byou must\b/giu,
    replacement: "it is required to"
  },

  {
    pattern: /\bmy\b/giu,
    replacement: "the"
  },
  {
    pattern: /\bour\b/giu,
    replacement: "the"
  },

  {
    pattern: /\bmine\b/giu,
    replacement: ""
  },
  {
    pattern: /\bours\b/giu,
    replacement: ""
  },

  {
    pattern: /\byour\b/giu,
    replacement: "this"
  },

  {
    pattern: /\bI am\b/giu,
    replacement: ""
  },
  {
    pattern: /\bI'm\b/giu,
    replacement: ""
  },
  {
    pattern: /\bwe are\b/giu,
    replacement: ""
  },

  {
    pattern: /\bI\b/giu,
    replacement: ""
  },
  {
    pattern: /\bwe\b/giu,
    replacement: ""
  },

  {
    pattern: /\byou\b/giu,
    replacement: ""
  }
];
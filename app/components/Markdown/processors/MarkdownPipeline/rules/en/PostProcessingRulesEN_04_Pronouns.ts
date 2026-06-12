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
    pattern: /\byour\b/giu,
    replacement: "this"
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
  },

  {
    pattern: /\bmy\b/giu,
    replacement: ""
  },
  {
    pattern: /\bour\b/giu,
    replacement: ""
  },

  {
    pattern: /\bmine\b/giu,
    replacement: ""
  },
  {
    pattern: /\bours\b/giu,
    replacement: ""
  }
];
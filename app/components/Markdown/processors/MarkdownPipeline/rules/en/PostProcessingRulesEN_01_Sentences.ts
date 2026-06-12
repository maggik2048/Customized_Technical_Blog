import { Rule } from "../Rule";

export const PostProcessingRulesEN_01_Sentences: readonly Rule[] = [
  {
    pattern: /\bI think that\b/giu,
    replacement: ""
  },
  {
    pattern: /\bI think\b/giu,
    replacement: ""
  },
  {
    pattern: /\bWe think that\b/giu,
    replacement: ""
  },
  {
    pattern: /\bWe think\b/giu,
    replacement: ""
  },

  {
    pattern: /\bI believe that\b/giu,
    replacement: ""
  },
  {
    pattern: /\bI believe\b/giu,
    replacement: ""
  },
  {
    pattern: /\bWe believe that\b/giu,
    replacement: ""
  },
  {
    pattern: /\bWe believe\b/giu,
    replacement: ""
  },

  {
    pattern: /\bIn my opinion\b/giu,
    replacement: ""
  },
  {
    pattern: /\bFrom my perspective\b/giu,
    replacement: ""
  },

  {
    pattern: /\bI would say that\b/giu,
    replacement: ""
  },

  {
    pattern: /\bIt is my view that\b/giu,
    replacement: ""
  }
];
import { Rule } from "../Rule";

export const PostProcessingRulesEN_01_Sentences: readonly Rule[] = [
  {
    pattern: /\bMy recommendation is to\b/giu,
    replacement: "A consideration is to"
  },
  {
    pattern: /\bOur recommendation is to\b/giu,
    replacement: "A consideration is to"
  },

  {
    pattern: /\bIn my opinion\b/giu,
    replacement: "Observation:"
  },
  {
    pattern: /\bFrom my perspective\b/giu,
    replacement: "Observation:"
  },

  {
    pattern: /\bI think that\b/giu,
    replacement: "Observation:"
  },
  {
    pattern: /\bI think\b/giu,
    replacement: "Observation:"
  },

  {
    pattern: /\bWe think that\b/giu,
    replacement: "Observation:"
  },
  {
    pattern: /\bWe think\b/giu,
    replacement: "Observation:"
  },

  {
    pattern: /\bI believe that\b/giu,
    replacement: "Observation:"
  },
  {
    pattern: /\bI believe\b/giu,
    replacement: "Observation:"
  },

  {
    pattern: /\bWe believe that\b/giu,
    replacement: "Observation:"
  },
  {
    pattern: /\bWe believe\b/giu,
    replacement: "Observation:"
  },

  {
    pattern: /\bI would recommend\b/giu,
    replacement: "Considering"
  },
  {
    pattern: /\bWe would recommend\b/giu,
    replacement: "Considering"
  },

  {
    pattern: /\bI recommend\b/giu,
    replacement: "Considering"
  },
  {
    pattern: /\bWe recommend\b/giu,
    replacement: "Considering"
  },

  {
    pattern: /\bI suggest\b/giu,
    replacement: "Considering"
  },
  {
    pattern: /\bWe suggest\b/giu,
    replacement: "Considering"
  }
];
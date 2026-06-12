import { Rule } from "../Rule";

export const PostProcessingRulesKR_03_Recommendations: readonly Rule[] = [
  {
    pattern: /강력히 추천/g,
    replacement: "우선적으로 고려"
  },

  {
    pattern: /추천중/g,
    replacement: "고려중"
  },

  {
    pattern: /추천하는/g,
    replacement: "고려중인"
  },

  {
    pattern: /추천됨/g,
    replacement: "고려됨"
  },

  {
    pattern: /추천받음/g,
    replacement: "고려대상임"
  },

  {
    pattern: /추천함/g,
    replacement: "고려함"
  },

  {
    pattern: /추천/g,
    replacement: "고려"
  },

  {
    pattern: /권장/g,
    replacement: "고려"
  },

  {
    pattern: /권장함/g,
    replacement: "고려함"
  },

  {
    pattern: /권장되는/g,
    replacement: "고려되는"
  }
];
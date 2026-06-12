import { Rule } from "../Rule";

export const PostProcessingRulesKR_03_Recommendations: readonly Rule[] = [
  {
    pattern: /강력히 추천/g,
    replacement: ""
  },
  {
    pattern: /추천/g,
    replacement: ""
  },
  {
    pattern: /권장/g,
    replacement: ""
  }
];
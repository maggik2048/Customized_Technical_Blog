import { Rule } from "../Rule";

export const PostProcessingRulesKR_01_Sentences: readonly Rule[] = [
  {
    pattern: /내 생각에는/g,
    replacement: ""
  },
  {
    pattern: /제 생각에는/g,
    replacement: ""
  },
  {
    pattern: /우리 생각에는/g,
    replacement: ""
  },
  {
    pattern: /개인적으로는/g,
    replacement: ""
  },

  {
    pattern: /내 의견으로는/g,
    replacement: ""
  },
  {
    pattern: /제 의견으로는/g,
    replacement: ""
  },
  {
    pattern: /우리 의견으로는/g,
    replacement: ""
  },

  {
    pattern: /내 추천은/g,
    replacement: ""
  },
  {
    pattern: /제 추천은/g,
    replacement: ""
  },
  {
    pattern: /우리의 추천은/g,
    replacement: ""
  }
];
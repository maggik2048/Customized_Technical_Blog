import { Rule } from "../Rule";

export const PostProcessingRulesKR_01_Sentences: readonly Rule[] = [
  {
    pattern: /내 생각에는/g,
    replacement: "관찰:"
  },
  {
    pattern: /제 생각에는/g,
    replacement: "관찰:"
  },
  {
    pattern: /우리 생각에는/g,
    replacement: "관찰:"
  },
  {
    pattern: /개인적으로는/g,
    replacement: "관찰:"
  },

  {
    pattern: /내 추천은/g,
    replacement: "한 가지 고려사항은"
  },
  {
    pattern: /제 추천은/g,
    replacement: "한 가지 고려사항은"
  },
  {
    pattern: /우리의 추천은/g,
    replacement: "한 가지 고려사항은"
  },

  {
    pattern: /나는 추천한다/g,
    replacement: "고려한다"
  },
  {
    pattern: /제가 추천한다/g,
    replacement: "고려한다"
  },
  {
    pattern: /우리는 추천한다/g,
    replacement: "고려한다"
  },

  {
    pattern: /나는 생각한다/g,
    replacement: "검토한다"
  },
  {
    pattern: /제가 생각한다/g,
    replacement: "검토한다"
  },
  {
    pattern: /우리는 생각한다/g,
    replacement: "검토한다"
  },

  {
    pattern: /내 의견으로는/g,
    replacement: "관찰:"
  },
  {
    pattern: /제 의견으로는/g,
    replacement: "관찰:"
  },
  {
    pattern: /우리 의견으로는/g,
    replacement: "관찰:"
  }
];
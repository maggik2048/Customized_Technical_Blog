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

  // 대문자 I 만 제거
  // 문장 시작, 쉼표 뒤, 괄호 안 등 단독 단어 I 는 모두 제거됨
  // 소문자 i 는 절대 매치되지 않음
  {
    pattern: /\bI\b/gu,
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
import { Rule } from "./Rule";

export const PostProcessingRulesKR: readonly Rule[] = [
  {
    pattern: /너의 코드/g,
    replacement: "이 코드"
  },
  {
    pattern: /네 코드/g,
    replacement: "이 코드"
  },
  {
    pattern: /니 코드/g,
    replacement: "이 코드"
  },

  {
    pattern: /너의 프로젝트/g,
    replacement: "이 프로젝트"
  },
  {
    pattern: /네 프로젝트/g,
    replacement: "이 프로젝트"
  },
  {
    pattern: /니 프로젝트/g,
    replacement: "이 프로젝트"
  },

  {
    pattern: /너의 구현/g,
    replacement: "이 구현"
  },
  {
    pattern: /네 구현/g,
    replacement: "이 구현"
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
    pattern: /추천함/g,
    replacement: "고려함"
  },
  {
    pattern: /추천/g,
    replacement: "고려"
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
    pattern: /나는 /g,
    replacement: ""
  },
  {
    pattern: /제가 /g,
    replacement: ""
  },
  {
    pattern: /우리는 /g,
    replacement: ""
  },

  {
    pattern:
      /(^|\s)(?:니가|네가|너의|너는|너에게|너한테|너|네|니)(?=\s|$)/gu,
    replacement: "$1"
  }
];
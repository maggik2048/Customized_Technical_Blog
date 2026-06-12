import { Rule } from "../Rule";

export const PostProcessingRulesKR_04_Pronouns: readonly Rule[] = [
  {
    pattern: /(^|\s)(?:나는)(?=\s|$)/g,
    replacement: "$1"
  },
  {
    pattern: /(^|\s)(?:제가)(?=\s|$)/g,
    replacement: "$1"
  },
  {
    pattern: /(^|\s)(?:저는)(?=\s|$)/g,
    replacement: "$1"
  },
  {
    pattern: /(^|\s)(?:우리는)(?=\s|$)/g,
    replacement: "$1"
  },
  {
    pattern: /(^|\s)(?:우리는)(?=\s|$)/g,
    replacement: "$1"
  },

  {
    pattern:
      /(^|\s)(?:니가|네가|너의|너는|너에게|너한테|너를|너와|너|네|니)(?=\s|$)/gu,
    replacement: "$1"
  },

  {
    pattern: /(^|\s)(?:내가)(?=\s|$)/g,
    replacement: "$1"
  },
  {
    pattern: /(^|\s)(?:내)(?=\s|$)/g,
    replacement: "$1"
  },
  {
    pattern: /(^|\s)(?:저의)(?=\s|$)/g,
    replacement: "$1"
  },
  {
    pattern: /(^|\s)(?:우리의)(?=\s|$)/g,
    replacement: "$1"
  }
];
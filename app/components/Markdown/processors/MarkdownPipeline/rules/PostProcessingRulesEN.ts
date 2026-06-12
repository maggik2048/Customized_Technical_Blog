import { Rule } from "./Rule";

export const PostProcessingRulesEN: readonly Rule[] = [
  {
    pattern: /\bI would strongly recommend\b/giu,
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
  },

  {
    pattern: /\bI think\b/giu,
    replacement: "Considering"
  },
  {
    pattern: /\bWe think\b/giu,
    replacement: "Considering"
  },
  {
    pattern: /\bI believe\b/giu,
    replacement: "Considering"
  },
  {
    pattern: /\bWe believe\b/giu,
    replacement: "Considering"
  },

  {
    pattern: /\byour code\b/giu,
    replacement: "this code"
  },
  {
    pattern: /\byour project\b/giu,
    replacement: "this project"
  },
  {
    pattern: /\byour implementation\b/giu,
    replacement: "this implementation"
  },
  {
    pattern: /\byour solution\b/giu,
    replacement: "this solution"
  },
  {
    pattern: /\byour architecture\b/giu,
    replacement: "this architecture"
  },
  {
    pattern: /\byour design\b/giu,
    replacement: "this design"
  },
  {
    pattern: /\byour application\b/giu,
    replacement: "this application"
  },
  {
    pattern: /\byour system\b/giu,
    replacement: "this system"
  },
  {
    pattern: /\byour algorithm\b/giu,
    replacement: "this algorithm"
  },
  {
    pattern: /\byour logic\b/giu,
    replacement: "this logic"
  },

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
    pattern: /\brecommendations\b/giu,
    replacement: "considerations"
  },
  {
    pattern: /\brecommendation\b/giu,
    replacement: "consideration"
  },
  {
    pattern: /\brecommended\b/giu,
    replacement: "being considered"
  },
  {
    pattern: /\brecommending\b/giu,
    replacement: "considering"
  },
  {
    pattern: /\brecommends\b/giu,
    replacement: "considers"
  },
  {
    pattern: /\brecommend\b/giu,
    replacement: "consider"
  },

  {
    pattern: /\bmy\b/giu,
    replacement: "the"
  },
  {
    pattern: /\bour\b/giu,
    replacement: "the"
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
  }
];
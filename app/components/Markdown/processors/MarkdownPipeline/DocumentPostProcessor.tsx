import { Rule } from "./rules/Rule";

import { PostProcessingRulesKR_01_Sentences } from "./rules/kr/PostProcessingRulesKR_01_Sentences";
import { PostProcessingRulesKR_02_Phrases } from "./rules/kr/PostProcessingRulesKR_02_Phrases";
import { PostProcessingRulesKR_03_Recommendations } from "./rules/kr/PostProcessingRulesKR_03_Recommendations";
import { PostProcessingRulesKR_04_Pronouns } from "./rules/kr/PostProcessingRulesKR_04_Pronouns";
import { KR05SafeProcessor } from "./rules/kr/PostProcessingRulesKR_05_UpConvert_SAFE";

import { PostProcessingRulesEN_01_Sentences } from "./rules/en/PostProcessingRulesEN_01_Sentences";
import { PostProcessingRulesEN_02_Phrases } from "./rules/en/PostProcessingRulesEN_02_Phrases";
import { PostProcessingRulesEN_03_Recommendations } from "./rules/en/PostProcessingRulesEN_03_Recommendations";
import { PostProcessingRulesEN_04_Pronouns } from "./rules/en/PostProcessingRulesEN_04_Pronouns";

import { PostProcessingRulesFR_01_Sentences } from "./rules/fr/PostProcessingRulesFR_01_Sentences";
import { PostProcessingRulesFR_02_Phrases } from "./rules/fr/PostProcessingRulesFR_02_Phrases";
import { PostProcessingRulesFR_03_Recommendations } from "./rules/fr/PostProcessingRulesFR_03_Recommendations";
import { PostProcessingRulesFR_04_Pronouns } from "./rules/fr/PostProcessingRulesFR_04_Pronouns";

export class DocumentPostProcessor {
  private static readonly RULES: readonly Rule[] = [
    // =========================
    // KR PIPELINE (1~4 only)
    // =========================
    ...PostProcessingRulesKR_01_Sentences,
    ...PostProcessingRulesKR_02_Phrases,
    ...PostProcessingRulesKR_03_Recommendations,
    ...PostProcessingRulesKR_04_Pronouns,

    // KR_05 is NOT rule-based anymore → SAFE processor
    // (applied separately below)

    // =========================
    // EN PIPELINE
    // =========================
    ...PostProcessingRulesEN_01_Sentences,
    ...PostProcessingRulesEN_02_Phrases,
    ...PostProcessingRulesEN_03_Recommendations,
    ...PostProcessingRulesEN_04_Pronouns,

    // =========================
    // FR PIPELINE
    // =========================
    ...PostProcessingRulesFR_01_Sentences,
    ...PostProcessingRulesFR_02_Phrases,
    ...PostProcessingRulesFR_03_Recommendations,
    ...PostProcessingRulesFR_04_Pronouns
  ];

  static process(input: string): string {
    if (!input) {
      return "";
    }

    let out = input;

    // 1. emoji cleanup
    out = this.removeEmojis(out);

    // 2. rule-based pipelines (KR1~4 + EN + FR)
    for (const rule of this.RULES) {
      out = out.replace(rule.pattern, rule.replacement);
    }

    // 3. KR_05 SAFE POSTPROCESS (NO REGEX ENGINE)
    out = KR05SafeProcessor.apply(out);

    // 4. final normalization
    out = this.normalizeSentenceEnding(out);
    out = this.normalizeBoxNumbers(out);
    out = this.normalize(out);
    out = this.trimSpaces(out);

    return out;
  }

  private static removeEmojis(text: string): string {
    return text.replace(
      /[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F\u200D]/gu,
      ""
    );
  }

  private static normalizeSentenceEnding(text: string): string {
    return text.replace(
      /([가-힣]+?)야(?=(?:\.\.\.|[.?!]|$))/g,
      (_, word: string) =>
        word.endsWith("이")
          ? `${word}다`
          : `${word}이다`
    );
  }

  private static normalizeBoxNumbers(text: string): string {
    return text
      .replace(/0⃣/g, "0. ")
      .replace(/1⃣/g, "1. ")
      .replace(/2⃣/g, "2. ")
      .replace(/3⃣/g, "3. ")
      .replace(/4⃣/g, "4. ")
      .replace(/5⃣/g, "5. ")
      .replace(/6⃣/g, "6. ")
      .replace(/7⃣/g, "7. ")
      .replace(/8⃣/g, "8. ")
      .replace(/9⃣/g, "9. ");
  }

  private static normalize(text: string): string {
    return text
      .replace(/\r/g, "")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  private static trimSpaces(text: string): string {
    return text.replace(/[ \t]+$/gm, "");
  }
}
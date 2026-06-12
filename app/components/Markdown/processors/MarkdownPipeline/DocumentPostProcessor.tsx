import { PostProcessingRulesKR } from "./rules/PostProcessingRulesKR";
import { PostProcessingRulesEN } from "./rules/PostProcessingRulesEN";
import { PostProcessingRulesFR } from "./rules/PostProcessingRulesFR";
import { Rule } from "./rules/Rule";

export class DocumentPostProcessor {
  static process(input: string): string {
    if (!input) {
      return "";
    }

    let out = input;

    out = this.removeEmojis(out);

    out = this.applyRules(
      out,
      PostProcessingRulesKR
    );

    out = this.applyRules(
      out,
      PostProcessingRulesEN
    );

    out = this.applyRules(
      out,
      PostProcessingRulesFR
    );

    out = this.normalizeSentenceEnding(out);
    out = this.normalizeBoxNumbers(out);
    out = this.normalize(out);
    out = this.trimSpaces(out);

    return out;
  }

  private static applyRules(
    text: string,
    rules: readonly Rule[]
  ): string {
    let out = text;

    for (const rule of rules) {
      out = out.replace(
        rule.pattern,
        rule.replacement
      );
    }

    return out;
  }

  private static removeEmojis(
    text: string
  ): string {
    return text.replace(
      /[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F\u200D]/gu,
      ""
    );
  }

  private static normalizeSentenceEnding(
    text: string
  ): string {
    return text.replace(
      /([가-힣]+?)야(?=(?:\.\.\.|[.?!]|$))/g,
      (_, word: string) => {
        if (word.endsWith("이")) {
          return `${word}다`;
        }

        return `${word}이다`;
      }
    );
  }

  private static normalizeBoxNumbers(
    text: string
  ): string {
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

  private static normalize(
    text: string
  ): string {
    return text
      .replace(/\r/g, "")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  private static trimSpaces(
    text: string
  ): string {
    return text.replace(
      /[ \t]+$/gm,
      ""
    );
  }
}
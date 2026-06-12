import { Rule } from "../Rule";

export class KR05SafeProcessor {
  static apply(text: string): string {
    if (!text) return "";

    let out = text;

    // =========================
    // 1. fixed suffix replacements (SAFE)
    // =========================
    out = this.replaceSuffix(out, "합니다", "한다");
    out = this.replaceSuffix(out, "됩니다", "된다");
    out = this.replaceSuffix(out, "있습니다", "있다");
    out = this.replaceSuffix(out, "없습니다", "없다");

    out = this.replaceSuffix(out, "좋습니다", "좋다");
    out = this.replaceSuffix(out, "나쁩니다", "나쁘다");
    out = this.replaceSuffix(out, "중요합니다", "중요하다");
    out = this.replaceSuffix(out, "가능합니다", "가능하다");
    out = this.replaceSuffix(out, "필요합니다", "필요하다");

    out = this.replaceSuffix(out, "포함합니다", "포함한다");
    out = this.replaceSuffix(out, "제공합니다", "제공한다");
    out = this.replaceSuffix(out, "사용합니다", "사용한다");
    out = this.replaceSuffix(out, "설명합니다", "설명한다");
    out = this.replaceSuffix(out, "추천합니다", "추천한다");
    out = this.replaceSuffix(out, "권장합니다", "권장한다");

    // =========================
    // 2. "-입니다" safe word boundary
    // =========================
    out = this.replaceIsSuffix(out, "것입니다", "것이다");
    out = this.replaceIsSuffix(out, "내용입니다", "내용이다");
    out = this.replaceIsSuffix(out, "결과입니다", "결과이다");
    out = this.replaceIsSuffix(out, "구조입니다", "구조이다");
    out = this.replaceIsSuffix(out, "설계입니다", "설계이다");

    // generic -입니다 (safe boundary scan)
    out = this.replaceGenericIs(out);

    // =========================
    // 3. 진행형 (safe phrase scan)
    // =========================
    out = this.replacePhrase(out, "하는 것입니다", "하는 것이다");
    out = this.replacePhrase(out, "되는 것입니다", "되는 것이다");
    out = this.replaceSuffix(out, "중입니다", "중이다");
    out = this.replaceSuffix(out, "상태입니다", "상태이다");

    // =========================
    // 4. 하시는 → 하는
    // =========================
    out = this.replacePhrase(out, "하시는", "하는");
    out = this.replacePhrase(out, "보시는", "보는");
    out = this.replacePhrase(out, "사용하시는", "사용하는");
    out = this.replacePhrase(out, "설명하시는", "설명하는");

    return out;
  }

  // =========================
  // SAFE HELPERS (NO REGEX BACKTRACK)
  // =========================

  private static replaceSuffix(text: string, target: string, replace: string): string {
    if (!text.includes(target)) return text;
    return text.split(target).join(replace);
  }

  private static replacePhrase(text: string, target: string, replace: string): string {
    if (!text.includes(target)) return text;
    return text.split(target).join(replace);
  }

  private static replaceIsSuffix(text: string, target: string, replace: string): string {
    let result = "";
    let i = 0;

    while (i < text.length) {
      if (text.startsWith(target, i)) {
        result += replace;
        i += target.length;
      } else {
        result += text[i];
        i++;
      }
    }

    return result;
  }

  private static replaceGenericIs(text: string): string {
    // ONLY safe boundary "-입니다"
    let result = "";
    let i = 0;

    const suffix = "입니다";

    while (i < text.length) {
      if (text.startsWith(suffix, i)) {
        // ensure word boundary safety
        const prev = text[i - 1];
        const next = text[i + suffix.length];

        const isSafe =
          !prev || /\s|[.,!?]/.test(prev) ||
          !next || /\s|[.,!?]/.test(next);

        if (isSafe) {
          result += "이다";
          i += suffix.length;
        } else {
          result += suffix;
          i += suffix.length;
        }
      } else {
        result += text[i];
        i++;
      }
    }

    return result;
  }
}
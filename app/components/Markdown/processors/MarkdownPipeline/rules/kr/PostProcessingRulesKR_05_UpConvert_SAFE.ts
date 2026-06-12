export class KR05SafeProcessor {
  // =========================
  // 보호 대상 (절대 suffix 변환 금지 context)
  // =========================
  private static readonly PROTECTED_NEXT_TOKENS = [
    "만", "도", "는", "가",
    "그리고", "그러나", "하지만", "하지만은", "또한"
  ];

  // =========================
  // surface form 보호 (이미 자연 문장)
  // =========================
  private static readonly KEEP_FORMS = new Set([
    "보인다",
    "판단된다",
    "여겨진다",
    "간주된다",
    "해석된다",
    "존재한다",
    "발생한다"
  ]);

  static apply(text: string): string {
    if (!text) return "";

    let out = text;

    // =========================
    // 1. SAFE suffix conversion
    // =========================
    out = this.replaceSuffixSafe(out, "합니다", "한다");
    out = this.replaceSuffixSafe(out, "됩니다", "된다");
    out = this.replaceSuffixSafe(out, "있습니다", "있다");
    out = this.replaceSuffixSafe(out, "없습니다", "없다");

    out = this.replaceSuffixSafe(out, "좋습니다", "좋다");
    out = this.replaceSuffixSafe(out, "나쁩니다", "나쁘다");
    out = this.replaceSuffixSafe(out, "중요합니다", "중요하다");
    out = this.replaceSuffixSafe(out, "가능합니다", "가능하다");
    out = this.replaceSuffixSafe(out, "필요합니다", "필요하다");

    out = this.replaceSuffixSafe(out, "포함합니다", "포함한다");
    out = this.replaceSuffixSafe(out, "제공합니다", "제공한다");
    out = this.replaceSuffixSafe(out, "사용합니다", "사용한다");
    out = this.replaceSuffixSafe(out, "설명합니다", "설명한다");
    out = this.replaceSuffixSafe(out, "추천합니다", "추천한다");
    out = this.replaceSuffixSafe(out, "권장합니다", "권장한다");

    // =========================
    // 2. phrase-level safe conversion
    // =========================
    out = this.replacePhrase(out, "하는 것입니다", "하는 것이다");
    out = this.replacePhrase(out, "되는 것입니다", "되는 것이다");

    out = this.replaceSuffixSafe(out, "중입니다", "중이다");
    out = this.replaceSuffixSafe(out, "상태입니다", "상태이다");

    // =========================
    // 3. 하시는 → 하는
    // =========================
    out = this.replacePhrase(out, "하시는", "하는");
    out = this.replacePhrase(out, "보시는", "보는");
    out = this.replacePhrase(out, "사용하시는", "사용하는");
    out = this.replacePhrase(out, "설명하시는", "설명하는");

    return out;
  }

  // =========================
  // 핵심 SAFE suffix engine
  // =========================
  private static replaceSuffixSafe(text: string, target: string, replacement: string): string {
    if (!text.includes(target)) return text;

    let result = "";
    let i = 0;

    while (i < text.length) {
      if (text.startsWith(target, i)) {

        //  1. surface form 보호
        if (this.KEEP_FORMS.has(target)) {
          result += target;
          i += target.length;
          continue;
        }

        const nextChunk = text.slice(i + target.length, i + target.length + 10);

        //  2. 조사/접속사 보호
        const isUnsafeContext = this.PROTECTED_NEXT_TOKENS.some(token =>
          nextChunk.startsWith(token)
        );

        if (isUnsafeContext) {
          result += target;
        } else {
          result += replacement;
        }

        i += target.length;
      } else {
        result += text[i];
        i++;
      }
    }

    return result;
  }

  // =========================
  // phrase safe replace
  // =========================
  private static replacePhrase(text: string, target: string, replacement: string): string {
    if (!text.includes(target)) return text;
    return text.split(target).join(replacement);
  }
}
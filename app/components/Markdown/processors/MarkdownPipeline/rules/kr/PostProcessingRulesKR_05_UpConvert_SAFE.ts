export class KR05SafeProcessor {
  //  절대 건드리지 말아야 하는 표면형 동사
  private static readonly KEEP_SURFACE_FORMS = new Set([
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
    // 1. honorific suffix → plain form (SAFE)
    // =========================
    out = this.replaceSuffix(out, "합니다", "한다");
    out = this.replaceSuffix(out, "됩니다", "된다");
    out = this.replaceSuffix(out, "입니다", "이다");
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
    // 2. special phrases
    // =========================
    out = this.replacePhrase(out, "하는 것입니다", "하는 것이다");
    out = this.replacePhrase(out, "되는 것입니다", "되는 것이다");
    out = this.replaceSuffix(out, "중입니다", "중이다");
    out = this.replaceSuffix(out, "상태입니다", "상태이다");

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
  // SAFE CORE HELPERS
  // =========================

  private static replaceSuffix(text: string, target: string, replace: string): string {
    if (!text.includes(target)) return text;
    return text.split(target).join(replace);
  }

  private static replacePhrase(text: string, target: string, replace: string): string {
    if (!text.includes(target)) return text;
    return text.split(target).join(replace);
  }

  // =========================
  // OPTIONAL: 보호 레이어 (외부에서 호출 가능)
  // =========================
  static protectSurfaceForms(text: string): string {
    for (const form of this.KEEP_SURFACE_FORMS) {
      // 이미 올바른 형태 유지 (no-op placeholder)
      text = text.replace(new RegExp(form, "g"), form);
    }
    return text;
  }
}
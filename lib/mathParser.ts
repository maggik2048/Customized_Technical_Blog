// /lib/mathParser.ts

//  기본 정규화 (fallback용)
export function normalizeMath(text: string): string {
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // zero-width 제거
    .replace(/→/g, "\\rightarrow")
    .replace(/∫/g, "\\int")
    .replace(/∑/g, "\\sum")
    .replace(/∞/g, "\\infty")
    .replace(/dx/g, "\\,dx")
    .replace(/dy/g, "\\,dy")
    .replace(/\s+/g, " ");
}

//  핵심: LaTeX 의미 보정 (KaTeX annotation 후처리)
export function fixLatexSemantics(latex: string): string {
  return latex
    //  sin cos tan log ln → \sin
    .replace(/(?<!\\)(sin|cos|tan|log|ln)/g, "\\$1")

    //  sin x → sin(x)
    .replace(/\\(sin|cos|tan)\s+([a-zA-Z])/g, "\\$1($2)")

    //  sin^2 x → \sin^2(x)
    .replace(/\\(sin|cos|tan)\^([0-9]+)\s*([a-zA-Z])/g, "\\$1^{$2}($3)")

    //  e^x → e^{x}
    .replace(/e\^([a-zA-Z0-9]+)/g, "e^{$1}")

    //  dx dy spacing
    .replace(/d([xy])/g, "\\,d$1")

    //  ∫01 → \int_{0}^{1}
    .replace(/\\int\s*([0-9])([0-9])/g, "\\int_{$1}^{$2}")

    //  x2 → x^2
    .replace(/([a-zA-Z])([0-9]+)/g, "$1^{$2}")

    //  잘못된 escape 제거
    .replace(/\\=/g, "=")

    //  공백 정리
    .replace(/\s+/g, " ")
    .trim();
}

// 🔹 fallback용 (HTML 깨졌을 때만 작동)
export function fixAdvancedMath(text: string): string {
  return text
    //  SUM 복구
    .replace(
      /([a-zA-Z])\s*=\s*([0-9]+)\s*\\sum\s*([0-9\\infty]+)\s*([a-zA-Z])/g,
      (_, v, start, end, body) => {
        return `\\sum_{${v}=${start}}^{${end}} ${body}`;
      }
    )

    //  sum 붙음 방지
    .replace(/\\sum([A-Z])/g, "\\sum $1")

    //  ∫ 복구
    .replace(
      /\\int\s*([0-9])([0-9])\s*([a-zA-Z0-9\^\s]+)\\,dx/g,
      "\\int_{$1}^{$2} $3 \\,dx"
    )

    //  x2 → x^2
    .replace(/([a-zA-Z])([0-9]+)/g, "$1^{$2}")

    //  공백 정리
    .replace(/\s+/g, " ");
}

//  자동 $$ 감싸기
export function autoWrapMath(text: string): string {
  const mathPattern =
    /(\\frac|\\sum|\\int|\\rightarrow|\\infty|\\sin|\\cos|\\tan)/;

  return text
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();

      if (mathPattern.test(trimmed)) {
        if (!trimmed.startsWith("$$")) {
          return "$$\n" + trimmed + "\n$$";
        }
      }
      return line;
    })
    .join("\n");
}

//  최종 fallback 파이프라인
export function processMath(text: string): string {
  let result = text;

  result = normalizeMath(result);
  result = fixAdvancedMath(result);
  result = fixLatexSemantics(result); // 🔥 추가됨 (중요)
  result = autoWrapMath(result);

  return result;
}
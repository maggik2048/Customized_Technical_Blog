// /lib/mathParser.ts

export function normalizeMath(text: string): string {
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // zero-width 제거
    .replace(/=/g, " = ")
    .replace(/([a-zA-Z])\\sum/g, "$1 \\sum")
    .replace(/→/g, "\\rightarrow")
    .replace(/∫/g, "\\int")
    .replace(/∑/g, "\\sum")
    .replace(/∞/g, "\\infty")
    .replace(/dx/g, "\\,dx")
    .replace(/dy/g, "\\,dy")
    .replace(/\s+/g, " ");
}

export function fixAdvancedMath(text: string): string {
  return text

    // 🔥 SUM 복구
    .replace(
      /([a-zA-Z])\s*=\s*([0-9]+)\s*\\sum\s*([0-9\\infty]+)\s*([a-zA-Z])/g,
      (_, v, start, end, body) => {
        return `\\sum_{${v}=${start}}^{${end}} ${body}`;
      }
    )

    // 🔥 sum 붙음 방지
    .replace(/\\sum([A-Z])/g, "\\sum $1")

    // 🔥 ∫ 복구
    .replace(
      /\\int\s*([0-9])([0-9])\s*([a-zA-Z0-9\^\s]+)\\,dx/g,
      "\\int_{$1}^{$2} $3 \\,dx"
    )

    // 🔥 x2 → x^2
    .replace(/([a-zA-Z])([0-9]+)/g, "$1^{$2}")

    // 🔥 잘못된 escape 제거
    .replace(/\\=/g, "=")

    // 🔥 공백 정리
    .replace(/\s+/g, " ");
}

export function autoWrapMath(text: string): string {
  const mathPattern =
    /(\\frac|\\sum|\\int|\\rightarrow|\\infty|[a-zA-Z]\([a-zA-Z0-9,]+\))/;

  return text
    .split("\n")
    .map((line) => {
      if (mathPattern.test(line.trim())) {
        if (!line.includes("$$")) {
          return "$$\n" + line + "\n$$";
        }
      }
      return line;
    })
    .join("\n");
}

export function processMath(text: string): string {
  let result = text;
  result = normalizeMath(result);
  result = fixAdvancedMath(result);
  result = autoWrapMath(result);
  return result;
}
// /lib/katexParser.ts

import { fixLatexSemantics } from "./mathParser";

export function convertHtmlWithMath(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  function walk(node: Node): string {
    // 🔹 텍스트 노드
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || "";
    }

    // 🔹 Element 노드
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;

      //  KaTeX 감지 (핵심)
      if (el.classList.contains("katex")) {
        const annotation = el.querySelector(
          'annotation[encoding="application/x-tex"]'
        );

        if (annotation?.textContent) {
          let latex = annotation.textContent.trim();

          // 핵심 추가 (이거 때문에 성능 올라감)
          latex = fixLatexSemantics(latex);

          //  inline 판단 개선
          const isInline =
            latex.length < 40 &&
            !/\\(int|sum|frac|begin|prod)/.test(latex);

          return isInline
            ? `$${latex}$`
            : `\n$$\n${latex}\n$$\n`;
        }
      }

      //  줄바꿈 처리
      if (el.tagName === "BR") return "\n";

      if (el.tagName === "P") {
        return walkChildren(el) + "\n";
      }

      return walkChildren(el);
    }

    return "";
  }

  function walkChildren(parent: Node): string {
    let result = "";

    parent.childNodes.forEach((child) => {
      let part = walk(child);

      //  수식-텍스트 붙는 문제 해결
      part = part
        .replace(/([가-힣a-zA-Z0-9])\$/g, "$1 $")
        .replace(/\$([가-힣a-zA-Z0-9])/g, "$ $1");

      result += part;
    });

    return result;
  }

  return walkChildren(doc.body)
    //  block 정리
    .replace(/\$\$\n+/g, "$$\n")
    .replace(/\n+\$\$/g, "\n$$")

    //  공백/줄바꿈 정리
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")

    .trim();
}
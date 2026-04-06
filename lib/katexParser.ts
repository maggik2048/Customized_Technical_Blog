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

      // 🔥 KaTeX 감지
      if (el.classList.contains("katex")) {
        const annotation = el.querySelector(
          'annotation[encoding="application/x-tex"]'
        );

        if (annotation?.textContent) {
          const latex = annotation.textContent.trim();

          // 👉 inline / block 판단
          if (latex.length < 30 && !latex.includes("\\int") && !latex.includes("\\sum")) {
            return `$${latex}$`;
          } else {
            return `$$\n${latex}\n$$`;
          }
        }
      }

      // 🔹 줄바꿈 처리
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
      result += walk(child);
    });
    return result;
  }

  return walkChildren(doc.body)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
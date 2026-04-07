export function katexToLatex(root: HTMLElement): string {
  // ✅ 1순위: 숨겨진 LaTeX (정확도 100%)
  const annotation = root.querySelector("annotation");
  if (annotation?.textContent) {
    return annotation.textContent;
  }

  // ❗ fallback (혹시 annotation 없는 경우)
  return parseNode(root);
}

function parseNode(node: Node): string {
  if (!node) return "";

  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent?.trim() || "";
  }

  const el = node as HTMLElement;
  const cls = el.classList;
  if (!cls) return "";

  if (cls.contains("mathnormal")) return el.textContent || "";
  if (cls.contains("mbin") || cls.contains("mrel")) return el.textContent || "";

  if (cls.contains("mfrac")) {
    const spans = el.querySelectorAll(".vlist > span");
    if (spans.length >= 3) {
      return `\\frac{${parseNode(spans[0])}}{${parseNode(spans[2])}}`;
    }
  }

  if (cls.contains("msupsub")) {
    const vlist = el.querySelector(".vlist");
    if (!vlist) return "";

    const spans = Array.from(vlist.children);
    const upper = spans[0] ? parseNode(spans[0]) : "";
    const lower = spans[1] ? parseNode(spans[1]) : "";

    return `${lower ? `_{${lower}}` : ""}${upper ? `^{${upper}}` : ""}`;
  }

  let result = "";
  node.childNodes.forEach(child => {
    result += parseNode(child);
  });

  return result;
}




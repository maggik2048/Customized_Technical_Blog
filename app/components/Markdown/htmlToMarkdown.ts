import { tableToMarkdown } from "./tableToMarkdown";

export function htmlToMarkdown(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");

  let out = "";

  const walk = (node: ChildNode) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";

      // ⚠️ 수정: 코드/프리 영역 깨짐 방지 위해 개행 과도 정리 제거
      out += text;
      return;
    }

    const el = node as HTMLElement;

    switch (el.tagName) {
      case "H1":
        out += `\n# ${el.textContent?.trim()}\n\n`;
        return;

      case "H2":
        out += `\n## ${el.textContent?.trim()}\n\n`;
        return;

      case "H3":
        out += `\n### ${el.textContent?.trim()}\n\n`;
        return;

      case "P":
        out += `\n${el.textContent?.trim()}\n\n`;
        return;

      case "DIV": {
        const text = el.textContent?.trim();
        if (!text) return;

        const hasBlockChild = Array.from(el.children).some((child) =>
          ["DIV", "P", "H1", "H2", "H3", "UL", "OL", "TABLE", "PRE", "CODE"].includes(
            child.tagName
          )
        );

        if (hasBlockChild) {
          el.childNodes.forEach(walk);

          if (!out.endsWith("\n\n")) {
            out += "\n";
          }

          return;
        }

        out += `${text}\n\n`;
        return;
      }

      case "SPAN": {
        const text = el.textContent?.trim();
        if (!text) return;

        const next = el.nextSibling;

        if (next && next.nodeName === "BR") {
          out += `${text}\n\n`;
          return;
        }

        out += text;
        return;
      }

      case "BR":
        out += "\n";
        return;

      case "STRONG":
      case "B":
        out += `**${el.textContent}**`;
        return;

      case "EM":
      case "I":
        out += `*${el.textContent}*`;
        return;

      case "UL":
        Array.from(el.children).forEach((li) => {
          out += `- ${li.textContent?.trim()}\n`;
        });
        out += "\n";
        return;

      case "OL":
        Array.from(el.children).forEach((li, idx) => {
          out += `${idx + 1}. ${li.textContent?.trim()}\n`;
        });
        out += "\n";
        return;

      case "LI":
        out += `- ${el.textContent?.trim()}\n`;
        return;

      case "TABLE":
        out += "\n" + tableToMarkdown(el as HTMLTableElement) + "\n";
        return;

      // ✔ 핵심 추가: 코드/프리 블록은 HTML 그대로 유지
      case "PRE":
      case "CODE":
        out += el.textContent || "";
        return;

      default:
        el.childNodes.forEach(walk);
    }
  };

  doc.body.childNodes.forEach(walk);

  return out
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
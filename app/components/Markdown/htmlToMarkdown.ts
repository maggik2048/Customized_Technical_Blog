import { tableToMarkdown } from "./tableToMarkdown";

export function htmlToMarkdown(html: string): string {
  const doc = new DOMParser().parseFromString(
    html,
    "text/html"
  );

  let out = "";

  const walk = (node: ChildNode) => {
    /* =========================================
       TEXT NODE
    ========================================= */

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";

      out += text;

      return;
    }

    const el = node as HTMLElement;

    /* =========================================
       HEADINGS
    ========================================= */

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

      /* =========================================
         PARAGRAPH
      ========================================= */

      case "P":
        out += `\n${el.textContent?.trim()}\n\n`;
        return;

      /* =========================================
         DIV
      ========================================= */

      case "DIV": {
        const text = el.textContent?.trim();

        if (!text && !el.children.length) {
          return;
        }

        const hasBlockChild = Array.from(
          el.children
        ).some((child) =>
          [
            "DIV",
            "P",
            "H1",
            "H2",
            "H3",
            "UL",
            "OL",
            "TABLE",
            "PRE",
            "BLOCKQUOTE",
          ].includes(child.tagName)
        );

        if (hasBlockChild) {
          el.childNodes.forEach(walk);

          if (!out.endsWith("\n\n")) {
            out += "\n";
          }

          return;
        }

        if (text) {
          out += `${text}\n\n`;
        }

        return;
      }

      /* =========================================
         SPAN
      ========================================= */

      case "SPAN": {
        const text = el.textContent;

        if (!text) return;

        out += text;

        return;
      }

      /* =========================================
         BR
      ========================================= */

      case "BR":
        out += "\n";
        return;

      /* =========================================
         BOLD
      ========================================= */

      case "STRONG":
      case "B":
        out += `**${el.textContent || ""}**`;
        return;

      /* =========================================
         ITALIC
      ========================================= */

      case "EM":
      case "I":
        out += `*${el.textContent || ""}*`;
        return;

      /* =========================================
         UL
      ========================================= */

      case "UL": {
        Array.from(el.children).forEach((li) => {
          const text =
            li.textContent?.trim() || "";

          out += `- ${text}\n`;
        });

        out += "\n";

        return;
      }

      /* =========================================
         OL
      ========================================= */

      case "OL": {
        Array.from(el.children).forEach(
          (li, idx) => {
            const text =
              li.textContent?.trim() || "";

            out += `${idx + 1}. ${text}\n`;
          }
        );

        out += "\n";

        return;
      }

      /* =========================================
         LI
      ========================================= */

      case "LI":
        out += `- ${el.textContent?.trim()}\n`;
        return;

      /* =========================================
         BLOCKQUOTE
      ========================================= */

      case "BLOCKQUOTE": {
        const text =
          el.textContent?.trim() || "";

        out += `\n> ${text}\n\n`;

        return;
      }

      /* =========================================
         TABLE
      ========================================= */

      case "TABLE":
        out +=
          "\n" +
          tableToMarkdown(
            el as HTMLTableElement
          ) +
          "\n";

        return;

      /* =========================================
         PRE (MULTILINE CODE BLOCK)
      ========================================= */

      case "PRE": {
        const code =
          el.querySelector("code");

        const className =
          code?.className || "";

        const match =
          className.match(
            /language-([\w#+-]+)/
          );

        const lang =
          match?.[1] || "";

        const raw =
          (
            code?.textContent ||
            el.textContent ||
            ""
          )
            .replace(/\u00A0/g, " ")
            .replace(/\t/g, "  ")
            .replace(/\r/g, "");

        out +=
          `\n\`\`\`${lang}\n` +
          raw.trimEnd() +
          `\n\`\`\`\n\n`;

        return;
      }

      /* =========================================
         INLINE CODE
      ========================================= */

      case "CODE": {
        // PRE 내부 CODE는 PRE에서 처리
        if (
          el.parentElement?.tagName ===
          "PRE"
        ) {
          return;
        }

        const text =
          el.textContent || "";

        out += `\`${text}\``;

        return;
      }

      /* =========================================
         DEFAULT RECURSIVE WALK
      ========================================= */

      default:
        el.childNodes.forEach(walk);
    }
  };

  doc.body.childNodes.forEach(walk);

  /* =========================================
     FINAL NORMALIZATION
  ========================================= */

  return out
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
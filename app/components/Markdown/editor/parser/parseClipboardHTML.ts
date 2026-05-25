// app/components/Markdown/editor/parser/parseClipboardHTML.ts

import { ASTNode } from "../ast/types";

export function parseClipboardHTML(
  html: string
): ASTNode[] {
  const doc = new DOMParser().parseFromString(
    html,
    "text/html"
  );

  const ast: ASTNode[] = [];

  const walk = (node: ChildNode) => {
    if (
      node.nodeType === Node.TEXT_NODE
    ) {
      const text =
        node.textContent?.trim() || "";

      if (!text) return;

      ast.push({
        type: "paragraph",
        content: text,
      });

      return;
    }

    const el = node as HTMLElement;

    switch (el.tagName) {
      case "H1":
      case "H2":
      case "H3":
      case "H4":
      case "H5":
      case "H6": {
        ast.push({
          type: "heading",
          level: Number(
            el.tagName.replace("H", "")
          ),
          content:
            el.textContent?.trim() || "",
        });

        return;
      }

      case "P": {
        const text =
          el.textContent?.trim() || "";

        if (!text) return;

        ast.push({
          type: "paragraph",
          content: text,
        });

        return;
      }

      case "PRE": {
        const code =
          el.querySelector("code");

        const className =
          code?.className || "";

        const match =
          className.match(
            /language-([\w-]+)/
          );

        const language =
          match?.[1] || "";

        const content =
          (
            code?.textContent ||
            el.textContent ||
            ""
          )
            .replace(/\r/g, "")
            .replace(/\u00A0/g, " ");

        ast.push({
          type: "code",
          language,
          content,
        });

        return;
      }

      case "UL":
      case "OL": {
        const ordered =
          el.tagName === "OL";

        const items = Array.from(
          el.querySelectorAll("li")
        ).map((li) =>
          li.textContent?.trim()
        ) as string[];

        ast.push({
          type: "list",
          ordered,
          items,
        });

        return;
      }

      default: {
        el.childNodes.forEach(walk);
      }
    }
  };

  doc.body.childNodes.forEach(walk);

  return ast;
}
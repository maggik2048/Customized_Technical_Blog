// HTMLtoASTExtractor.ts

export type ASTNode =
  | HeadingNode
  | ParagraphNode
  | CodeNode
  | ListNode
  | ListItemNode
  | BlockquoteNode
  | TableNode
  | TextNode;

export type HeadingNode = {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  content: string;
};

export type ParagraphNode = {
  type: "paragraph";
  content: string;
};

export type CodeNode = {
  type: "code";
  language?: string;
  content: string;
};

export type ListNode = {
  type: "list";
  ordered: boolean;
  items: ListItemNode[];
};

export type ListItemNode = {
  type: "listItem";
  content: string;
};

export type BlockquoteNode = {
  type: "blockquote";
  content: string;
};

export type TableNode = {
  type: "table";
  header: string[];
  rows: string[][];
};

export type TextNode = {
  type: "text";
  content: string;
};

export class HTMLtoASTExtractor {
  static extract(html: string): ASTNode[] {
    const doc = new DOMParser().parseFromString(html, "text/html");

    const nodes: ASTNode[] = [];

    const walk = (el: ChildNode) => {
      if (el.nodeType === Node.TEXT_NODE) {
        const text = el.textContent?.trim();
        if (!text) return;

        nodes.push({
          type: "text",
          content: text,
        });

        return;
      }

      const node = el as HTMLElement;

      switch (node.tagName) {
        case "H1":
        case "H2":
        case "H3":
        case "H4":
        case "H5":
        case "H6": {
          nodes.push({
            type: "heading",
            level: Number(node.tagName[1]) as any,
            content: node.textContent?.trim() || "",
          });
          return;
        }

        case "P": {
          const text = node.textContent?.trim();
          if (!text) return;

          nodes.push({
            type: "paragraph",
            content: text,
          });
          return;
        }

        case "PRE": {
          const code = node.querySelector("code");
          const className = code?.className || "";

          const match = className.match(/language-([\w#+-]+)/);
          const lang = match?.[1];

          nodes.push({
            type: "code",
            language: lang,
            content: (code?.textContent || "").trim(),
          });

          return;
        }

        case "BLOCKQUOTE": {
          nodes.push({
            type: "blockquote",
            content: node.textContent?.trim() || "",
          });
          return;
        }

        case "UL":
        case "OL": {
          const items: ListItemNode[] = Array.from(
            node.querySelectorAll("li")
          ).map((li) => ({
            type: "listItem",
            content: li.textContent?.trim() || "",
          }));

          nodes.push({
            type: "list",
            ordered: node.tagName === "OL",
            items,
          });

          return;
        }

        case "TABLE": {
          const rows = Array.from(node.querySelectorAll("tr")).map((tr) =>
            Array.from(tr.querySelectorAll("th, td")).map(
              (td) => td.textContent?.trim() || ""
            )
          );

          const header = rows[0] || [];
          const body = rows.slice(1);

          nodes.push({
            type: "table",
            header,
            rows: body,
          });

          return;
        }

        default: {
          node.childNodes.forEach(walk);
        }
      }
    };

    doc.body.childNodes.forEach(walk);

    return nodes;
  }
}
// ASTtoMarkdownSerializer.ts

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

export class ASTtoMarkdownSerializer {
  static serialize(nodes: ASTNode[]): string {
    let out = "";

    for (const node of nodes) {
      switch (node.type) {
        case "heading":
          out += `${"#".repeat(node.level)} ${node.content}\n\n`;
          break;

        case "paragraph":
          out += `${node.content}\n\n`;
          break;

        case "code":
          out += this.serializeCode(node) + "\n\n";
          break;

        case "list":
          out += this.serializeList(node) + "\n";
          break;

        case "blockquote":
          out += `> ${node.content}\n\n`;
          break;

        case "table":
          out += this.serializeTable(node) + "\n";
          break;

        case "text":
          out += node.content;
          break;
      }
    }

    return this.normalize(out);
  }

  private static serializeCode(node: CodeNode): string {
    const lang = node.language || "";
    return "```" + lang + "\n" + node.content + "\n```";
  }

  private static serializeList(node: ListNode): string {
    return node.items
      .map((item, idx) => {
        return node.ordered
          ? `${idx + 1}. ${item.content}`
          : `- ${item.content}`;
      })
      .join("\n");
  }

  private static serializeTable(node: TableNode): string {
    const header = `| ${node.header.join(" | ")} |`;
    const separator =
      `| ${node.header.map(() => "---").join(" | ")} |`;

    const rows = node.rows
      .map((row) => `| ${row.join(" | ")} |`)
      .join("\n");

    return [header, separator, rows].join("\n");
  }

  private static normalize(text: string): string {
    return text
      .replace(/\r/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
}
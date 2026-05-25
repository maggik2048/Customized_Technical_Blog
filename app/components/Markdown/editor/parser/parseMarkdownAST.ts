import { ASTNode } from "../ast/types";

export function parseMarkdownAST(
  input: string
): ASTNode[] {
  const lines = input.split("\n");

  const ast: ASTNode[] = [];

  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    /* ================= CODE ================= */

    if (line.startsWith("```")) {
      const lang = line.replace("```", "").trim();

      i++;

      let code = "";

      while (
        i < lines.length &&
        !lines[i].startsWith("```")
      ) {
        code += lines[i] + "\n";
        i++;
      }

      ast.push({
        type: "code",
        lang,
        content: code.trimEnd(),
      });

      i++;
      continue;
    }

    /* ================= LIST ================= */

    if (/^\s*-\s+/.test(line)) {
      const items: string[] = [];

      while (
        i < lines.length &&
        /^\s*-\s+/.test(lines[i])
      ) {
        items.push(
          lines[i].replace(/^\s*-\s+/, "")
        );

        i++;
      }

      ast.push({
        type: "list",
        items,
      });

      continue;
    }

    /* ================= PARAGRAPH ================= */

    if (line.trim()) {
      ast.push({
        type: "paragraph",
        content: line,
      });
    }

    i++;
  }

  return ast;
}
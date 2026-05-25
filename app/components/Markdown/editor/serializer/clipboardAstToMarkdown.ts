// app/components/Markdown/editor/serializer/clipboardAstToMarkdown.ts

import { ASTNode } from "../ast/types";

export function clipboardAstToMarkdown(
  ast: ASTNode[]
): string {
  let out = "";

  for (const node of ast) {
    switch (node.type) {
      case "heading": {
        out += `${"#".repeat(
          node.level
        )} ${node.content}\n\n`;

        break;
      }

      case "paragraph": {
        out += `${node.content}\n\n`;

        break;
      }

      case "list": {
        node.items.forEach(
          (item, index) => {
            if (node.ordered) {
              out += `${index + 1}. ${item}\n`;
            } else {
              out += `- ${item}\n`;
            }
          }
        );

        out += "\n";

        break;
      }

      case "code": {
        out += `\`\`\`${node.language}\n`;

        out += node.content.trimEnd();

        out += `\n\`\`\`\n\n`;

        break;
      }
    }
  }

  return out.trim();
}
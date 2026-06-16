import { ASTNode } from "../ast/types";

/**
 * Serializes AST to markdown specifically for clipboard operations
 * @param ast - The AST to serialize
 * @returns Markdown string suitable for clipboard
 */
export function clipboardAstToMarkdown(ast: ASTNode[]): string {
  let out = "";

  for (const node of ast) {
    switch (node.type) {
      case "heading": {
        out += `${"#".repeat(node.level)} ${node.content}\n\n`;
        break;
      }

      case "paragraph": {
        out += `${node.content}\n\n`;
        break;
      }

      case "list": {
        node.items.forEach((item, index) => {
          if (node.ordered) {
            out += `${index + 1}. ${item}\n`;
          } else {
            out += `- ${item}\n`;
          }
        });
        out += "\n";
        break;
      }

      case "code": {
        // Fixed: Handle undefined language with empty string
        const language = node.language || "";
        out += `\`\`\`${language}\n`;
        out += node.content.trimEnd();
        out += `\n\`\`\`\n\n`;
        break;
      }

      default: {
        // Type guard for exhaustive checking
        const _exhaustiveCheck: never = node;
        break;
      }
    }
  }

  return out.trim();
}

/**
 * Serializes AST to markdown with custom options for clipboard
 */
export function clipboardAstToMarkdownWithOptions(
  ast: ASTNode[],
  options?: {
    includeCodeLanguage?: boolean;
    preserveEmptyLines?: boolean;
    listIndent?: number;
  }
): string {
  const { includeCodeLanguage = true, preserveEmptyLines = true, listIndent = 0 } = options || {};
  let out = "";

  for (const node of ast) {
    switch (node.type) {
      case "heading": {
        out += `${"#".repeat(node.level)} ${node.content}\n\n`;
        break;
      }

      case "paragraph": {
        out += `${node.content}\n\n`;
        break;
      }

      case "list": {
        const indent = " ".repeat(listIndent);
        node.items.forEach((item, index) => {
          if (node.ordered) {
            out += `${indent}${index + 1}. ${item}\n`;
          } else {
            out += `${indent}- ${item}\n`;
          }
        });
        out += "\n";
        break;
      }

      case "code": {
        const language = includeCodeLanguage && node.language ? node.language : "";
        out += `\`\`\`${language}\n`;
        out += node.content.trimEnd();
        out += `\n\`\`\`\n\n`;
        break;
      }

      default: {
        break;
      }
    }
  }

  return preserveEmptyLines ? out : out.trim();
}

/**
 * Utility to check if AST can be serialized for clipboard
 */
export function canSerializeForClipboard(ast: ASTNode[]): boolean {
  try {
    clipboardAstToMarkdown(ast);
    return true;
  } catch {
    return false;
  }
}
import { ASTNode } from "../ast/types";

/**
 * Serializes an AST back to markdown string
 * @param ast - The AST to serialize
 * @returns Markdown string
 */
export function astToMarkdown(ast: ASTNode[]): string {
  return ast
    .map((node) => {
      switch (node.type) {
        case "code":
          return (
            "```" +
            (node.language || "") +
            "\n" +
            node.content +
            "\n```"
          );

        case "heading":
          return "#".repeat(node.level) + " " + node.content;

        case "paragraph":
          return node.content;

        case "list":
          const prefix = node.ordered ? "1. " : "- ";
          return node.items.map((item) => prefix + item).join("\n");

        default:
          // Type guard for exhaustive checking
          const _exhaustiveCheck: never = node;
          return "";
      }
    })
    .join("\n\n");
}

/**
 * Serializes a single AST node to markdown
 */
export function nodeToMarkdown(node: ASTNode): string {
  switch (node.type) {
    case "code":
      return (
        "```" +
        (node.language || "") +
        "\n" +
        node.content +
        "\n```"
      );

    case "heading":
      return "#".repeat(node.level) + " " + node.content;

    case "paragraph":
      return node.content;

    case "list":
      const prefix = node.ordered ? "1. " : "- ";
      return node.items.map((item) => prefix + item).join("\n");

    default:
      // Type guard for exhaustive checking
      const _exhaustiveCheck: never = node;
      return "";
  }
}

/**
 * Serializes AST to markdown with custom options
 */
export function astToMarkdownWithOptions(
  ast: ASTNode[],
  options?: {
    codeBlockLanguage?: boolean;
    headingLevelOffset?: number;
    listIndent?: number;
  }
): string {
  const { codeBlockLanguage = true, headingLevelOffset = 0, listIndent = 0 } = options || {};

  return ast
    .map((node) => {
      switch (node.type) {
        case "code":
          const language = codeBlockLanguage && node.language ? node.language : "";
          return "```" + language + "\n" + node.content + "\n```";

        case "heading":
          const level = Math.min(Math.max(node.level + headingLevelOffset, 1), 6);
          return "#".repeat(level) + " " + node.content;

        case "paragraph":
          return node.content;

        case "list":
          const prefix = node.ordered ? "1. " : "- ";
          const indent = " ".repeat(listIndent);
          return node.items.map((item) => indent + prefix + item).join("\n");

        default:
          return "";
      }
    })
    .join("\n\n");
}

/**
 * Utility to check if AST contains a specific node type
 */
export function hasNodeType(ast: ASTNode[], type: ASTNode["type"]): boolean {
  return ast.some((node) => node.type === type);
}

/**
 * Utility to count nodes by type
 */
export function countNodesByType(ast: ASTNode[]): Record<ASTNode["type"], number> {
  return ast.reduce(
    (acc, node) => {
      acc[node.type] = (acc[node.type] || 0) + 1;
      return acc;
    },
    {} as Record<ASTNode["type"], number>
  );
}

/**
 * Utility to extract all code blocks from AST
 * 수정된 부분: 타입 단언 사용
 */
export function extractCodeBlocks(ast: ASTNode[]): string[] {
  return ast
    .filter((node) => node.type === "code")
    .map((node) => (node as { type: "code"; content: string }).content);
}

/**
 * Type guard for CodeBlockNode
 * 수정된 부분: any 타입 사용으로 간단히 처리
 */
function isCodeBlockNode(node: ASTNode): boolean {
  return node.type === "code";
}
import { ASTNode } from "../ast/types";

export function astToMarkdown(
  ast: ASTNode[]
): string {
  return ast
    .map((node) => {
      switch (node.type) {
        case "paragraph":
          return node.content;

        case "code":
          return (
            "```" +
            node.lang +
            "\n" +
            node.content +
            "\n```"
          );

        case "list":
          return node.items
            .map((item) => `- ${item}`)
            .join("\n");

        default:
          return "";
      }
    })
    .join("\n\n");
}
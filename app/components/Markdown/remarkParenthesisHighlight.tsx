import { visit } from "unist-util-visit";

export function remarkParenthesisHighlight() {
  return (tree: any) => {
    visit(tree, "text", (node, index, parent) => {
      const regex = /\((.*?)\)/g;
      const parts = node.value.split(regex);

      if (parts.length === 1) return;

      const newNodes: any[] = [];

      parts.forEach((part: string, i: number) => {
        if (i % 2 === 1) {
          newNodes.push({
            type: "element",
            tagName: "span",
            properties: { className: ["paren-highlight"] },
            children: [{ type: "text", value: `(${part})` }],
          });
        } else {
          if (part) newNodes.push({ type: "text", value: part });
        }
      });

      parent.children.splice(index, 1, ...newNodes);
    });
  };
}
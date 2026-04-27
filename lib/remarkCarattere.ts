import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";

export function remarkCarattere() {
  return (tree: any) => {
    visit(tree, "paragraph", (node: any, index: number, parent: any) => {
      const text = toString(node);

      const regex = /^"""carattere\s*([\s\S]*?)\s*"""$/;
      const match = text.match(regex);

      if (!match) return;

      const content = match[1];

      parent.children.splice(index, 1, {
        type: "html",
        value: `<span style="font-family: 'Carattere', cursive; font-size: 26px;">${content}</span>`,
      });
    });
  };
}
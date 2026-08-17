import { visit } from "unist-util-visit";

export function remarkComponent() {
  return (tree: any) => {
    visit(tree, "text", (node: any, index: number | undefined, parent: any) => {
      if (!parent || index === undefined) return;

      const regex = /\[(\w+)\]/g;
      const matches = [...node.value.matchAll(regex)];

      if (matches.length === 0) return;

      const newNodes: any[] = [];
      let lastIndex = 0;

      matches.forEach((match) => {
        const [full, name] = match;
        const start = match.index!;
        const end = start + full.length;

        // 앞 텍스트
        if (start > lastIndex) {
          newNodes.push({
            type: "text",
            value: node.value.slice(lastIndex, start),
          });
        }

        // 커스텀 노드
        newNodes.push({
          type: "component",
          name,
        });

        lastIndex = end;
      });

      // 마지막 텍스트
      if (lastIndex < node.value.length) {
        newNodes.push({
          type: "text",
          value: node.value.slice(lastIndex),
        });
      }

      parent.children.splice(index, 1, ...newNodes);
    });
  };
}
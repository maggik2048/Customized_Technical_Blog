import React from "react";

type ParsedPart =
  | {
      kind: "md";
      content: string;
      key: number;
    }
  | {
      kind: "viz";
      Component: React.ComponentType;
      key: number;
    };

export function useParsedPDFContent(
  content: string,
  getVizComponent: (key: string) => any
) {
  return React.useMemo<ParsedPart[]>(() => {
    const regex = /\[([A-Za-z_][A-Za-z0-9_]*)\]/g;

    const codeBlocks: string[] = [];

    const protectedContent = content.replace(
      /```[\s\S]*?```/g,
      (match: string) => {
        codeBlocks.push(match);
        return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
      }
    );

    const parts = protectedContent.split(regex);

    const restore = (text: string) =>
      text.replace(
        /__CODE_BLOCK_(\d+)__/g,
        (_, i) => codeBlocks[Number(i)]
      );

    return parts.map((part, i) => {
      const Component = getVizComponent(part);

      if (Component) {
        return {
          kind: "viz",
          Component,
          key: i,
        };
      }

      return {
        kind: "md",
        content: restore(part),
        key: i,
      };
    });
  }, [content, getVizComponent]);
}
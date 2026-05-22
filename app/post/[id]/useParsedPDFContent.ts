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

    /* =========================
       PROTECT CODE BLOCKS
    ========================= */

    const codeBlocks: string[] = [];

    const protectedContent = content.replace(
      /```[\s\S]*?```/g,
      (match: string) => {
        const id = codeBlocks.length;

        codeBlocks.push(match);

        return `__CODE_BLOCK_${id}__`;
      }
    );

    /* =========================
       VIZ TOKEN
       [[VIZ:Graph]]
    ========================= */

    const regex =
      /\[\[VIZ:([A-Za-z_][A-Za-z0-9_]*)\]\]/g;

    const restoreCodeBlocks = (
      text: string
    ) =>
      text.replace(
        /__CODE_BLOCK_(\d+)__/g,
        (_, i) =>
          codeBlocks[Number(i)] || ""
      );

    const result: ParsedPart[] = [];

    let lastIndex = 0;

    /* =========================
       PARSE
    ========================= */

    for (const match of protectedContent.matchAll(
      regex
    )) {
      const fullMatch = match[0];

      const vizName = match[1];

      const index =
        match.index ?? 0;

      /* =========================
         MARKDOWN BEFORE TOKEN
      ========================= */

      const before =
        protectedContent.slice(
          lastIndex,
          index
        );

      if (before.trim()) {
        result.push({
          kind: "md",

          content:
            restoreCodeBlocks(before),

          key: result.length,
        });
      }

      /* =========================
         VIZ COMPONENT
      ========================= */

      const Component =
        getVizComponent(vizName);

      if (Component) {
        result.push({
          kind: "viz",

          Component,

          key: result.length,
        });
      } else {

        // fallback:
        // keep raw token if component missing

        result.push({
          kind: "md",

          content:
            restoreCodeBlocks(
              fullMatch
            ),

          key: result.length,
        });
      }

      lastIndex =
        index + fullMatch.length;
    }

    /* =========================
       REMAINING MARKDOWN
    ========================= */

    const remain =
      protectedContent.slice(
        lastIndex
      );

    if (remain.trim()) {
      result.push({
        kind: "md",

        content:
          restoreCodeBlocks(remain),

        key: result.length,
      });
    }

    return result;

  }, [content, getVizComponent]);
}
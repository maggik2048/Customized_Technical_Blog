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
    }
  | {
      kind: "diff";
      content: string;
      key: number;
    };

export function useParsedPDFContent(
  content: string,
  getVizComponent: (key: string) => any
) {
  return React.useMemo<ParsedPart[]>(() => {
    const result: ParsedPart[] = [];

    /**
     * =========================
     * DIFF BLOCK EXTRACTION
     * =========================
     */

    const diffRegex =
      /```diff\n([\s\S]*?)```/g;

    const parts: {
      type: "md" | "diff";
      content: string;
    }[] = [];

    let lastIndex = 0;

    for (const match of content.matchAll(
      diffRegex
    )) {
      const index = match.index ?? 0;

      /**
       * markdown before diff
       */

      const before = content.slice(
        lastIndex,
        index
      );

      if (before.trim()) {
        parts.push({
          type: "md",
          content: before,
        });
      }

      /**
       * diff content
       */

      parts.push({
        type: "diff",
        content: match[1],
      });

      lastIndex =
        index + match[0].length;
    }

    /**
     * remaining markdown
     */

    const remain =
      content.slice(lastIndex);

    if (remain.trim()) {
      parts.push({
        type: "md",
        content: remain,
      });
    }

    /**
     * =========================
     * PROCESS EACH PART
     * =========================
     */

    for (const part of parts) {
      /**
       * =========================
       * DIFF
       * =========================
       */

      if (part.type === "diff") {
        result.push({
          kind: "diff",

          content: part.content,

          key: result.length,
        });

        continue;
      }

      /**
       * =========================
       * PROTECT CODE BLOCKS
       * =========================
       */

      const codeBlocks: string[] = [];

      const protectedContent =
        part.content.replace(
          /```[\s\S]*?```/g,
          (match: string) => {
            const id =
              codeBlocks.length;

            codeBlocks.push(match);

            return `__CODE_BLOCK_${id}__`;
          }
        );

      /**
       * =========================
       * VIZ TOKEN
       * =========================
       */

      const regex =
        /\[\[VIZ:([A-Za-z_][A-Za-z0-9_]*)\]\]/g;

      const restoreCodeBlocks = (
        text: string
      ) =>
        text.replace(
          /__CODE_BLOCK_(\d+)__/g,
          (_, i) =>
            codeBlocks[
              Number(i)
            ] || ""
        );

      let localLastIndex = 0;

      for (const match of protectedContent.matchAll(
        regex
      )) {
        const fullMatch = match[0];

        const vizName = match[1];

        const index =
          match.index ?? 0;

        /**
         * markdown before token
         */

        const before =
          protectedContent.slice(
            localLastIndex,
            index
          );

        if (before.trim()) {
          result.push({
            kind: "md",

            content:
              restoreCodeBlocks(
                before
              ),

            key: result.length,
          });
        }

        /**
         * viz component
         */

        const Component =
          getVizComponent(vizName);

        if (Component) {
          result.push({
            kind: "viz",

            Component,

            key: result.length,
          });
        } else {
          result.push({
            kind: "md",

            content:
              restoreCodeBlocks(
                fullMatch
              ),

            key: result.length,
          });
        }

        localLastIndex =
          index + fullMatch.length;
      }

      /**
       * remaining markdown
       */

      const remain =
        protectedContent.slice(
          localLastIndex
        );

      if (remain.trim()) {
        result.push({
          kind: "md",

          content:
            restoreCodeBlocks(remain),

          key: result.length,
        });
      }
    }

    return result;
  }, [content, getVizComponent]);
}
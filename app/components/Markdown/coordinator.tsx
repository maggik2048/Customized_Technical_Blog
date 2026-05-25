// app/components/Markdown/coordinator.tsx

import {
  markdownSegmenter,
  Block,
} from "./segmenter";

import { astManager } from "./astManager";

/**
 * =========================================
 * TYPES
 * =========================================
 */

export type PipelineType =
  | "segmented";

export type PipelineResult = {
  pipeline: PipelineType;

  output: string;

  blocks: Block[];
};

/**
 * =========================================
 * MarkdownCoordinator
 * =========================================
 *
 * 역할:
 * pasted mixed-content를
 * segmentation 기반으로 orchestration
 *
 * FLOW:
 *
 * clipboard
 *   ↓
 * coordinator
 *   ↓
 * segmenter
 *   ↓
 * blocks
 *   ↓
 * render markdown
 *
 */

export class MarkdownCoordinator {
  /**
   * =====================================
   * PUBLIC ENTRY
   * =====================================
   */

  processPaste(
    html: string,
    text: string
  ): PipelineResult {
    console.log(
      "================================="
    );

    console.log(
      "[COORDINATOR] PROCESS START"
    );

    console.log(
      "================================="
    );

    /**
     * raw input
     */

    const raw =
      text || html || "";

    console.log(
      "[COORDINATOR] RAW INPUT:"
    );

    console.log(
      JSON.stringify(raw)
    );

    /**
     * =================================
     * SEGMENT
     * =================================
     */

    const blocks =
      markdownSegmenter.segment(
        raw
      );

    console.log(
      "[COORDINATOR] SEGMENTED BLOCKS:"
    );

    console.log(blocks);

    /**
     * =================================
     * AST PRESERVATION
     * =================================
     *
     * code block만 preserve
     */

    const processedBlocks =
      blocks.map((block) => {
        /**
         * markdown block
         */

        if (
          block.type ===
          "markdown"
        ) {
          console.log(
            "[COORDINATOR] MARKDOWN BLOCK"
          );

          return {
            ...block,

            content:
              this.markdownPipeline(
                block.content
              ),
          };
        }

        /**
         * code block
         */

        console.log(
          "[COORDINATOR] CODE BLOCK"
        );

        const preserved =
          astManager.parsePaste(
            "",
            block.content
          );

        return {
          ...block,

          content: preserved,
        };
      });

    console.log(
      "[COORDINATOR] PROCESSED BLOCKS:"
    );

    console.log(
      processedBlocks
    );

    /**
     * =================================
     * FINAL RENDER
     * =================================
     */

    const output =
      markdownSegmenter.renderBlocks(
        processedBlocks
      );

    console.log(
      "[COORDINATOR] FINAL OUTPUT:"
    );

    console.log(
      JSON.stringify(output)
    );

    console.log(
      "================================="
    );

    console.log(
      "[COORDINATOR] PROCESS END"
    );

    console.log(
      "================================="
    );

    return {
      pipeline:
        "segmented",

      output,

      blocks:
        processedBlocks,
    };
  }

  /**
   * =====================================
   * MARKDOWN PIPELINE
   * =====================================
   *
   * prose/text 전용
   */

  markdownPipeline(
    text: string
  ): string {
    console.log(
      "[MARKDOWN PIPELINE] START"
    );

    if (!text) {
      return "";
    }

    let result = text;

    /**
     * normalize line endings
     */

    result =
      result.replace(
        /\r\n/g,
        "\n"
      );

    /**
     * tabs → spaces
     */

    result =
      result.replace(
        /\t/g,
        "  "
      );

    /**
     * excessive newline cleanup
     */

    result =
      result.replace(
        /\n{3,}/g,
        "\n\n"
      );

    /**
     * trailing whitespace cleanup
     */

    result = result
      .split("\n")
      .map((line) =>
        line.replace(
          /\s+$/g,
          ""
        )
      )
      .join("\n");

    console.log(
      "[MARKDOWN PIPELINE] RESULT:"
    );

    console.log(
      JSON.stringify(
        result
      )
    );

    return result;
  }
}

/**
 * =========================================
 * SINGLETON EXPORT
 * =========================================
 */

export const markdownCoordinator =
  new MarkdownCoordinator();
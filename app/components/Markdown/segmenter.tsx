// app/components/Markdown/segmenter.tsx

import {
  snippetDetector,
} from "./detector";

/**
 * =========================================
 * TYPES
 * =========================================
 */

export type MarkdownBlock = {
  type: "markdown";

  content: string;
};

export type CodeBlock = {
  type: "code";

  language?: string;

  content: string;
};

export type Block =
  | MarkdownBlock
  | CodeBlock;

/**
 * =========================================
 * Segmenter
 * =========================================
 *
 * mixed prose/code clipboard content
 * 를 region 기반으로 분리
 *
 * 핵심:
 * line-level detection이 아니라
 * sticky code region parser
 *
 */

export class MarkdownSegmenter {
  /**
   * =====================================
   * MAIN ENTRY
   * =====================================
   */

  segment(
    text: string
  ): Block[] {
    console.log(
      "================================="
    );

    console.log(
      "[SEGMENTER] START"
    );

    console.log(
      "================================="
    );

    if (!text) {
      return [];
    }

    const normalized =
      text.replace(
        /\r\n/g,
        "\n"
      );

    const lines =
      normalized.split("\n");

    console.log(
      "[SEGMENTER] LINES:"
    );

    console.log(lines);

    const blocks: Block[] =
      [];

    let currentLines: string[] =
      [];

    let currentType:
        | "markdown"
        | "code"
        | null = null;

    /**
     * =================================
     * flush helper
     * =================================
     */

    const flush = () => {
      if (
        currentLines.length ===
        0
      ) {
        return;
      }

      const content =
        currentLines.join("\n");

      /**
       * code block
       */

      if (
        currentType === "code"
      ) {
        const language =
          snippetDetector.detectLanguage(
            content
          );

        blocks.push({
          type: "code",

          language,

          content,
        });

        console.log(
          "[SEGMENTER] CODE BLOCK:"
        );

        console.log(content);
      }

      /**
       * markdown block
       */

      else {
        blocks.push({
          type: "markdown",

          content,
        });

        console.log(
          "[SEGMENTER] MARKDOWN BLOCK:"
        );

        console.log(content);
      }

      currentLines = [];

      currentType = null;
    };

    /**
     * =================================
     * REGION PARSER
     * =================================
     */

    for (
      let i = 0;
      i < lines.length;
      i++
    ) {
      const line = lines[i];

      const prev =
        lines[i - 1] || "";

      const next =
        lines[i + 1] || "";

      const isCode =
        this.isCodeLine(line);

      console.log(
        `[SEGMENTER] LINE ${i}:`,
        {
          line,
          isCode,
          currentType,
        }
      );

      /**
       * ===============================
       * initial state
       * ===============================
       */

      if (!currentType) {
        currentType = isCode
          ? "code"
          : "markdown";

        currentLines.push(line);

        continue;
      }

      /**
       * ===============================
       * currently in CODE region
       * ===============================
       */

      if (
        currentType === "code"
      ) {
        const stayCode =
          this.shouldStayCode(
            line,
            prev,
            next
          );

        console.log(
          "[SEGMENTER] stayCode:",
          stayCode
        );

        /**
         * keep growing code region
         */

        if (stayCode) {
          currentLines.push(line);

          continue;
        }

        /**
         * switch to markdown
         */

        flush();

        currentType =
          "markdown";

        currentLines.push(line);

        continue;
      }

      /**
       * ===============================
       * currently in MARKDOWN region
       * ===============================
       */

      if (
        currentType ===
        "markdown"
      ) {
        /**
         * enter code region
         */

        if (isCode) {
          flush();

          currentType =
            "code";

          currentLines.push(line);

          continue;
        }

        /**
         * continue markdown
         */

        currentLines.push(line);

        continue;
      }
    }

    /**
     * final flush
     */

    flush();

    console.log(
      "[SEGMENTER] FINAL BLOCKS:"
    );

    console.log(blocks);

    return blocks;
  }

  /**
   * =====================================
   * STICKY CODE REGION
   * =====================================
   */

  shouldStayCode(
    line: string,
    prev: string,
    next: string
  ): boolean {
    /**
     * blank lines inside code
     */

    if (!line.trim()) {
      return true;
    }

    /**
     * direct code line
     */

    if (
      this.isCodeLine(line)
    ) {
      return true;
    }

    /**
     * indentation continuation
     */

    if (
      /^ {2,}/.test(line)
    ) {
      return true;
    }

    /**
     * python continuation
     */

    if (
      /class |def /.test(prev)
    ) {
      return true;
    }

    /**
     * jsx continuation
     */

    if (
      /<$|>$/.test(prev)
    ) {
      return true;
    }

    /**
     * braces continuation
     */

    if (
      /[{([]\s*$/.test(prev)
    ) {
      return true;
    }

    /**
     * next line still code
     */

    if (
      this.isCodeLine(next)
    ) {
      return true;
    }

    return false;
  }

  /**
   * =====================================
   * CODE LINE DETECTOR
   * =====================================
   */

  isCodeLine(
    line: string
  ): boolean {
    if (!line.trim()) {
      return false;
    }

    /**
     * indentation
     */

    if (
      /^ {2,}|\t+/.test(line)
    ) {
      return true;
    }

    /**
     * braces / semicolons
     */

    if (
      /[{}();]/.test(line)
    ) {
      return true;
    }

    /**
     * operators
     */

    if (
      /=>|==|===|!=|!==/.test(
        line
      )
    ) {
      return true;
    }

    /**
     * keywords
     */

    if (
      /\b(function|class|const|let|var|return|import|export|async|await|if|else|for|while|switch|case|try|catch|interface|type|def|None|self|public|private|protected|static|void|int|string|float|double|new)\b/.test(
        line
      )
    ) {
      return true;
    }

    /**
     * jsx/html
     */

    if (
      /<\/?[A-Za-z]/.test(
        line
      )
    ) {
      return true;
    }

    /**
     * python colon blocks
     */

    if (
      /:\s*$/.test(line)
    ) {
      return true;
    }

    return false;
  }

  /**
   * =====================================
   * RENDER BLOCKS
   * =====================================
   */

  renderBlocks(
    blocks: Block[]
  ): string {
    return blocks
      .map((block) => {
        /**
         * markdown
         */

        if (
          block.type ===
          "markdown"
        ) {
          return block.content;
        }

        /**
         * code
         */

        const language =
          block.language || "";

        return (
          `\`\`\`${language}\n` +
          block.content +
          `\n\`\`\``
        );
      })
      .join("\n\n");
  }
}

/**
 * =========================================
 * singleton
 * =========================================
 */

export const markdownSegmenter =
  new MarkdownSegmenter();
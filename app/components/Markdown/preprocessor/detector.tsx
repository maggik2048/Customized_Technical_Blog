// app/components/Markdown/detector.tsx

/**
 * =========================================
 * Snippet Detector
 * =========================================
 *
 * 역할:
 * pasted content가
 * - code snippet 인지
 * - 일반 markdown/prose 인지
 * 판별
 *
 * AST preserve pipeline routing용 detector
 */

export type SnippetType =
  | "code"
  | "markdown";

export type DetectionResult = {
  type: SnippetType;

  confidence: number;

  language?: string;

  reasons: string[];
};

export class SnippetDetector {
  /**
   * public entry
   */
  detect(
    text: string
  ): DetectionResult {
    if (!text) {
      return {
        type: "markdown",
        confidence: 0,
        reasons: [
          "empty input",
        ],
      };
    }

    const reasons: string[] =
      [];

    let score = 0;

    /**
     * =====================================
     * line analysis
     * =====================================
     */

    const lines =
      text.split("\n");

    const nonEmptyLines =
      lines.filter(
        (line) =>
          line.trim() !== ""
      );

    /**
     * indentation
     */

    const indentedLines =
      nonEmptyLines.filter(
        (line) =>
          /^ {2,}|\t+/.test(
            line
          )
      );

    if (
      indentedLines.length >= 3
    ) {
      score += 2;

      reasons.push(
        "multiple indented lines"
      );
    }

    /**
     * bracket density
     */

    const bracketCount = (
      text.match(/[{}()[\]]/g) ||
      []
    ).length;

    if (bracketCount >= 6) {
      score += 2;

      reasons.push(
        "high bracket density"
      );
    }

    /**
     * semicolon density
     */

    const semicolonCount = (
      text.match(/;/g) || []
    ).length;

    if (semicolonCount >= 2) {
      score += 1;

      reasons.push(
        "semicolon usage"
      );
    }

    /**
     * jsx / html
     */

    if (
      /<\/?[A-Z][^>]*>|<\/?[a-z][^>]*>/.test(
        text
      )
    ) {
      score += 3;

      reasons.push(
        "jsx/html pattern"
      );
    }

    /**
     * common programming keywords
     */

    const keywordRegex =
      /\b(function|class|const|let|var|return|import|export|async|await|if|else|for|while|switch|case|try|catch|interface|type|public|private|void|int|string|bool|None|def)\b/g;

    const keywordMatches =
      text.match(keywordRegex);

    if (
      keywordMatches &&
      keywordMatches.length >= 2
    ) {
      score += 3;

      reasons.push(
        "programming keywords"
      );
    }

    /**
     * operators
     */

    const operatorCount = (
      text.match(
        /=>|==|===|!=|!==|\+\+|--|\|\||&&|:=|::/g
      ) || []
    ).length;

    if (operatorCount >= 1) {
      score += 2;

      reasons.push(
        "programming operators"
      );
    }

    /**
     * multiline structure
     */

    if (
      nonEmptyLines.length >= 5
    ) {
      score += 1;

      reasons.push(
        "multiline structure"
      );
    }

    /**
     * markdown prose penalty
     */

    const proseLike =
      /^# |\n# |\n- |\n\* |\n\d+\. /m.test(
        text
      );

    if (proseLike) {
      score -= 2;

      reasons.push(
        "markdown prose pattern"
      );
    }

    /**
     * language detection
     */

    const language =
      this.detectLanguage(text);

    if (language) {
      reasons.push(
        `language:${language}`
      );
    }

    /**
     * final classification
     */

    const isCode =
      score >= 4;

    return {
      type: isCode
        ? "code"
        : "markdown",

      confidence:
        Math.min(
          1,
          score / 10
        ),

      language,

      reasons,
    };
  }

  /**
   * language detection
   */

  detectLanguage(
    text: string
  ): string | undefined {
    /**
     * TypeScript / TSX
     */

    if (
      /interface |type |React\.|useState|useEffect|tsx|:\s*string|:\s*number/.test(
        text
      )
    ) {
      return "tsx";
    }

    /**
     * JavaScript
     */

    if (
      /const |let |var |=>|function /.test(
        text
      )
    ) {
      return "javascript";
    }

    /**
     * Python
     */

    if (
      /def |import |print\(|self|None|True|False/.test(
        text
      )
    ) {
      return "python";
    }

    /**
     * C++
     */

    if (
      /#include|std::|cout|cin|int main/.test(
        text
      )
    ) {
      return "cpp";
    }

    /**
     * Java
     */

    if (
      /public class|System\.out\.println/.test(
        text
      )
    ) {
      return "java";
    }

    /**
     * HTML
     */

    if (
      /<\/?[a-z][^>]*>/.test(
        text
      )
    ) {
      return "html";
    }

    /**
     * CSS
     */

    if (
      /{[\s\S]*:[\s\S]*;/.test(
        text
      )
    ) {
      return "css";
    }

    return undefined;
  }

  /**
   * fenced code wrapper
   */

  wrapCodeFence(
    text: string,
    language?: string
  ) {
    const lang =
      language || "";

    return (
      `\`\`\`${lang}\n` +
      text +
      `\n\`\`\``
    );
  }
}

/**
 * singleton export
 */

export const snippetDetector =
  new SnippetDetector();
/**
 * astManager.tsx
 * markdown / AST preservation manager
 */

export class ASTManager {
  /**
   * normalize only
   * formatting / indentation 절대 건드리지 않음
   */
  normalize(input: string): string {
    if (!input || typeof input !== "string") {
      return "";
    }

    // CRLF -> LF only
    return input.replace(/\r\n/g, "\n");
  }

  /**
   * legacy compatibility
   * 기존 API 유지용
   * 현재는 실제 변환 안 함
   */
  spaceToLineBreak(input: string): string {
    return this.normalize(input);
  }

  /**
   * markdown parse entry
   */
  parse(input: string) {
    const normalized =
      this.normalize(input);

    return {
      raw: input,
      normalized,
      lines:
        normalized.split("\n"),
    };
  }

  /**
   * markdown render
   */
  render(input: string): string {
    return this.normalize(input);
  }

  /**
   * paste parser
   * indentation / whitespace 보존
   */
  parsePaste(
    html: string,
    text: string
  ): string {
    return this.normalize(
      text || html || ""
    );
  }
}

/**
 * singleton export
 */
export const astManager =
  new ASTManager();

/**
 * legacy export compatibility
 */
export function spaceToLineBreak(
  input: string
): string {
  return astManager.spaceToLineBreak(
    input
  );
}

export function parseMarkdown(
  input: string
) {
  return astManager.parse(input);
}

export function renderMarkdown(
  input: string
) {
  return astManager.render(input);
}
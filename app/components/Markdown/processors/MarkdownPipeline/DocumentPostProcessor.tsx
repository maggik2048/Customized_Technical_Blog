// DocumentPostProcessor.ts

export class DocumentPostProcessor {
  /**
   * ONLY ENTRY POINT
   */
  static process(input: string): string {
    if (!input) return "";

    let out = input;

    out = this.removeEmojis(out);
    out = this.removePronouns(out);
    out = this.normalize(out);
    out = this.trimSpaces(out);

    return out;
  }

  /**
   * emoji + symbol cleanup
   *
   * removes:
   * - emoji presentation chars
   * - extended pictographic symbols
   * - variation selectors
   * - zero width joiners
   */
  private static removeEmojis(
    text: string
  ): string {
    return text.replace(
      /[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F\u200D]/gu,
      ""
    );
  }

  /**
   * removes target pronouns / words
   *
   * removes:
   * - 니가
   * - 네가
   * - 네
   * - 니
   * - your
   */
  private static removePronouns(
    text: string
  ): string {
    return text.replace(
      /\b(?:your)\b|니가|네가|네|니/giu,
      ""
    );
  }

  /**
   * markdown noise cleanup
   */
  private static normalize(
    text: string
  ): string {
    return text
      .replace(/\r/g, "")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  /**
   * trailing space cleanup
   */
  private static trimSpaces(
    text: string
  ): string {
    return text.replace(
      /[ \t]+$/gm,
      ""
    );
  }
}
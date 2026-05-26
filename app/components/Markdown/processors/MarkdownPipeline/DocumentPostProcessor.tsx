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
    out = this.normalizeSentenceEnding(out);
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
   * removes only when separated by spaces
   *
   * examples:
   * - "지금 너의 코드" -> "지금 코드"
   * - "you are good" -> "are good"
   * - "아니라" -> untouched
   */
  private static removePronouns(
    text: string
  ): string {
    return text.replace(
      /(^|\s)(?:you|your|니가|네가|너의|너|네|니)(?=\s|$)/giu,
      "$1"
    );
  }

  /**
   * normalizes korean casual sentence ending
   *
   * examples:
   * - "이거 하나야" -> "이거 하나이다."
   * - "그거야." -> "그거이다."
   * - "진짜야 " -> "진짜이다. "
   */
  private static normalizeSentenceEnding(
    text: string
  ): string {
    return text.replace(
      /야(?=\s|$|[.?!])/g,
      "이다."
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
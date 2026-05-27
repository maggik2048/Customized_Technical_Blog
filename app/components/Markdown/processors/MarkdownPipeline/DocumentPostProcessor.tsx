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
    out = this.normalizeBoxNumbers(out);
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
      /(^|\s)(?:you|your|니가|네가|너의|너한테|너한텐|너에게|너에겐|너|네|니)(?=\s|$)/giu,
      "$1"
    );
  }

  /**
   * normalizes korean casual sentence ending
   *
   * converts:
   * - "~야."   -> "~이다."
   * - "~야!"   -> "~이다!"
   * - "~야?"   -> "~이다?"
   * - "~야..." -> "~이다..."
   *
   * untouched:
   * - "해야 한다"
   * - "가야 한다"
   * - "먹어야 함"
   *
   * fixes:
   * - "치환이야!" -> "치환이다!"
   *   NOT "치환이이다!"
   */
  private static normalizeSentenceEnding(
    text: string
  ): string {
    return text.replace(
      /([가-힣]+?)야(?=(?:\.\.\.|[.?!]|$))/g,
      (_, word: string) => {
        if (word.endsWith("이")) {
          return `${word}다`;
        }

        return `${word}이다`;
      }
    );
  }

  /**
   * converts boxed unicode numbers into markdown list style
   *
   * examples:
   * - "2⃣ 테스트" -> "2. 테스트"
   * - "3⃣ hello" -> "3. hello"
   */
  private static normalizeBoxNumbers(
    text: string
  ): string {
    return text
      .replace(/0⃣/g, "0. ")
      .replace(/1⃣/g, "1. ")
      .replace(/2⃣/g, "2. ")
      .replace(/3⃣/g, "3. ")
      .replace(/4⃣/g, "4. ")
      .replace(/5⃣/g, "5. ")
      .replace(/6⃣/g, "6. ")
      .replace(/7⃣/g, "7. ")
      .replace(/8⃣/g, "8. ")
      .replace(/9⃣/g, "9. ");
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
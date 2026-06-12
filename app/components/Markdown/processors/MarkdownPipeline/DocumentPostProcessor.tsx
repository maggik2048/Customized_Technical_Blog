export class DocumentPostProcessor {
  static process(input: string): string {
    if (!input) return "";

    let out = input;

    out = this.removeEmojis(out);

    out = this.transformKoreanPerspective(out);
    out = this.transformEnglishPerspective(out);
    out = this.transformFrenchPerspective(out);

    out = this.transformRecommendationWords(out);

    out = this.normalizeSentenceEnding(out);
    out = this.normalizeBoxNumbers(out);

    out = this.normalize(out);
    out = this.trimSpaces(out);

    return out;
  }

  /**
   * emoji cleanup
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
   * korean perspective cleanup
   */
  private static transformKoreanPerspective(
    text: string
  ): string {
    return text

      // phrase replacements
      .replace(/너의 코드/g, "이 코드")
      .replace(/네 코드/g, "이 코드")
      .replace(/니 코드/g, "이 코드")

      .replace(/너의 프로젝트/g, "이 프로젝트")
      .replace(/네 프로젝트/g, "이 프로젝트")
      .replace(/니 프로젝트/g, "이 프로젝트")

      .replace(/너의 구현/g, "이 구현")
      .replace(/네 구현/g, "이 구현")
      .replace(/니 구현/g, "이 구현")

      // pronouns
      .replace(
        /(^|\s)(?:니가|네가|너의|너한테|너한텐|너에게|너는|너에겐|너|네|니)(?=\s|$)/giu,
        "$1"
      );
  }

  /**
   * english perspective cleanup
   */
  private static transformEnglishPerspective(
    text: string
  ): string {
    return text

      // common noun phrases
      .replace(/\byour code\b/giu, "this code")
      .replace(/\byour project\b/giu, "this project")
      .replace(/\byour implementation\b/giu, "this implementation")
      .replace(/\byour solution\b/giu, "this solution")
      .replace(/\byour design\b/giu, "this design")
      .replace(/\byour approach\b/giu, "this approach")
      .replace(/\byour architecture\b/giu, "this architecture")
      .replace(/\byour application\b/giu, "this application")
      .replace(/\byour system\b/giu, "this system")
      .replace(/\byour logic\b/giu, "this logic")
      .replace(/\byour algorithm\b/giu, "this algorithm")
      .replace(/\byour idea\b/giu, "this idea")
      .replace(/\byour configuration\b/giu, "this configuration")

      // sentences
      .replace(/\byou should\b/giu, "it may be beneficial to")
      .replace(/\byou can\b/giu, "it is possible to")
      .replace(/\byou need to\b/giu, "it is necessary to")
      .replace(/\byou must\b/giu, "it is required to")
      .replace(/\byou are\b/giu, "")
      .replace(/\byou\b/giu, "")

      // generic possessive
      .replace(/\byour\b/giu, "this");
  }

  /**
   * french perspective cleanup
   */
  private static transformFrenchPerspective(
    text: string
  ): string {
    return text

      .replace(/\bton code\b/giu, "ce code")
      .replace(/\bton projet\b/giu, "ce projet")
      .replace(/\bton système\b/giu, "ce système")
      .replace(/\bton systeme\b/giu, "ce système")

      .replace(/\bta solution\b/giu, "cette solution")
      .replace(/\bta conception\b/giu, "cette conception")
      .replace(/\bta logique\b/giu, "cette logique")

      .replace(/\btes idées\b/giu, "ces idées")
      .replace(/\btes configurations\b/giu, "ces configurations")

      .replace(/\btu peux\b/giu, "il est possible de")
      .replace(/\btu dois\b/giu, "il est nécessaire de")
      .replace(/\btu devrais\b/giu, "il serait préférable de")

      .replace(/\btu\b/giu, "")
      .replace(/\btoi\b/giu, "")

      .replace(/\bton\b/giu, "ce")
      .replace(/\bta\b/giu, "cette")
      .replace(/\btes\b/giu, "ces")
      .replace(/\bvotre\b/giu, "ce");
  }

  /**
   * recommendation -> consideration
   */
  private static transformRecommendationWords(
    text: string
  ): string {
    return text

      // korean
      .replace(/추천중/g, "고려중")
      .replace(/추천하는/g, "고려중인")
      .replace(/추천됨/g, "고려됨")
      .replace(/추천함/g, "고려함")
      .replace(/추천/g, "고려")

      // english
      .replace(
        /\bhighly recommended\b/giu,
        "strongly considered"
      )
      .replace(
        /\brecommendations\b/giu,
        "considerations"
      )
      .replace(
        /\brecommendation\b/giu,
        "consideration"
      )
      .replace(
        /\brecommended\b/giu,
        "being considered"
      )
      .replace(
        /\brecommending\b/giu,
        "considering"
      )
      .replace(
        /\brecommends\b/giu,
        "considers"
      )
      .replace(
        /\brecommend\b/giu,
        "consider"
      )

      // french
      .replace(
        /\brecommandations\b/giu,
        "considérations"
      )
      .replace(
        /\brecommandation\b/giu,
        "considération"
      )
      .replace(
        /\brecommandé\b/giu,
        "envisagé"
      )
      .replace(
        /\brecommande\b/giu,
        "envisage"
      );
  }

  /**
   * korean sentence ending normalization
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
   * boxed number normalization
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
   * whitespace cleanup
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
   * trailing spaces
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
console.log("=================================");
console.log("INJECT SCRIPT LOADED");
console.log("CURRENT URL:", location.href);
console.log(
  "TIME:",
  new Date().toISOString()
);
console.log("=================================");

/* =========================================
   TABLE → MARKDOWN
========================================= */

function tableToMarkdown(table) {
  const rows = Array.from(
    table.querySelectorAll("tr")
  );

  if (!rows.length) return "";

  const parsedRows = rows.map((row) => {
    const cells = Array.from(
      row.querySelectorAll("th, td")
    );

    return cells.map(
      (c) => c.textContent?.trim() || ""
    );
  });

  const header = parsedRows[0] || [];
  const body = parsedRows.slice(1);

  let md = "";

  if (header.length) {
    md += `| ${header.join(" | ")} |\n`;

    md += `| ${header
      .map(() => "---")
      .join(" | ")} |\n`;
  }

  body.forEach((r) => {
    md += `| ${r.join(" | ")} |\n`;
  });

  return md + "\n";
}

/* =========================================
   HTML → MARKDOWN
========================================= */

function htmlToMarkdown(html) {
  const doc = new DOMParser().parseFromString(
    html,
    "text/html"
  );

  let out = "";

  const walk = (node) => {
    /**
     * TEXT NODE
     */

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";

      if (!text.trim()) {
        return;
      }

      out += text;

      return;
    }

    const el = node;

    switch (el.tagName) {
      /**
       * HEADINGS
       */

      case "H1":
        out += "\n# ";

        el.childNodes.forEach(walk);

        out += "\n\n";

        return;

      case "H2":
        out += "\n## ";

        el.childNodes.forEach(walk);

        out += "\n\n";

        return;

      case "H3":
        out += "\n### ";

        el.childNodes.forEach(walk);

        out += "\n\n";

        return;

      /**
       * PARAGRAPH
       */

      case "P":
        if (
          el.parentElement?.tagName === "LI"
        ) {
          el.childNodes.forEach(walk);
          return;
        }

        out += "\n";

        el.childNodes.forEach(walk);

        out += "\n\n";

        return;

      /**
       * DIV
       */

      case "DIV": {
        const hasBlockChild = Array.from(
          el.children
        ).some((child) =>
          [
            "DIV",
            "P",
            "H1",
            "H2",
            "H3",
            "UL",
            "OL",
            "TABLE",
            "PRE",
            "CODE",
          ].includes(child.tagName)
        );

        if (hasBlockChild) {
          el.childNodes.forEach(walk);

          if (!out.endsWith("\n\n")) {
            out += "\n";
          }

          return;
        }

        const text =
          el.textContent?.trim();

        if (text) {
          out += `${text}\n\n`;
        }

        return;
      }

      /**
       * SPAN
       */

      case "SPAN": {
        const text =
          el.textContent || "";

        out += text;

        return;
      }

      /**
       * BR
       */

      case "BR":
        out += "\n";
        return;


      case "HR":
        out += "\n---\n\n";
        return;  

      /**
       * STRONG
       */

      case "STRONG":
      case "B":
        out += "**";

        el.childNodes.forEach(walk);

        out += "**";

        return;

      /**
       * EMPHASIS
       */

      case "EM":
      case "I":
        out += "*";

        el.childNodes.forEach(walk);

        out += "*";

        return;

      /**
       * UL
       */

      case "UL":
        Array.from(el.children).forEach(
          (li) => {
            out += "- ";

            li.childNodes.forEach(walk);

            out += "\n";
          }
        );

        out += "\n";

        return;

      /**
       * OL
       */

      case "OL":
        Array.from(el.children).forEach(
          (li, idx) => {
            out += `${idx + 1}. `;

            li.childNodes.forEach(walk);

            out += "\n";
          }
        );

        out += "\n";

        return;

      /**
       * LI
       */

      case "LI":

        console.log(
          "LI HTML:",
          el.outerHTML
        );

        console.log(
          "LI CHILDREN:",
          Array.from(el.children).map(
            (c) => c.tagName
          )
        );        

        out += "- ";

        el.childNodes.forEach(walk);

        out += "\n";

        return;

      /**
       * TABLE
       */

      case "TABLE":
        out +=
          "\n" +
          tableToMarkdown(el) +
          "\n";

        return;

      /**
       * PRE
       */

      case "PRE": {
        /**
         * GPT 내부 HTML 유지
         */

        const rawHtml =
          el.innerHTML || "";

        /**
         * <br> -> newline
         */

        const withBreaks =
          rawHtml.replace(
            /<br\s*\/?>/gi,
            "\n"
          );

        /**
         * HTML decode
         */

        const temp =
          document.createElement(
            "div"
          );

        temp.innerHTML =
          withBreaks;

        /**
         * 실제 코드 추출
         */

        let code =
          temp.textContent || "";

        /**
         * trim
         */

        code = code
          .replace(/^\n+/, "")
          .replace(/\n+$/, "");

        /**
         * language 추출
         */

        let language = "";

        const langElement =
          el.querySelector(
            ".text-sm.font-medium"
          );

        if (langElement) {
          language =
            langElement.textContent?.trim() ||
            "";
        }

        /**
         * 맨 앞 중복 language 제거
         *
         * 예:
         * C++#include ...
         */

        if (
          language &&
          code.startsWith(language)
        ) {
          code = code.slice(
            language.length
          );
        }

        /**
         * markdown fenced block
         */

        out += `\n\`\`\`${language.toLowerCase()}\n${code}\n\`\`\`\n`;

        return;
      }

      /**
       * INLINE CODE
       */

      case "CODE":
        out += `\`${el.textContent}\``;
        return;

      /**
       * LINK
       */

      case "A": {
        const href =
          el.getAttribute("href");

        const text =
          el.textContent?.trim();

        if (href && text) {
          out += `[${text}](${href})`;
        }

        return;
      }

      /**
       * IMAGE
       */

      case "IMG": {
        const src =
          el.getAttribute("src");

        if (src) {
          out += `![](${src})`;
        }

        return;
      }

      /**
       * DEFAULT
       */

      default:
        el.childNodes.forEach(walk);
    }
  };

  doc.body.childNodes.forEach(walk);

  return out
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/* =========================================
   STORAGE LOAD
========================================= */

console.log(
  "STARTING STORAGE READ"
);

chrome.storage.local.get(
  ["latestFinalHTML"],
  (result) => {
    console.log("=================================");
    console.log("STORAGE CALLBACK FIRED");
    console.log("=================================");

    console.log(
      "RAW STORAGE RESULT:"
    );

    console.log(result);

    const html =
      result.latestFinalHTML;

    if (!html) {
      console.log(
        "NO latestFinalHTML"
      );

      return;
    }

    console.log("HTML FOUND:");
    console.log(html);

    /**
     * =====================================
     * HTML -> MARKDOWN
     * =====================================
     */

    const markdown =
      htmlToMarkdown(html);

    console.log(
      "================================="
    );

    console.log(
      "CONVERTED MARKDOWN:"
    );

    console.log(
      "================================="
    );

    console.log(markdown);

    /**
     * =====================================
     * WAIT FOR REACT HYDRATION
     * =====================================
     */

    setTimeout(() => {
      console.log(
        "POSTING GPT_MARKDOWN..."
      );

      window.postMessage(
        {
          type: "GPT_MARKDOWN",

          payload: markdown,
        },
        "*"
      );

      console.log(
        "GPT_MARKDOWN POSTED"
      );
    }, 1500);
  }
);
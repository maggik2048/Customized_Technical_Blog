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
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";

      out += text;

      return;
    }

    const el = node;

    switch (el.tagName) {
      case "H1":
        out += `\n# ${el.textContent?.trim()}\n\n`;
        return;

      case "H2":
        out += `\n## ${el.textContent?.trim()}\n\n`;
        return;

      case "H3":
        out += `\n### ${el.textContent?.trim()}\n\n`;
        return;

      case "P":
        out += `\n${el.textContent?.trim()}\n\n`;
        return;

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

      case "SPAN": {
        const text =
          el.textContent || "";

        out += text;

        return;
      }

      case "BR":
        out += "\n";
        return;

      case "STRONG":
      case "B":
        out += `**${el.textContent}**`;
        return;

      case "EM":
      case "I":
        out += `*${el.textContent}*`;
        return;

      case "UL":
        Array.from(el.children).forEach(
          (li) => {
            out += `- ${li.textContent?.trim()}\n`;
          }
        );

        out += "\n";

        return;

      case "OL":
        Array.from(el.children).forEach(
          (li, idx) => {
            out += `${idx + 1}. ${li.textContent?.trim()}\n`;
          }
        );

        out += "\n";

        return;

      case "LI":
        out += `- ${el.textContent?.trim()}\n`;
        return;

      case "TABLE":
        out +=
          "\n" +
          tableToMarkdown(el) +
          "\n";

        return;

      case "PRE":
        out += `\n\`\`\`\n${el.textContent}\n\`\`\`\n`;
        return;

      case "CODE":
        out += `\`${el.textContent}\``;
        return;

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

      case "IMG": {
        const src =
          el.getAttribute("src");

        if (src) {
          out += `![](${src})`;
        }

        return;
      }

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
   INJECT TO TEXTAREA
========================================= */

function injectToEditor(text) {
  console.log(
    "injectToEditor CALLED"
  );

  const textarea =
    document.querySelector("textarea");

  if (!textarea) {
    console.log("TEXTAREA NOT FOUND");
    return false;
  }

  console.log("TEXTAREA FOUND");

  const nativeSetter =
    Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    )?.set;

  if (!nativeSetter) {
    console.log(
      "NATIVE SETTER NOT FOUND"
    );

    return false;
  }

  nativeSetter.call(textarea, text);

  textarea.dispatchEvent(
    new Event("input", {
      bubbles: true,
    })
  );

  console.log(
    "TEXTAREA VALUE AFTER:"
  );

  console.log(textarea.value);

  console.log("INJECTION SUCCESS");

  return true;
}

/* =========================================
   WAIT FOR EDITOR
========================================= */

function waitForEditorAndInject(text) {
  console.log("WAITING FOR EDITOR");

  let tries = 0;

  const interval = setInterval(() => {
    tries++;

    console.log("TRY:", tries);

    const success =
      injectToEditor(text);

    if (success) {
      clearInterval(interval);

      console.log("DONE");
    }

    if (tries >= 40) {
      clearInterval(interval);

      console.log(
        "FAILED MAX RETRY"
      );
    }
  }, 500);
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

    waitForEditorAndInject(
      markdown
    );
  }
);
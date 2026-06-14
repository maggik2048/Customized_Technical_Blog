console.log("=================================");
console.log("INJECT SCRIPT LOADED");
console.log("CURRENT URL:", location.href);
console.log("TIME:", new Date().toISOString());
console.log("=================================");

/* =========================================
   TABLE → MARKDOWN
========================================= */

function tableToMarkdown(table) {
  const rows = Array.from(table.querySelectorAll("tr"));

  if (!rows.length) return "";

  const parsedRows = rows.map((row) => {
    const cells = Array.from(row.querySelectorAll("th, td"));

    return cells.map((c) => c.textContent?.trim() || "");
  });

  const header = parsedRows[0] || [];
  const body = parsedRows.slice(1);

  let md = "";

  if (header.length) {
    md += `| ${header.join(" | ")} |\n`;
    md += `| ${header.map(() => "---").join(" | ")} |\n`;
  }

  body.forEach((r) => {
    md += `| ${r.join(" | ")} |\n`;
  });

  return md + "\n";
}

/* =========================================
   ROUTE EXPORT HOOK (NEW ADD ONLY)
   =========================================
   👉 여기만 “확장 포인트”
========================================= */

function routeExport(markdown) {
  /**
   * 기본 fallback (기존 동작 유지)
   * → 지금은 GPT로 간주
   */
  window.postMessage(
    {
      type: "GPT_MARKDOWN",
      payload: markdown,
    },
    "*"
  );
}

/* =========================================
   HTML → MARKDOWN
========================================= */

function htmlToMarkdown(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");

  let out = "";

  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";

      if (!text.trim()) return;

      out += text;
      return;
    }

    const el = node;

    switch (el.tagName) {
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

      case "P":
        if (el.parentElement?.tagName === "LI") {
          el.childNodes.forEach(walk);
          return;
        }

        out += "\n";
        el.childNodes.forEach(walk);
        out += "\n\n";
        return;

      case "DIV": {
        const hasBlockChild = Array.from(el.children).some((child) =>
          ["DIV", "P", "H1", "H2", "H3", "UL", "OL", "TABLE", "PRE", "CODE"].includes(
            child.tagName
          )
        );

        if (hasBlockChild) {
          el.childNodes.forEach(walk);
          if (!out.endsWith("\n\n")) out += "\n";
          return;
        }

        const text = el.textContent?.trim();
        if (text) out += `${text}\n\n`;

        return;
      }

      case "SPAN": {
        const text = el.textContent || "";
        out += text;
        return;
      }

      case "BR":
        out += "\n";
        return;

      case "HR":
        out += "\n---\n\n";
        return;

      case "STRONG":
      case "B":
        out += "**";
        el.childNodes.forEach(walk);
        out += "**";
        return;

      case "EM":
      case "I":
        out += "*";
        el.childNodes.forEach(walk);
        out += "*";
        return;

      case "UL":
        Array.from(el.children).forEach((li) => {
          out += "- ";
          li.childNodes.forEach(walk);
          out += "\n";
        });
        out += "\n";
        return;

      case "OL":
        Array.from(el.children).forEach((li, idx) => {
          out += `${idx + 1}. `;
          li.childNodes.forEach(walk);
          out += "\n";
        });
        out += "\n";
        return;

      case "LI":
        console.log("LI HTML:", el.outerHTML);
        console.log(
          "LI CHILDREN:",
          Array.from(el.children).map((c) => c.tagName)
        );

        out += "- ";
        el.childNodes.forEach(walk);
        out += "\n";
        return;

      case "TABLE":
        out += "\n" + tableToMarkdown(el) + "\n";
        return;

      case "PRE": {
        const rawHtml = el.innerHTML || "";

        const withBreaks = rawHtml.replace(/<br\s*\/?>/gi, "\n");

        const temp = document.createElement("div");
        temp.innerHTML = withBreaks;

        let code = temp.textContent || "";

        code = code.replace(/^\n+/, "").replace(/\n+$/, "");

        let language = "";

        const langElement = el.querySelector(".text-sm.font-medium");
        if (langElement) {
          language = langElement.textContent?.trim() || "";
        }

        if (language && code.startsWith(language)) {
          code = code.slice(language.length);
        }

        out += `\n\`\`\`${language.toLowerCase()}\n${code}\n\`\`\`\n`;
        return;
      }

      case "CODE":
        console.log("CODE PARENT:", el.parentElement?.tagName);
        out += `\`${el.textContent}\``;
        return;

      case "A": {
        const href = el.getAttribute("href");
        const text = el.textContent?.trim();

        if (href && text) {
          out += `[${text}](${href})`;
        }

        return;
      }

      case "IMG": {
        const src = el.getAttribute("src");

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

  return out.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim();
}

/* =========================================
   STORAGE LOAD
========================================= */

console.log("STARTING STORAGE READ");

chrome.storage.local.get(["latestFinalHTML"], (result) => {
  console.log("=================================");
  console.log("STORAGE CALLBACK FIRED");
  console.log("=================================");
  console.log("RAW STORAGE RESULT:");
  console.log(result);

  const html = result.latestFinalHTML;

  if (!html) {
    console.log("NO latestFinalHTML");
    return;
  }

  console.log("HTML FOUND:");
  console.log(html);

  /* =========================================
     HTML → MARKDOWN
  ========================================= */

  const markdown = htmlToMarkdown(html);

  console.log("=================================");
  console.log("CONVERTED MARKDOWN:");
  console.log("=================================");
  console.log(markdown);

  /* =========================================
     EXPORT ROUTE (ONLY CHANGE POINT)
  ========================================= */

  setTimeout(() => {
    console.log("POSTING GPT_MARKDOWN...");

    routeExport(markdown);

    console.log("GPT_MARKDOWN POSTED");
  }, 1500);
});
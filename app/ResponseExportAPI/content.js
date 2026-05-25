console.log("=================================");
console.log("EXTENSION LOADED");
console.log("CURRENT URL:", location.href);
console.log("TIME:", new Date().toISOString());
console.log("=================================");

// ==========================================
// HTML → MARKDOWN
// ==========================================

function htmlToMarkdown(html) {
  const doc = new DOMParser().parseFromString(
    html,
    "text/html"
  );

  let out = "";

  const walk = (node) => {
    // ======================
    // TEXT NODE
    // ======================

    if (node.nodeType === Node.TEXT_NODE) {
      out += node.textContent || "";
      return;
    }

    const el = node;

    // ======================
    // TAG HANDLING
    // ======================

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
        Array.from(el.children).forEach((li) => {
          out += `- ${li.textContent?.trim()}\n`;
        });

        out += "\n";
        return;

      case "OL":
        Array.from(el.children).forEach((li, idx) => {
          out += `${idx + 1}. ${li.textContent?.trim()}\n`;
        });

        out += "\n";
        return;

      case "PRE":
      case "CODE":
        out += `\n\`\`\`\n${el.textContent || ""}\n\`\`\`\n`;
        return;

      case "BLOCKQUOTE":
        out += `\n> ${el.textContent?.trim()}\n\n`;
        return;

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

// ==========================================
// GET LAST ASSISTANT MESSAGE
// ==========================================

function getLastAssistantMessage() {
  const messages = document.querySelectorAll(
    '[data-message-author-role="assistant"]'
  );

  if (!messages.length) {
    console.log("NO ASSISTANT MESSAGE FOUND");
    return null;
  }

  return messages[messages.length - 1];
}

// ==========================================
// STATE
// ==========================================

let lastMarkdown = "";
let debounceTimer = null;

// ==========================================
// OBSERVER
// ==========================================

const observer = new MutationObserver(() => {
  const lastMsg = getLastAssistantMessage();

  if (!lastMsg) return;

  // ======================================
  // TRY TO FIND MARKDOWN ROOT
  // ======================================

  const markdownRoot =
    lastMsg.querySelector(".markdown") || lastMsg;

  const html = markdownRoot.innerHTML;

  if (!html) return;

  // ======================================
  // HTML → MARKDOWN
  // ======================================

  const markdown = htmlToMarkdown(html);

  if (!markdown) return;

  // ======================================
  // STREAM UPDATE
  // ======================================

  if (markdown !== lastMarkdown) {
    lastMarkdown = markdown;

    console.log("=================================");
    console.log("STREAM MARKDOWN UPDATE:");
    console.log(markdown);
    console.log("=================================");
  }

  // ======================================
  // FINAL DETECTION
  // ======================================

  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    console.log("=================================");
    console.log("FINAL MARKDOWN MESSAGE:");
    console.log(lastMarkdown);
    console.log("=================================");

    // ======================================
    // STORAGE SAVE
    // ======================================

    chrome.storage.local.set(
      {
        latestFinalMessage: lastMarkdown,
      },
      () => {
        if (chrome.runtime.lastError) {
          console.log("STORAGE ERROR:");
          console.log(chrome.runtime.lastError);
          return;
        }

        console.log("STORAGE SAVE SUCCESS");

        // ======================================
        // OPEN WRITE PAGE
        // ======================================

        window.open(
          "http://localhost:3000/admin/write",
          "_blank"
        );
      }
    );
  }, 1500);
});

// ==========================================
// START OBSERVER
// ==========================================

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true,
});

console.log("OBSERVER STARTED");
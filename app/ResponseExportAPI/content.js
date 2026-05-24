console.log("=================================");
console.log("EXTENSION LOADED");
console.log("CURRENT URL:", location.href);
console.log("TIME:", new Date().toISOString());
console.log("=================================");

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

  console.log("ASSISTANT MESSAGE COUNT:", messages.length);

  return messages[messages.length - 1];
}

// ==========================================
// STATE
// ==========================================

let lastText = "";
let debounceTimer = null;

// ==========================================
// OBSERVER
// ==========================================

const observer = new MutationObserver(() => {
  const lastMsg = getLastAssistantMessage();

  if (!lastMsg) return;

  const text = lastMsg.innerText?.trim();

  if (!text) {
    console.log("EMPTY TEXT");
    return;
  }

  // ======================================
  // STREAM UPDATE
  // ======================================

  if (text !== lastText) {
    lastText = text;

    console.log("=================================");
    console.log("STREAM UPDATE:");
    console.log(text);
    console.log("=================================");
  }

  // ======================================
  // FINAL DETECTION
  // ======================================

  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    console.log("=================================");
    console.log("FINAL ASSISTANT MESSAGE:");
    console.log(lastText);
    console.log("=================================");

    // ======================================
    // STORAGE SAVE
    // ======================================

    console.log("STARTING STORAGE SAVE");

    chrome.storage.local.set(
      {
        latestFinalMessage: lastText,
      },
      () => {
        console.log("=================================");
        console.log("STORAGE CALLBACK FIRED");
        console.log("=================================");

        if (chrome.runtime.lastError) {
          console.log("STORAGE ERROR:");
          console.log(chrome.runtime.lastError);
          return;
        }

        console.log("STORAGE SAVE SUCCESS");

        // ======================================
        // VERIFY SAVE
        // ======================================

        chrome.storage.local.get(
          ["latestFinalMessage"],
          (result) => {
            console.log("VERIFY STORAGE RESULT:");
            console.log(result);

            console.log("OPENING WRITE PAGE");

            window.open(
              "http://localhost:3000/admin/write",
              "_blank"
            );
          }
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
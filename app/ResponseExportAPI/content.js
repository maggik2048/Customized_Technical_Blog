console.log("ResponseExportAPI Loaded");

/* =========================================
   STATE
========================================= */

let lastResponseHash = "";
let debounceTimer = null;

/* =========================================
   CHATGPT EXPORTER (IMPORT 대신 포함)
========================================= */

function getLatestResponseHTML() {
  const messages = document.querySelectorAll(
    '[data-message-author-role="assistant"]'
  );

  if (!messages.length) return null;

  return messages[messages.length - 1].innerHTML;
}

function isResponseFinished() {
  const stopButton = document.querySelector(
    '[aria-label*="Stop"]'
  );

  return !stopButton;
}

/* =========================================
   SEND FINAL RESPONSE
========================================= */

function sendFinalResponse(html) {
  chrome.runtime.sendMessage({
    type: "FINAL_MESSAGE",
    payload: {
      html,
      source: location.hostname,
      timestamp: Date.now(),
    },
  });

  console.log("FINAL_MESSAGE SENT");
}

/* =========================================
   OBSERVER
========================================= */

const observer = new MutationObserver(() => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    try {
      if (!isResponseFinished()) return;

      const html = getLatestResponseHTML();
      if (!html) return;

      const hash = html.length + "_" + html.slice(0, 100);

      if (hash === lastResponseHash) return;

      lastResponseHash = hash;

      console.log("FINAL RESPONSE DETECTED");

      sendFinalResponse(html);
    } catch (err) {
      console.error(err);
    }
  }, 1000);
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true,
});

console.log("Observer Started");
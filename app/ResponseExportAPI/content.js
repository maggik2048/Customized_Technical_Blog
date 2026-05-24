console.log("EXTENSION LOADED");

function getLastAssistantMessage() {
  const messages = document.querySelectorAll(
    '[data-message-author-role="assistant"]'
  );

  if (!messages.length) return null;

  return messages[messages.length - 1];
}

let lastText = "";
let debounceTimer = null;

const observer = new MutationObserver(() => {
  const lastMsg = getLastAssistantMessage();
  if (!lastMsg) return;

  const text = lastMsg.innerText?.trim();

  if (!text) return;

  if (text !== lastText) {
    lastText = text;

    console.log("STREAM UPDATE:");
    console.log(text);

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      console.log("FINAL ASSISTANT MESSAGE:");
      console.log(lastText);

      chrome.runtime.sendMessage({
        type: "FINAL_MESSAGE",
        payload: lastText,
      });
    }, 1500);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true,
});

console.log("OBSERVER STARTED");
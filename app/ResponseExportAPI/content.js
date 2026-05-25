console.log("EXTENSION LOADED");

function getLastAssistantMessage() {
  const messages = document.querySelectorAll(
    '[data-message-author-role="assistant"]'
  );

  if (!messages.length) return null;

  return messages[messages.length - 1];
}

let lastHTML = "";
let debounceTimer = null;

const observer = new MutationObserver(() => {
  const lastMsg = getLastAssistantMessage();

  if (!lastMsg) return;

  const html = lastMsg.innerHTML?.trim();

  if (!html) return;

  if (html !== lastHTML) {
    lastHTML = html;

    console.log("STREAM UPDATE HTML:");
    console.log(html);

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      console.log("=================================");
      console.log("FINAL ASSISTANT HTML");
      console.log("=================================");
      console.log(lastHTML);

      try {
        chrome.runtime.sendMessage({
          type: "FINAL_MESSAGE",
          payload: {
            html: lastHTML,
          },
        });

        console.log("MESSAGE SENT TO BACKGROUND");
      } catch (err) {
        console.error("SEND MESSAGE ERROR:");
        console.error(err);
      }
    }, 1500);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true,
});

console.log("OBSERVER STARTED");
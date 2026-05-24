console.log("EXTENSION LOADED");
console.log("INIT RUNNING");

function getLastAssistantMessage() {
  const messages = document.querySelectorAll('[data-message-author-role="assistant"]');
  if (messages.length === 0) return null;
  return messages[messages.length - 1];
}

// 글로벌 상태 (클립보드 역할)
window.__AI_API_STATE__ = {
  lastFinalMessage: "",
  updatedAt: 0
};

let lastText = "";
let timeout = null;

const observer = new MutationObserver(() => {
  const lastMsg = getLastAssistantMessage();
  if (!lastMsg) return;

  const text = lastMsg.innerText;
  if (!text) return;

  // streaming update
  if (text !== lastText) {
    lastText = text;

    if (timeout) clearTimeout(timeout);

    // idle 기반 final 판정
    timeout = setTimeout(() => {
      const finalText = lastText;

      console.log("FINAL ASSISTANT MESSAGE:");
      console.log(finalText);

      //  핵심: 무조건 덮어쓰기 (single source of truth)
      window.__AI_API_STATE__.lastFinalMessage = finalText;
      window.__AI_API_STATE__.updatedAt = Date.now();

      console.log("STATE UPDATED:", window.__AI_API_STATE__);

    }, 1200);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});
console.log("EXTENSION LOADED");

/* =========================================
   STATE
========================================= */

let lastMessageCount = 0;

let lastFinalText = "";

let debounceTimer = null;

/* =========================================
   GET ASSISTANT MESSAGES
========================================= */

function getAssistantMessages() {
  return document.querySelectorAll(
    '[data-message-author-role="assistant"]'
  );
}

/* =========================================
   OBSERVER
========================================= */

const observer = new MutationObserver(() => {
  const messages =
    getAssistantMessages();

  if (!messages.length) {
    return;
  }

  /**
   * 현재 마지막 assistant
   */

  const lastMsg =
    messages[messages.length - 1];

  /**
   * 실제 텍스트
   */

  const text =
    lastMsg.textContent?.trim() ||
    "";

  /**
   * html
   */

  const html =
    lastMsg.innerHTML?.trim() ||
    "";

  if (!html || !text) {
    return;
  }

  /**
   * =====================================
   * 새 assistant message 추가 감지
   * =====================================
   */

  const messageCount =
    messages.length;

  const isNewMessage =
    messageCount >
    lastMessageCount;

  /**
   * 새 응답 아니면 무시
   */

  if (!isNewMessage) {
    return;
  }

  /**
   * streaming debounce
   */

  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    /**
     * 최종 text
     */

    const finalText =
      lastMsg.textContent?.trim() ||
      "";

    /**
     * 중복 방지
     */

    if (
      finalText ===
      lastFinalText
    ) {
      console.log(
        "SAME RESPONSE SKIPPED"
      );

      return;
    }

    /**
     * save state
     */

    lastFinalText =
      finalText;

    lastMessageCount =
      messageCount;

    console.log(
      "================================="
    );

    console.log(
      "FINAL ASSISTANT HTML"
    );

    console.log(
      "================================="
    );

    console.log(html);

    /**
     * send
     */

    try {
      chrome.runtime.sendMessage({
        type: "FINAL_MESSAGE",

        payload: {
          html,
        },
      });

      console.log(
        "MESSAGE SENT TO BACKGROUND"
      );
    } catch (err) {
      console.error(
        "SEND MESSAGE ERROR:"
      );

      console.error(err);
    }
  }, 1500);
});

/* =========================================
   START OBSERVER
========================================= */

observer.observe(document.body, {
  childList: true,

  subtree: true,

  characterData: true,
});

console.log("OBSERVER STARTED");
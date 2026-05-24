console.log("EXTENSION LOADED");
console.log("INIT RUNNING");

function getLastAssistantMessage() {
  const messages = document.querySelectorAll('[data-message-author-role="assistant"]');
  if (messages.length === 0) return null;
  return messages[messages.length - 1];
}

let lastText = "";
let timeout = null;

const observer = new MutationObserver(() => {
  const lastMsg = getLastAssistantMessage();
  if (!lastMsg) return;

  const text = lastMsg.innerText;

  if (!text) return;

  // 계속 업데이트 중이면 저장만
  if (text !== lastText) {
    lastText = text;

    console.log("STREAM UPDATE:", text);

    //  변경 감지되면 타이머 리셋
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      console.log("FINAL ASSISTANT MESSAGE:");
      console.log(lastText);

      //  여기서 “완성 응답” 처리하면 됨
      // sendToServer(lastText);

    }, 1200); // 1.2초 동안 변화 없으면 완료로 간주
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});
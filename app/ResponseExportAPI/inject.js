console.log("INJECT SCRIPT RUNNING");

window.addEventListener("message", (event) => {
  // 자기 자신 메시지만 허용
  if (event.source !== window) return;

  // FINAL_MESSAGE만 처리
  if (event.data?.type !== "FINAL_MESSAGE") return;

  console.log("WRITE PAGE RECEIVED FINAL_MESSAGE");
  console.log(event.data.payload);

  // 필요하면 전역 저장도 가능
  window.latestAIMessage = event.data.payload;
});

// ==========================================
// write page 자동 textarea 주입
// ==========================================

function injectToEditor(text) {
  // textarea 찾기
  const textarea = document.querySelector("textarea");

  if (!textarea) {
    console.log("EDITOR NOT FOUND");
    return;
  }

  // React controlled textarea 대응
  const nativeInputValueSetter =
    Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    )?.set;

  nativeInputValueSetter?.call(textarea, text);

  // React state 갱신 트리거
  textarea.dispatchEvent(
    new Event("input", { bubbles: true })
  );

  console.log("EDITOR UPDATED");
}

// ==========================================
// FINAL_MESSAGE 수신 시 자동 주입
// ==========================================

window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (event.data?.type !== "FINAL_MESSAGE") return;

  const text = event.data?.payload?.text;

  if (!text) return;

  injectToEditor(text);
});
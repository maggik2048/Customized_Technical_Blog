/* =========================================
   CHATGPT EXPORTER
========================================= */

export function getLatestResponseHTML() {
  const messages =
    document.querySelectorAll(
      '[data-message-author-role="assistant"]'
    );

  if (!messages.length) {
    return null;
  }

  const last =
    messages[messages.length - 1];

  return last.innerHTML;
}

export function isResponseFinished() {
  /*
   * Stop generating 버튼 있으면
   * 아직 생성중
   */

  const stopButton =
    document.querySelector(
      '[aria-label*="Stop"]'
    );

  return !stopButton;
}
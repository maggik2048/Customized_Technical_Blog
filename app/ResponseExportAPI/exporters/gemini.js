export function getLatestResponseHTML() {
  const copies =
    document.querySelectorAll(
      '[aria-label="Copy"]'
    );

  if (!copies.length) {
    return null;
  }

  const lastCopy =
    copies[copies.length - 1];

  const response =
    lastCopy.closest(
      'message-content'
    );

  if (!response) {
    return null;
  }

  return response.innerHTML;
}

export function isResponseFinished() {
  /*
   * Copy 버튼이 생기면
   * Gemini 응답 완료
   */

  return (
    document.querySelector(
      '[aria-label="Copy"]'
    ) !== null
  );
}
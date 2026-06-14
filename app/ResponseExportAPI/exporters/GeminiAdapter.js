export class GeminiAdapter {
  static name = "Gemini";

  static match(url) {
    return (
      url.includes("gemini.google.com") ||
      url.includes("bard.google.com")
    );
  }

  constructor() {
    this.lastHash = "";
    this.timer = null;
  }

  static getLatestResponseHTML() {
    /*
      Gemini는 구조가 ChatGPT랑 다름
      Copy 버튼 기반이 가장 안정적
    */

    const copies = document.querySelectorAll(
      '[aria-label="Copy"], [aria-label*="copy"]'
    );

    if (!copies.length) return null;

    const last = copies[copies.length - 1];

    const message = last.closest("message-content");

    if (!message) return null;

    return message.innerHTML;
  }

  static isFinished() {
    /*
      Gemini는 Stop 버튼 대신 Copy 등장 여부로 판단
    */
    return (
      document.querySelector('[aria-label="Copy"]') !== null
    );
  }

  tryCapture(callback) {
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      if (!GeminiAdapter.isFinished()) return;

      const html = GeminiAdapter.getLatestResponseHTML();
      if (!html) return;

      const hash = html.length + html.slice(0, 50);

      if (hash === this.lastHash) return;

      this.lastHash = hash;

      callback({
        html,
        source: "gemini",
        type: "CONTENT",
        timestamp: Date.now(),
      });
    }, 800);
  }
}
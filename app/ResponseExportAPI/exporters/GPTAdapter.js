export class GPTAdapter {
  static name = "GPT";

  static match(url) {
    return url.includes("chatgpt.com");
  }

  constructor() {
    this.lastHash = "";
    this.timer = null;
  }

  static getLatestResponseHTML() {
    const messages = document.querySelectorAll(
      '[data-message-author-role="assistant"]'
    );

    if (!messages.length) return null;

    return messages[messages.length - 1].innerHTML;
  }

  static isFinished() {
    return !document.querySelector('[aria-label*="Stop"]');
  }

  tryCapture(callback) {
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      if (!GPTAdapter.isFinished()) return;

      const html = GPTAdapter.getLatestResponseHTML();
      if (!html) return;

      const hash = html.length + html.slice(0, 50);

      if (hash === this.lastHash) return;

      this.lastHash = hash;

      callback({
        html,
        source: "chatgpt",
        type: "CONTENT",
        timestamp: Date.now(),
      });
    }, 800);
  }
}
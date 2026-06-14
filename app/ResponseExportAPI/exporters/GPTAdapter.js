class GPTAdapter {
  static match(url) {
    return (
      url.includes("chatgpt.com") ||
      url.includes("chat.openai.com")
    );
  }

  constructor() {
    this.lastNode = null;
    this.lastText = "";
    this.lastHash = "";
    this.timer = null;
    this.name = "GPT";

    this.lastMutationTime = Date.now();
    this.hasCaptured = false;
  }

  static getLatestResponseNode() {
    const messages = document.querySelectorAll(
      '[data-message-author-role="assistant"]'
    );

    if (!messages.length) return null;

    return messages[messages.length - 1];
  }

  static isGenerating() {
    return !!document.querySelector('[aria-label*="Stop"]');
  }

  isIdle() {
    return Date.now() - this.lastMutationTime > 1200;
  }

  updateDiff(node) {
    if (!node) return;

    const text = node.innerText || "";

    // 첫 진입
    if (!this.lastNode) {
      this.lastNode = node;
      this.lastText = text;
      return;
    }

    // 같은 메시지 계속 생성 중
    if (node === this.lastNode) {
      if (text.length > this.lastText.length) {
        const diff = text.slice(this.lastText.length);
        this.lastText += diff;
      }
      return;
    }

    // 새 메시지 시작
    this.lastNode = node;
    this.lastText = text;
  }

  tryCapture(callback) {
    if (this.hasCaptured) return;

    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      if (this.hasCaptured) return;

      if (GPTAdapter.isGenerating()) return;
      if (!this.isIdle()) return;

      const node = GPTAdapter.getLatestResponseNode();
      if (!node) return;

      this.updateDiff(node);

      const text = this.lastText.trim();
      if (!text) return;

      const hash = text.length + "_" + text.slice(0, 50);

      if (hash === this.lastHash) return;

      this.lastHash = hash;
      this.hasCaptured = true; // 🔥 1회 락

      callback({
        text,
        source: "chatgpt",
        type: "CONTENT",
        timestamp: Date.now(),
      });
    }, 1200);
  }
}
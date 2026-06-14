console.log("[AI Export Router] Loaded");
console.log("[Router] URL =", location.href);

/* =========================
   GLOBAL STATE
========================= */

let globalCaptured = false;

/* =========================
   GPT ADAPTER
========================= */

class GPTAdapter {
  static match(url) {
    return (
      url.includes("chatgpt.com") ||
      url.includes("chat.openai.com")
    );
  }

  constructor() {
    this.lastHash = "";
    this.timer = null;
    this.name = "GPT";
    this.lastMutationTime = Date.now();
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

  isIdle() {
    return Date.now() - this.lastMutationTime > 1200;
  }

  tryCapture(callback) {
    if (globalCaptured) return;

    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      if (globalCaptured) return;

      if (!GPTAdapter.isFinished()) return;
      if (!this.isIdle()) return;

      const html = GPTAdapter.getLatestResponseHTML();
      if (!html) return;

      const hash = html.length + "_" + html.slice(0, 50);

      if (hash === this.lastHash) return;

      this.lastHash = hash;
      globalCaptured = true;

      /* =========================
         🔥 IMPORTANT: MESSAGE ID
      ========================= */
      const MESSAGE_ID = `${Date.now()}_${Math.random()}`;

      const payload = {
        id: MESSAGE_ID,
        html,
        source: "chatgpt",
        type: "CONTENT",
        timestamp: Date.now(),
      };

      console.log("================================");
      console.log("[GPT] FINAL PAYLOAD");
      console.log(payload);
      console.log("================================");

      callback(payload);
    }, 1200);
  }
}

/* =========================
   GEMINI ADAPTER
========================= */

class GeminiAdapter {
  static match(url) {
    return url.includes("gemini.google.com");
  }

  constructor() {
    this.lastHash = "";
    this.timer = null;
    this.name = "Gemini";
    this.lastMutationTime = Date.now();
  }

  static getLatestResponseHTML() {
    const copies = document.querySelectorAll(
      '[aria-label="Copy"], [aria-label*="copy"]'
    );

    if (!copies.length) return null;

    const last = copies[copies.length - 1];
    const container = last.closest("response-container");

    if (!container) return null;

    return container.innerHTML;
  }

  static isFinished() {
    return !!document.querySelector('[aria-label="Copy"]');
  }

  isIdle() {
    return Date.now() - this.lastMutationTime > 1200;
  }

  tryCapture(callback) {
    if (globalCaptured) return;

    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      if (globalCaptured) return;

      if (!GeminiAdapter.isFinished()) return;
      if (!this.isIdle()) return;

      const html = GeminiAdapter.getLatestResponseHTML();
      if (!html) return;

      const hash = html.length + "_" + html.slice(0, 50);

      if (hash === this.lastHash) return;

      this.lastHash = hash;
      globalCaptured = true;

      const MESSAGE_ID = `${Date.now()}_${Math.random()}`;

      const payload = {
        id: MESSAGE_ID,
        html,
        source: "gemini",
        type: "CONTENT",
        timestamp: Date.now(),
      };

      console.log("================================");
      console.log("[Gemini] FINAL PAYLOAD");
      console.log(payload);
      console.log("================================");

      callback(payload);
    }, 1200);
  }
}

/* =========================
   ROUTER
========================= */

const adapters = [GPTAdapter, GeminiAdapter];

function getActiveAdapter() {
  return adapters.find((A) => A.match(location.href));
}

function boot() {
  const Adapter = getActiveAdapter();

  if (!Adapter) return;

  const adapter = new Adapter();

  const observer = new MutationObserver((mutations) => {
    adapter.lastMutationTime = Date.now();

    adapter.tryCapture((payload) => {
      if (!payload) return;

      console.log("==============================");
      console.log("[FINAL_MESSAGE]");
      console.log(JSON.stringify(payload, null, 2));
      console.log("==============================");

      chrome.runtime.sendMessage({
        type: "FINAL_MESSAGE",
        payload,
      });

      console.log("[SENT ONCE ONLY]");
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  console.log("[Router] Observer started");
}

boot();
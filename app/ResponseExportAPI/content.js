console.log("[AI Export Router] Loaded");
console.log("[Router] URL =", location.href);

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
  }

  static getLatestResponseHTML() {
    const messages =
      document.querySelectorAll(
        '[data-message-author-role="assistant"]'
      );

    console.log(
      "[GPT] assistant messages:",
      messages.length
    );

    if (!messages.length) {
      return null;
    }

    return messages[
      messages.length - 1
    ].innerHTML;
  }

  static isFinished() {
    const stopButton =
      document.querySelector(
        '[aria-label*="Stop"]'
      );

    console.log(
      "[GPT] stop button:",
      !!stopButton
    );

    return !stopButton;
  }

  tryCapture(callback) {
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      console.log(
        "[GPT] tryCapture"
      );

      if (
        !GPTAdapter.isFinished()
      ) {
        console.log(
          "[GPT] still generating"
        );

        return;
      }

      const html =
        GPTAdapter.getLatestResponseHTML();

      if (!html) {
        console.log(
          "[GPT] html not found"
        );

        return;
      }

      console.log(
        "[GPT] html length:",
        html.length
      );

      const hash =
        html.length +
        "_" +
        html.slice(0, 50);

      if (
        hash === this.lastHash
      ) {
        console.log(
          "[GPT] duplicate response"
        );

        return;
      }

      this.lastHash = hash;

      const payload = {
        html,
        source: "chatgpt",
        type: "CONTENT",
        timestamp:
          Date.now(),
      };

      console.log(
        "=============================="
      );

      console.log(
        "[GPT] FINAL PAYLOAD"
      );

      console.log(payload);

      console.log(
        "=============================="
      );

      callback(payload);
    }, 800);
  }
}

/* =========================
   GEMINI ADAPTER
========================= */

class GeminiAdapter {
  static match(url) {
    return url.includes(
      "gemini.google.com"
    );
  }

  constructor() {
    this.lastHash = "";
    this.timer = null;
    this.name = "Gemini";
  }

  static getLatestResponseHTML() {
    const copies = document.querySelectorAll(
      '[aria-label="Copy"], [aria-label*="copy"]'
    );

    console.log(
      "[Gemini] copy buttons:",
      copies.length
    );

    if (!copies.length) {
      return null;
    }

    const last =
      copies[copies.length - 1];

    console.log(
      "[Gemini] last copy:",
      last
    );

    /*
    * 부모 체인 전부 출력
    */

    let current = last;
    let depth = 0;

    while (
      current &&
      depth < 20
    ) {
      console.log(
        `[Gemini] parent ${depth}`,
        current.tagName,
        current.className
      );

      current =
        current.parentElement;

      depth++;
    }

    /*
    * response-container 탐색
    */

    const container =
      last.closest(
        "response-container"
      );

    console.log(
      "[Gemini] response-container:",
      container
    );

    if (!container) {
      return null;
    }

    console.log(
      "[Gemini] HTML FOUND"
    );

    console.log(
      container.innerHTML.slice(
        0,
        1000
      )
    );

    return container.innerHTML;
  }

  static isFinished() {
    const copy =
      document.querySelector(
        '[aria-label="Copy"]'
      );

    console.log(
      "[Gemini] copy found:",
      !!copy
    );

    return copy !== null;
  }

  tryCapture(callback) {
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      console.log(
        "[Gemini] tryCapture"
      );

      if (
        !GeminiAdapter.isFinished()
      ) {
        console.log(
          "[Gemini] still generating"
        );

        return;
      }

      const html =
        GeminiAdapter.getLatestResponseHTML();

      if (!html) {
        console.log(
          "[Gemini] html not found"
        );

        return;
      }

      console.log(
        "[Gemini] html length:",
        html.length
      );

      console.log(
        "[Gemini] preview:"
      );

      console.log(
        html.slice(0, 500)
      );

      const hash =
        html.length +
        "_" +
        html.slice(0, 50);

      if (
        hash === this.lastHash
      ) {
        console.log(
          "[Gemini] duplicate response"
        );

        return;
      }

      this.lastHash = hash;

      const payload = {
        html,
        source: "gemini",
        type: "CONTENT",
        timestamp:
          Date.now(),
      };

      console.log(
        "=============================="
      );

      console.log(
        "[Gemini] FINAL PAYLOAD"
      );

      console.log(payload);

      console.log(
        "=============================="
      );

      callback(payload);
    }, 800);
  }
}

/* =========================
   ROUTER
========================= */

const adapters = [
  GPTAdapter,
  GeminiAdapter,
];

function getActiveAdapter() {
  const matched =
    adapters.find((A) =>
      A.match(location.href)
    );

  console.log(
    "[Router] matched adapter:",
    matched?.name
  );

  return matched;
}

function boot() {
  const Adapter =
    getActiveAdapter();

  if (!Adapter) {
    console.log(
      "[Router] No adapter matched"
    );

    return;
  }

  const adapter =
    new Adapter();

  console.log(
    "[Router] Active:",
    adapter.name
  );

  const observer =
    new MutationObserver(
      (mutations) => {
        console.log(
          "[Router] mutation:",
          mutations.length
        );

        adapter.tryCapture(
          (payload) => {
            if (!payload) {
              console.log(
                "[Router] payload null"
              );

              return;
            }

            console.log(
              "=============================="
            );

            console.log(
              "[Router] FINAL_MESSAGE"
            );

            console.log(
              JSON.stringify(
                payload,
                null,
                2
              )
            );

            console.log(
              "=============================="
            );

            chrome.runtime.sendMessage(
              {
                type:
                  "FINAL_MESSAGE",
                payload,
              },
              (response) => {
                console.log(
                  "[Router] background response:",
                  response
                );
              }
            );

            console.log(
              "[Router] SENT FINAL MESSAGE"
            );
          }
        );
      }
    );

  observer.observe(
    document.body,
    {
      childList: true,
      subtree: true,
      characterData: true,
    }
  );

  console.log(
    "[Router] Observer started"
  );
}

boot();
console.log("Background Service Worker Loaded");

/* =========================================
   STATE (중복 방지 레이어)
========================================= */

//  전역 실행 락
let isProcessing = false;

//  시간 기반 방지
let lastOpenTime = 0;

//  message id 기반 중복 방지 (핵심)
const processedIds = new Set();

//  tab 기반 방지 (중요)
const tabLastRun = new Map();

/* =========================================
   CLEANUP (메모리 누수 방지)
========================================= */

// 오래된 id 제거 (10초마다)
setInterval(() => {
  processedIds.clear();
}, 10000);

/* =========================================
   MESSAGE LISTENER
========================================= */

chrome.runtime.onMessage.addListener((msg, sender) => {
  (async () => {
    try {
      if (msg.type !== "FINAL_MESSAGE") return;

      const html = msg.payload?.html;
      const id = msg.payload?.id || (html ? html.length + "_" + html.slice(0, 50) : null);

      if (!html || typeof html !== "string") return;
      if (!id) return;

      const tabId = sender.tab?.id;
      const now = Date.now();

      console.log("[BG] message received", { id, tabId });

      /* =========================================
         1. GLOBAL DUP CHECK (ID)
      ========================================= */
      if (processedIds.has(id)) {
        console.log("[SKIP] duplicate id");
        return;
      }

      /* =========================================
         2. TAB DUP CHECK
      ========================================= */
      if (tabId !== undefined) {
        const last = tabLastRun.get(tabId) || 0;
        if (now - last < 3000) {
          console.log("[SKIP] tab cooldown");
          return;
        }
      }

      /* =========================================
         3. GLOBAL TIME WINDOW
      ========================================= */
      if (now - lastOpenTime < 2000) {
        console.log("[SKIP] global cooldown");
        return;
      }

      /* =========================================
         4. EXECUTION LOCK
      ========================================= */
      if (isProcessing) {
        console.log("[SKIP] already processing");
        return;
      }

      //  LOCK SET
      isProcessing = true;
      processedIds.add(id);
      lastOpenTime = now;
      if (tabId !== undefined) tabLastRun.set(tabId, now);

      /* =========================================
         STORAGE SAVE
      ========================================= */
      await chrome.storage.local.set({
        latestFinalHTML: html,
        latestSavedAt: now,
      });

      console.log("[BG] saved");

      /* =========================================
         OPEN ONLY ONCE
      ========================================= */
      chrome.tabs.create({
        url: "http://localhost:3000/admin/write",
      });

      console.log("[BG] write form opened");

      /* =========================================
         RELEASE LOCK
      ========================================= */
      setTimeout(() => {
        isProcessing = false;
        console.log("[BG] unlocked");
      }, 1500);

    } catch (err) {
      console.error("[BG ERROR]", err);
      isProcessing = false;
    }
  })();

  return true;
});
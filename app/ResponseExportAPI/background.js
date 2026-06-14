console.log("Background Service Worker Loaded");

/* =========================================
   STATE (강화된 중복 방지)
========================================= */

// 기존 처리 락
let isProcessing = false;

// 🔥 추가: 시간 기반 락 (레이스 방지 핵심)
let lastOpenTime = 0;

// 🔥 추가: 메시지 단위 중복 방지
let lastMessageHash = "";

/* =========================================
   MESSAGE LISTENER
========================================= */

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    try {
      console.log("=================================");
      console.log("BACKGROUND MESSAGE RECEIVED");
      console.log("=================================");
      console.log(msg);

      if (msg.type !== "FINAL_MESSAGE") {
        console.log("NOT FINAL_MESSAGE");
        return;
      }

      const html = msg.payload?.html;

      if (!html || typeof html !== "string") {
        console.log("INVALID HTML PAYLOAD");
        return;
      }

      /* =========================================
         🔥 1. 메시지 해시 기반 중복 방지
      ========================================= */

      const msgHash = html.length + "_" + html.slice(0, 80);

      if (msgHash === lastMessageHash) {
        console.log("[SKIP] duplicate message content");
        return;
      }

      lastMessageHash = msgHash;

      /* =========================================
         🔥 2. 시간 기반 중복 방지 (핵심)
      ========================================= */

      const now = Date.now();

      if (now - lastOpenTime < 3000) {
        console.log("[SKIP] too fast duplicate trigger");
        return;
      }

      /* =========================================
         🔥 3. 실행 락
      ========================================= */

      if (isProcessing) {
        console.log("SKIPPED: already processing");
        return;
      }

      isProcessing = true;
      lastOpenTime = now;

      console.log("HTML LENGTH:", html.length);

      /* =========================================
         STORAGE SAVE
      ========================================= */

      await chrome.storage.local.set({
        latestFinalHTML: html,
        latestSavedAt: now,
      });

      console.log("HTML SAVED TO chrome.storage.local");

      /* =========================================
         OPEN FRONTEND
      ========================================= */

      chrome.tabs.create({
        url: "http://localhost:3000/admin/write",
      });

      console.log("WRITE PAGE OPENED");

      /* =========================================
         RELEASE LOCK (조금 늦게 해제)
      ========================================= */

      setTimeout(() => {
        isProcessing = false;
        console.log("[UNLOCKED]");
      }, 2000);

    } catch (err) {
      console.error("BACKGROUND ERROR:", err);
      isProcessing = false;
    }
  })();

  return true;
});
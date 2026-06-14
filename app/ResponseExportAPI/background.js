console.log("Background Service Worker Loaded");

/* =========================================
   STATE (중복 실행 방지)
========================================= */

let isProcessing = false;

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

      if (isProcessing) {
        console.log("SKIPPED: already processing");
        return;
      }

      isProcessing = true;

      const html = msg.payload?.html;

      if (!html || typeof html !== "string") {
        console.log("INVALID HTML PAYLOAD");
        isProcessing = false;
        return;
      }

      console.log("HTML LENGTH:", html.length);

      /* =========================================
         STORAGE SAVE
      ========================================= */

      await chrome.storage.local.set({
        latestFinalHTML: html,
        latestSavedAt: Date.now(),
      });

      console.log("HTML SAVED TO chrome.storage.local");

      /* =========================================
         OPEN FRONTEND
      ========================================= */

      chrome.tabs.create({
        url: "http://localhost:3000/admin/write",
      });

      console.log("WRITE PAGE OPENED");

      isProcessing = false;
    } catch (err) {
      console.error("BACKGROUND ERROR:", err);
      isProcessing = false;
    }
  })();

  // MV3 중요: async 처리 유지
  return true;
});
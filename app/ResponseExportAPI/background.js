chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== "FINAL_MESSAGE") return;

  chrome.storage.local.set({
    latest_post: msg.payload,
  });

  chrome.tabs.create({
    url: "http://localhost:3000/admin/write",
  });
});
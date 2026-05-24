chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "EXPORT") {
    fetch("https://YOUR-SERVER.com/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: msg.payload,
        source: "chatgpt"
      })
    });
  }
});
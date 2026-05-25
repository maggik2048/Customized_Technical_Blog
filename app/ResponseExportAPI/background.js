chrome.runtime.onMessage.addListener(
  async (msg) => {
    console.log("=================================");
    console.log("BACKGROUND MESSAGE RECEIVED");
    console.log("=================================");

    console.log(msg);

    if (msg.type !== "FINAL_MESSAGE") {
      console.log("NOT FINAL_MESSAGE");
      return;
    }

    const html = msg.payload?.html;

    if (!html) {
      console.log("NO HTML PAYLOAD");
      return;
    }

    console.log("HTML LENGTH:");
    console.log(html.length);

    try {
      await chrome.storage.local.set({
        latestFinalHTML: html,
      });

      console.log(
        "HTML SAVED TO chrome.storage.local"
      );

      chrome.tabs.create({
        url: "http://localhost:3000/admin/write",
      });

      console.log("WRITE PAGE OPENED");
    } catch (err) {
      console.error("BACKGROUND ERROR:");
      console.error(err);
    }
  }
);
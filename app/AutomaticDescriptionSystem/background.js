const DESTINATIONS = [
  {
    id: "GoogleIA",
    urlContains: "google.com/app"
  },

  {
    id: "Claude",
    urlContains: "claude.ai"
  },

  {
    id: "ChatGPT",
    urlContains: "chatgpt.com"
  }
];

chrome.runtime.onMessage.addListener(
  async (message) => {

    if (
      message.action !==
      "RouteContentToDestination"
    ) {
      return;
    }

    const tabs =
      await chrome.tabs.query({});

    for (
      const destination
      of DESTINATIONS
    ) {

      const matchedTabs =
        tabs.filter(
          tab =>
            tab.url &&
            tab.url.includes(
              destination.urlContains
            )
        );

      for (
        const tab
        of matchedTabs
      ) {

        chrome.tabs.sendMessage(
          tab.id,
          {
            action:
              "SetContentToDestination",

            content:
              message.content
          }
        );

      }

    }

  }
);
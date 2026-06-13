window.addEventListener(
  "message",
  (event) => {

    if (
      event.data?.type !==
      "SEND_CONTENT_TO_DESTINATION"
    ) {
      return;
    }

    chrome.runtime.sendMessage({
      action:
        "RouteContentToDestination",

      content:
        event.data.payload
    });

  }
);
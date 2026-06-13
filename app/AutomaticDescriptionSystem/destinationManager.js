(function () {

  const current =
    window.DESTINATIONS.find(
      destination =>
        location.href.includes(
          destination.urlContains
        )
    );

  if (!current)
    return;

  const DestinationClass =
    window.DESTINATION_REGISTRY[
      current.id
    ];

  if (!DestinationClass)
    return;

  const destination =
    new DestinationClass();

  chrome.runtime.onMessage.addListener(
    (message) => {

      if (
        message.action !==
        "SetContentToDestination"
      ) {
        return;
      }

      destination.setContent(
        message.content
      );

    }
  );

})();
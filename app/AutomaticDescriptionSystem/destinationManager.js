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
    async (message) => {

      if (
        message.action !==
        "SetContentToDestination"
      ) {
        return;
      }

      const success =
        destination.setContent(
          message.content
        );

      if (!success)
        return;

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            1000
          )
      );

      destination.submit();

    }
  );

})();
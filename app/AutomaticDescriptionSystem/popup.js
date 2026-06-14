const textarea =
  document.getElementById(
    "customMessage"
  );

chrome.storage.local.get(
  "customMessage",
  (result) => {

    textarea.value =
      result.customMessage || "";

  }
);

document
  .getElementById(
    "save"
  )
  .addEventListener(
    "click",
    () => {

      chrome.storage.local.set({
        customMessage:
          textarea.value
      });

    }
  );
console.log("=================================");
console.log("INJECT SCRIPT LOADED");
console.log("CURRENT URL:", location.href);
console.log("TIME:", new Date().toISOString());
console.log("=================================");

// ==========================================
// CHROME DEBUG
// ==========================================

try {
  console.log("chrome exists:", !!chrome);

  console.log("chrome object:");
  console.log(chrome);

  console.log("chrome.storage:");
  console.log(chrome.storage);

  console.log("chrome.runtime.id:");
  console.log(chrome.runtime?.id);
} catch (err) {
  console.error("CHROME DEBUG FAILED");
  console.error(err);
}

// ==========================================
// textarea inject
// ==========================================

function injectToEditor(text) {
  console.log("=================================");
  console.log("injectToEditor CALLED");
  console.log("=================================");

  const textarea = document.querySelector("textarea");

  console.log("textarea query result:");
  console.log(textarea);

  if (!textarea) {
    console.log("TEXTAREA NOT FOUND");
    return false;
  }

  console.log("TEXTAREA FOUND");

  console.log("TEXT LENGTH:");
  console.log(text.length);

  console.log("TEXT PREVIEW:");
  console.log(text.slice(0, 300));

  console.log("TEXTAREA VALUE BEFORE:");
  console.log(textarea.value);

  const descriptor =
    Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    );

  console.log("DESCRIPTOR:");
  console.log(descriptor);

  const nativeSetter = descriptor?.set;

  if (!nativeSetter) {
    console.log("NATIVE SETTER NOT FOUND");
    return false;
  }

  try {
    console.log("CALLING NATIVE SETTER");

    nativeSetter.call(textarea, text);

    console.log("DISPATCHING INPUT EVENT");

    textarea.dispatchEvent(
      new Event("input", {
        bubbles: true,
      })
    );

    console.log("DISPATCHING CHANGE EVENT");

    textarea.dispatchEvent(
      new Event("change", {
        bubbles: true,
      })
    );

    console.log("TEXTAREA VALUE AFTER:");
    console.log(textarea.value);

    console.log("FINAL TEXTAREA LENGTH:");
    console.log(textarea.value.length);

    console.log("INJECTION SUCCESS");

    return true;
  } catch (err) {
    console.error("INJECTION ERROR");
    console.error(err);

    return false;
  }
}

// ==========================================
// retry loop
// ==========================================

function waitForEditorAndInject(text) {
  console.log("=================================");
  console.log("WAITING FOR EDITOR");
  console.log("=================================");

  let tries = 0;

  const interval = setInterval(() => {
    tries++;

    console.log("TRY COUNT:", tries);

    const allTextareas =
      document.querySelectorAll("textarea");

    console.log("TEXTAREA COUNT:");
    console.log(allTextareas.length);

    const success = injectToEditor(text);

    if (success) {
      console.log("=================================");
      console.log("DONE");
      console.log("=================================");

      clearInterval(interval);
    }

    if (tries >= 40) {
      console.log("=================================");
      console.log("FAILED MAX RETRY");
      console.log("=================================");

      clearInterval(interval);
    }
  }, 500);
}

// ==========================================
// STORAGE READ
// ==========================================

try {
  console.log("STARTING STORAGE READ");

  chrome.storage.local.get(
    ["latestFinalMessage"],
    (result) => {
      console.log("=================================");
      console.log("STORAGE CALLBACK FIRED");
      console.log("=================================");

      console.log("chrome.runtime.lastError:");
      console.log(chrome.runtime.lastError);

      console.log("RAW STORAGE RESULT:");
      console.log(result);

      if (!result) {
        console.log("RESULT EMPTY");
        return;
      }

      const text = result.latestFinalMessage;

      console.log("latestFinalMessage:");
      console.log(text);

      if (!text) {
        console.log("NO latestFinalMessage");
        return;
      }

      console.log("MESSAGE FOUND");

      console.log("MESSAGE LENGTH:");
      console.log(text.length);

      waitForEditorAndInject(text);
    }
  );
} catch (err) {
  console.error("STORAGE READ ERROR");
  console.error(err);
}
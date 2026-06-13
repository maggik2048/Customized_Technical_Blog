class DestinationClaude {

  waitUntilReady() {
    return true;
  }

  findInput() {

    return document.querySelector(
      '[contenteditable="true"]'
    );

  }

  setContent(content) {

    const input =
      this.findInput();

    if (!input)
      return false;

    input.focus();

    input.textContent =
      content;

    input.dispatchEvent(
      new InputEvent(
        "input",
        {
          bubbles: true,
          data: content
        }
      )
    );

    return true;

  }

  submit() {}

  healthCheck() {
    return !!this.findInput();
  }

}

window.DESTINATION_REGISTRY =
  window.DESTINATION_REGISTRY || {};

window.DESTINATION_REGISTRY.Claude =
  DestinationClaude;
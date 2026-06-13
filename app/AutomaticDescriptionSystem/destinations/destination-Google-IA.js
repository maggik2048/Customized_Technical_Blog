class DestinationGoogleIA {

  waitUntilReady() {
    return true;
  }

  findInput() {

    const selectors = [

      '[contenteditable="true"]',

      'div[role="textbox"]',

      'textarea'

    ];

    for (
      const selector
      of selectors
    ) {

      const element =
        document.querySelector(
          selector
        );

      if (element)
        return element;

    }

    return null;

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
          data: content,
          inputType:
            "insertText"
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

window.DESTINATION_REGISTRY.GoogleIA =
  DestinationGoogleIA;
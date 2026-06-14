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

    for (const selector of selectors) {

      const element =
        document.querySelector(selector);

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

    // 기존 내용 제거 (안정성)
    input.textContent = "";

    // 값 주입
    input.textContent = content;

    // React/SPA 대응 input 이벤트
    input.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        data: content,
        inputType: "insertText"
      })
    );

    // 일부 프레임워크 대응
    input.dispatchEvent(
      new Event("change", { bubbles: true })
    );

    return true;
  }

  submit() {

    const selectors = [
      '[aria-label="Send message"]',
      '[aria-label*="Send"]',
      '[aria-label*="message"]'
    ];

    const tryClick = () => {

      for (const selector of selectors) {

        const button =
          document.querySelector(selector);

        if (button && !button.disabled) {

          button.click();
          return true;

        }
      }

      return false;
    };

    // 1차 즉시 시도
    if (tryClick())
      return true;

    // 2차 retry loop (DOM 늦게 뜨는 경우 대응)
    let attempts = 0;

    const interval =
      setInterval(() => {

        attempts++;

        if (tryClick() || attempts > 10) {
          clearInterval(interval);
        }

      }, 200);

    return true;
  }

  healthCheck() {
    return !!this.findInput();
  }
}

window.DESTINATION_REGISTRY =
  window.DESTINATION_REGISTRY || {};

window.DESTINATION_REGISTRY.GoogleIA =
  DestinationGoogleIA;
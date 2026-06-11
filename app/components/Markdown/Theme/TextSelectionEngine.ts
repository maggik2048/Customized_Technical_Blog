type HighlightOptions = {
  className?: string;
  container?: HTMLElement | null;
};

export class TextSelectionEngine {
  private container: HTMLElement | null;
  private className: string;

  constructor(options?: HighlightOptions) {
    this.container = options?.container ?? null;
    this.className = options?.className ?? "brush-highlight";
  }

  setContainer(el: HTMLElement | null) {
    this.container = el;
  }

  applyHighlight() {
    const selection = window.getSelection();

    if (!selection || selection.isCollapsed) return;
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    // 1) container 밖 차단
    if (
      this.container &&
      !this.container.contains(range.commonAncestorContainer)
    ) {
      return;
    }

    const text = selection.toString();
    if (!text || text.length < 2) return;

    // 2) cross-node selection 차단 (핵심 안정화)
    if (range.startContainer !== range.endContainer) return;

    // 3) 이미 highlight 내부면 방지
    const ancestor =
      range.commonAncestorContainer.nodeType === 3
        ? range.commonAncestorContainer.parentElement
        : (range.commonAncestorContainer as HTMLElement);

    if (ancestor?.closest?.(`.${this.className}`)) return;

    try {
      // 🔥 핵심 변경: extractContents 제거
      range.deleteContents();

      const span = document.createElement("span");
      span.className = this.className;
      span.textContent = text;

      range.insertNode(span);

      // selection reset
      selection.removeAllRanges();
    } catch (e) {
      console.warn("[TextSelectionEngine] highlight failed:", e);
    }
  }

  bindAutoHighlight() {
    setTimeout(() => {
      this.applyHighlight();
    }, 0);
  }

  clearAllHighlights() {
    if (!this.container) return;

    const highlights = this.container.querySelectorAll(`.${this.className}`);

    highlights.forEach((el) => {
      const parent = el.parentNode;
      if (!parent) return;

      while (el.firstChild) {
        parent.insertBefore(el.firstChild, el);
      }

      parent.removeChild(el);
    });
  }
}
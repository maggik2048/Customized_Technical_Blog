export type HighlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type Highlight = {
  id: string;
  rects: HighlightRect[];
};

type HighlightOptions = {
  onChange?: (highlights: Highlight[]) => void;
};

export class TextSelectionEngine {
  private container: HTMLElement | null = null;
  private highlights: Highlight[] = [];
  private onChange?: (h: Highlight[]) => void;

  constructor(options?: HighlightOptions) {
    this.onChange = options?.onChange;
  }

  setContainer(el: HTMLElement | null) {
    this.container = el;
  }

  /**
   * =========================
   * 핵심: DOM 수정 없음
   * selection → rect 변환만 수행
   * =========================
   */
  applyHighlight() {
    const selection = window.getSelection();

    if (!selection || selection.isCollapsed) return;
    if (!this.container) return;
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    // 1. container 밖 차단
    if (!this.container.contains(range.commonAncestorContainer)) return;

    const text = selection.toString();
    if (!text || text.trim().length < 2) return;

    // 2. rect 기반 추출 (핵심)
    const rects = Array.from(range.getClientRects())
      .filter((r) => r.width > 0 && r.height > 0)
      .map((r) => ({
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
      }));

    if (rects.length === 0) return;

    // 3. highlight 생성
    const newHighlight: Highlight = {
      id: crypto.randomUUID(),
      rects,
    };

    this.highlights.push(newHighlight);

    this.onChange?.([...this.highlights]);

    selection.removeAllRanges();
  }

  /**
   * =========================
   * 전체 삭제
   * =========================
   */
  clearAllHighlights() {
    this.highlights = [];
    this.onChange?.([]);
  }

  /**
   * =========================
   * getter (optional)
   * =========================
   */
  getHighlights() {
    return this.highlights;
  }
}
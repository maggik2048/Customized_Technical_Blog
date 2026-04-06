// /lib/pasteProcessor.ts

import TurndownService from "turndown";
import { convertHtmlWithMath } from "./katexParser";
import { processMath } from "./mathParser";

const turndownService = new TurndownService();

export function processPaste(html: string, text: string): string {
  // 🔥 1순위: KaTeX HTML (완벽 복원)
  if (html && html.includes("katex")) {
    return convertHtmlWithMath(html);
  }

  // 🔹 fallback
  if (html) {
    let md = turndownService.turndown(html);
    return processMath(md);
  }

  return processMath(text);
}
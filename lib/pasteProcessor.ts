import { convertHtmlWithMath } from "./katexParser";
import { processMath } from "./mathParser";
import TurndownService from "turndown";

const turndownService = new TurndownService();

export function processPaste(html: string, text: string): string {
  // 🔥 1순위: KaTeX HTML
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
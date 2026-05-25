// app/components/Markdown/editor/pipeline/pastePipeline.ts

import { parseClipboardHTML } from "../parser/parseClipboardHTML";

import { clipboardAstToMarkdown } from "../serializer/clipboardAstToMarkdown";

export function pastePipeline(
  html: string,
  text: string
): string {
  // HTML 우선
  if (
    html &&
    html.includes("<")
  ) {
    const ast =
      parseClipboardHTML(html);

    return clipboardAstToMarkdown(
      ast
    );
  }

  // plain text fallback
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");
}
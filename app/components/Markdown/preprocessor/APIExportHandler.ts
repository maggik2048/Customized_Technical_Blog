"use client";

import { EditorView } from "@codemirror/view";
import { uploadImage } from "../imagehandle/uploadImage";
import { markdownCoordinator } from "../coordinator";

type Params = {
  insertText: (view: EditorView, insert: string) => void;
};

export function createAPIExportHandler({
  insertText,
}: Params) {
  return async function handlePaste(
    event: ClipboardEvent,
    view: EditorView
  ) {
    console.log("====================================");
    console.log("[PASTE] EVENT START");
    console.log("====================================");

    const clipboard = event.clipboardData;

    if (!clipboard) {
      console.log("[PASTE] clipboard missing");
      return false;
    }

    event.preventDefault();

    /**
     * =================================
     * IMAGE PIPELINE
     * =================================
     */
    for (const item of clipboard.items) {
      console.log("[PASTE] ITEM:", item.kind, item.type);

      if (item.kind === "file") {
        console.log("[PASTE] IMAGE DETECTED");

        const file = item.getAsFile();

        if (!file) {
          console.log("[PASTE] IMAGE FILE NULL");
          return true;
        }

        (async () => {
          console.log("[PASTE] UPLOADING IMAGE...");

          const url = await uploadImage(file);

          console.log("[PASTE] IMAGE URL:", url);

          if (!url) return;

          insertText(view, `\n![](${url})\n`);
        })();

        return true;
      }
    }

    /**
     * =================================
     * TEXT / HTML PIPELINE
     * =================================
     */
    const html = clipboard.getData("text/html");

    const text =
      clipboard.getData("text/plain") || "";

    console.log("[PASTE] RAW HTML:");
    console.log(JSON.stringify(html));

    console.log("[PASTE] RAW TEXT:");
    console.log(JSON.stringify(text));

    console.log("[PASTE] RAW TEXT LINES:");
    console.log(text.split("\n"));

    /**
     * =================================
     * COORDINATOR
     * =================================
     */
    const result = markdownCoordinator.processPaste(html, text);

    console.log("[PASTE] PIPELINE:");
    console.log(result.pipeline);

    console.log("[PASTE] DETECTION:");
    console.log(result.detection);

    console.log("[PASTE] FINAL OUTPUT:");
    console.log(JSON.stringify(result.output));

    /**
     * =================================
     * INSERT
     * =================================
     */
    insertText(view, result.output);

    console.log("====================================");
    console.log("[PASTE] EVENT END");
    console.log("====================================");

    return true;
  };
}
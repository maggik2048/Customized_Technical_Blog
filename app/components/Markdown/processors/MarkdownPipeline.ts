export class MarkdownPipeline {
  static run(text: string): string {
    if (!text) return "";

    let result = text;

    result = result.replace(/\r\n/g, "\n");
    result = result.replace(/\t/g, "  ");
    result = result.replace(/\n{3,}/g, "\n\n");

    result = result
      .split("\n")
      .map((line) => line.replace(/\s+$/g, ""))
      .join("\n");

    return result;
  }
}
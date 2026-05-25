export class MarkdownCleanup {
  static run(text: string): string {
    if (!text) return "";

    let result = text;

    // 1. normalize line endings
    result = result.replace(/\r\n/g, "\n");

    // 2. tabs → spaces
    result = result.replace(/\t/g, "  ");

    // 3. collapse excessive newlines
    result = result.replace(/\n{3,}/g, "\n\n");

    // 4. trim trailing whitespace per line
    result = result
      .split("\n")
      .map((line) => line.replace(/\s+$/g, ""))
      .join("\n");

    return result;
  }
}
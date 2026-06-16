export function spaceToLineBreak(input: string): string {
  if (!input || typeof input !== "string") return "";

  let text = input;

  text = text.replace(/\r\n/g, "\n");
  text = text.replace(/\t/g, " ");

  text = text.replace(/ {2,}/g, "\n");

  text = text.replace(/\n{3,}/g, "\n\n");

  text = text
    .split("\n")
    .map((line) => {
      const match = line.match(/^(\s*)(.*?)(\s*)$/);
      if (!match) return line;

      const [, leading, body] = match;

      return leading + body;
    })
    .join("\n");

  return text.trim();
}



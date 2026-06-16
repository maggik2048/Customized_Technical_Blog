export type SuggestedTitlesResult = {
  title: string;
  suggestions: string[];
};

export function giveSuggestedTitles(
  titles?: unknown
): SuggestedTitlesResult {
  if (typeof titles !== "string") {
    return {
      title: "",
      suggestions: [],
    };
  }

  const cleaned = titles
    .split("\n") //  여기서만 구조 해석
    .map((t) => t.trim())
    .filter(Boolean);

  return {
    title: cleaned[0] ?? "",
    suggestions: cleaned.slice(1),
  };
}
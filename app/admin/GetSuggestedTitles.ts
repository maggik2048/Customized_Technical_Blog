// GetSuggestedTitles.ts

export type SuggestedTitlesResult = {
  title: string;
  suggestions: string[];
};

export function getSuggestedTitles(
  titles?: unknown
): SuggestedTitlesResult {
  if (!Array.isArray(titles)) {
    return {
      title: "",
      suggestions: [],
    };
  }

  const cleanedTitles = titles
    .filter(
      (item): item is string =>
        typeof item === "string"
    )
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    // 첫 번째 제목 → 실제 title input
    title: cleanedTitles[0] ?? "",

    // 나머지 전부 → suggestions
    suggestions:
      cleanedTitles.slice(1),
  };
}
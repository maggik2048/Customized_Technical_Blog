/**
 * Gemini Route Exporter (FINAL)
 * - content 읽고
 * - 제목 후보 3개 생성된 결과를 받는 역할만 함
 * - 파싱 X (절대 안 함)
 */

function setSuggestedTitles(value: unknown) {
  chrome.storage.local.set({
    latestSuggestedTitles: value,
  });

  console.log("[GeminiExporter] SUGGESTED TITLES SET");
}

export const geminiRouteExporter = {
  export({ markdown, meta }: any) {
    /**
     * markdown 자체는 "제목 후보 3개 문자열"이라고 가정
     * (AI가 이미 만들어준 상태)
     *
     * 예:
     * "title1\ntitle2\ntitle3"
     * or ["t1","t2","t3"] (둘 다 허용)
     */

    let titles: string[] = [];

    if (Array.isArray(markdown)) {
      titles = markdown;
    } else if (typeof markdown === "string") {
      titles = markdown
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    setSuggestedTitles(titles);

    return {
      success: true,
      target: "SUGGESTED_TITLES",
    };
  },
};
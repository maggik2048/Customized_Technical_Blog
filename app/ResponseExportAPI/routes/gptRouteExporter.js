/**
 * GPT 기반 응답 처리 전략
 *
 * 기본적으로 CONTENT로 간주
 */

function setContent(value) {
  chrome.storage.local.set({
    latestContent: value,
  });

  console.log("[GPTExporter] CONTENT SET");
}

export const gptRouteExporter = {
  export({ markdown, meta }) {
    setContent(markdown);

    return {
      success: true,
      target: "CONTENT",
    };
  },
};
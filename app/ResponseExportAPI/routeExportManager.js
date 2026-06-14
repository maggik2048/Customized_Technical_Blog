import { geminiRouteExporter } from "./routes/geminiRouteExporter.js";
import { gptRouteExporter } from "./routes/gptRouteExporter.js";

/**
 * Registry
 * - source별 exporter를 등록
 */
const exporters = {
  gemini: geminiRouteExporter,
  gpt: gptRouteExporter,
};

/**
 * 핵심 라우팅 함수
 */
export function routeExportManager({
  source,
  markdown,
  meta = {},
}) {
  const exporter = exporters[source];

  if (!exporter) {
    console.warn("[RouteExportManager] Unknown source:", source);

    return {
      success: false,
      reason: "UNKNOWN_SOURCE",
    };
  }

  return exporter.export({
    markdown,
    meta,
  });
}
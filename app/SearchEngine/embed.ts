import { pipeline, env } from "@xenova/transformers";

// 브라우저 / node 캐시 최적화 설정
env.allowLocalModels = false;
env.useBrowserCache = true;

let extractor: any = null;

/**
 * text → embedding vector 생성
 */
export async function embed(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // lazy load (첫 실행만 모델 다운로드)
  if (!extractor) {
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });

  // Tensor → number[]
  return Array.from(output.data);
}
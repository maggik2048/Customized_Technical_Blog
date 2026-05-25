/**
 * GPT / browser paste용 space → line break 복원 유틸
 *
 * 특징:
 * - 2개 이상 공백을 "의미 있는 구분"으로 보고 줄바꿈 처리
 * - 과도한 분해 방지용 안전 규칙 포함
 */

export function spaceToLineBreak(input: string): string {
  if (!input || typeof input !== "string") return "";

  let text = input;

  // 1. CRLF → LF 통일
  text = text.replace(/\r\n/g, "\n");

  // 2. 탭 → space
  text = text.replace(/\t/g, " ");

  /**
   * 3. 핵심 규칙
   * -------------------------
   * GPT/브라우저 복붙에서는
   * "  " (2칸 이상 space)가
   * 시각적으로 줄 구분 역할을 하는 경우가 많음
   *
   * → 이를 줄바꿈으로 승격
   */
  text = text.replace(/ {2,}/g, "\n");

  // 4. 연속 줄바꿈 정리 (너무 많이 깨지는 것 방지)
  text = text.replace(/\n{3,}/g, "\n\n");

  // 5. 줄 단위 trim (깔끔한 출력)
  text = text
    .split("\n")
    .map((line) => line.trim())
    .join("\n");

  // 6. 최종 trim
  return text.trim();
}
export function spaceToLineBreak(input: string): string {
  if (!input || typeof input !== "string") return "";

  let text = input;

  // 1. CRLF → LF 통일
  text = text.replace(/\r\n/g, "\n");

  // 2. tab → space
  text = text.replace(/\t/g, " ");

  /**
   * 3. 핵심: 2칸 이상 space → 줄바꿈
   * (layout hint를 구조로 변환)
   */
  text = text.replace(/ {2,}/g, "\n");

  // 4. 연속 줄바꿈 정리
  text = text.replace(/\n{3,}/g, "\n\n");

  /**
   * 5. 🔥 중요 수정
   * 기존: line.trim() → indentation 삭제됨 (문제)
   *
   * 변경:
   * - 앞쪽 space 유지 (indentation 보존)
   * - 뒤쪽만 정리
   */
  text = text
    .split("\n")
    .map((line) => line.replace(/\s+$/g, "")) // trailing만 제거
    .join("\n");

  // 6. 최종 정리
  return text.trim();
}
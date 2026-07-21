/**
 * MDX 원문 → 예상 읽기 시간(분). 한글은 분당 ~500자, 영문은 분당 ~200단어 기준.
 * 코드블록·마크업 문법은 대략 걷어내고 본문만 센다 — 표기용 추정치라 정밀할 필요 없다.
 */
export function readingMinutes(raw: string): number {
  const text = raw
    .replace(/```[\s\S]*?```/g, " ") // 코드블록
    .replace(/`[^`]*`/g, " ") // 인라인 코드
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // 이미지
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // 링크 → 라벨만
    .replace(/[#>*_~\-|]/g, " ");

  const cjkCount = (text.match(/[ㄱ-힝一-鿿]/g) ?? []).length;
  const wordCount = (
    text.replace(/[ㄱ-힝一-鿿]/g, " ").match(/[A-Za-z0-9]+/g) ?? []
  ).length;

  return Math.max(1, Math.round(cjkCount / 500 + wordCount / 200));
}

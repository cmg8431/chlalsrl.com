/**
 * 성과 제목으로 그 항목을 찾아 화면 가운데에 세우고 한 번 반짝인다.
 *
 * 첫 화면 수치와 요약 카드가 같은 동작을 쓴다 — 훑다가 "이건 진짜야?" 싶은
 * 순간에 근거로 가는 길은 문서 안에서 한 가지여야 한다.
 */
export function jumpToAchievement(title: string): void {
  const target = document.querySelector<HTMLElement>(
    `[data-guide-label="${CSS.escape(title)}"]`,
  );
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const top = Math.max(
    0,
    rect.top + window.scrollY - (window.innerHeight - rect.height) / 2,
  );
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });

  // 스무스 스크롤이 무시되는 환경이 있어 움직였는지 확인하고 보정한다
  window.setTimeout(() => {
    if (Math.abs(window.scrollY - top) > 4 && window.scrollY === 0) {
      document.documentElement.scrollTop = top;
    }
  }, 260);

  // 도착한 자리를 한 번 반짝여 어디로 왔는지 알려준다
  target.setAttribute("data-landed", "");
  window.setTimeout(() => target.removeAttribute("data-landed"), 1200);
}

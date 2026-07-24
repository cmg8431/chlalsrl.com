import { type LocaleType, localeHref, persistLocaleSwitch } from "./helpers";

/** globals.css의 lang-exit 길이와 동기화 */
const EXIT_MS = 200;

/**
 * 언어 전환을 "재조판" 모션으로 처리한다.
 *
 * 로케일은 루트 레이아웃 세그먼트라 Next가 항상 풀 내비게이션으로 처리한다.
 * 그래서 뷰 트랜지션은 성립하지 않고, 나가는 화면을 배경색으로 흐려 덮은 뒤
 * 이동한다. 들어오는 쪽은 layout의 themeInit이 심는 data-lang-enter를 받아
 * 같은 오버레이가 걷히며 초점을 되찾는다 — 양쪽 끝이 모두 배경색이라
 * 문서 교체 구간의 빈 화면이 모션 안에 묻힌다.
 *
 * 모션 축소 환경에서는 즉시 이동으로 폴백.
 */
export function switchLocale(newLocale: LocaleType) {
  const href = localeHref(newLocale);
  if (!href) return;

  persistLocaleSwitch(newLocale);

  const go = () => {
    window.location.href = href;
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    go();
    return;
  }

  document.documentElement.dataset.langExit = "";

  // 애니메이션이 끊기거나 탭이 백그라운드로 가도 이동은 보장한다
  window.setTimeout(go, EXIT_MS);
}

import type { useTransitionRouter } from "next-view-transitions";

type TransitionRouter = ReturnType<typeof useTransitionRouter>;

/** forward = 다음(더 최신) 글로, back = 이전(더 오래된) 글로 */
export type SlideDir = "forward" | "back";

/**
 * 이전/다음 글 이동을 좌우 슬라이드 뷰 트랜지션으로 처리한다.
 * View Transitions 미지원·모션 축소 환경에서는 즉시 이동으로 폴백.
 */
export function slideNavigate(
  router: TransitionRouter,
  href: string,
  dir: SlideDir
) {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const supported = "startViewTransition" in document;

  if (reduce || !supported) {
    router.push(href);
    return;
  }

  // data-nav 동안에는 제목 모핑을 끄고 페이지 전체가 한 덩어리로 슬라이드한다
  root.dataset.nav = dir;

  router.push(href, {
    onTransitionReady: () => {
      const shift = 22;
      const out = dir === "forward" ? -shift : shift;
      const enter = dir === "forward" ? shift : -shift;
      const timing = {
        duration: 400,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      } as const;

      root.animate(
        [
          { transform: "translateX(0)", opacity: 1 },
          { transform: `translateX(${out}%)`, opacity: 0 },
        ],
        { ...timing, pseudoElement: "::view-transition-old(root)" }
      );
      root.animate(
        [
          { transform: `translateX(${enter}%)`, opacity: 0 },
          { transform: "translateX(0)", opacity: 1 },
        ],
        { ...timing, pseudoElement: "::view-transition-new(root)" }
      );
    },
  });

  window.setTimeout(() => {
    delete root.dataset.nav;
  }, 520);
}

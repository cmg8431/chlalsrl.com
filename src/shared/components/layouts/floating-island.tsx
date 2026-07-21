"use client";

import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { useLocale, useT } from "../../libs";
import { LanguageSwitcher } from "../language-switcher";
import { ThemeToggle } from "../theme-toggle";

import { HomeIcon, MessageIcon } from "./island-icons";
import { islandStore } from "./island-store";

// globals.css의 .island padding과 동기화
const ISLAND_PADDING = 16;

export function FloatingIsland() {
  const locale = useLocale();
  const t = useT();
  const pathname = usePathname();
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  const { context, message } = useSyncExternalStore(
    islandStore.subscribe,
    islandStore.get,
    islandStore.get,
  );
  const reading = context.readingMinutes !== undefined;

  const islandRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLSpanElement>(null);
  const controlsRef = useRef<HTMLSpanElement>(null);

  // 너비 FLIP — 중앙 정렬 컨테이너라 양옆으로 대칭 확장된다
  useLayoutEffect(() => {
    const island = islandRef.current;
    const msg = msgRef.current;
    const controls = controlsRef.current;
    if (!island || !msg || !controls) return;

    const target = message
      ? msg.offsetWidth + ISLAND_PADDING * 2
      : controls.offsetWidth + ISLAND_PADDING;

    island.style.width = `${island.offsetWidth}px`;
    const raf = requestAnimationFrame(() => {
      island.style.width = `${target}px`;
    });
    // 접힌 뒤 auto 복귀 — 컨트롤 구성 변화(홈 버튼 등)에 적응
    const timeout = message
      ? undefined
      : setTimeout(() => {
          island.style.width = "";
        }, 560);

    return () => {
      cancelAnimationFrame(raf);
      if (timeout) clearTimeout(timeout);
    };
  }, [message, isHome]);

  useEffect(() => {
    try {
      const switched = sessionStorage.getItem("locale-switched");
      if (!switched) return;
      sessionStorage.removeItem("locale-switched");
      if (switched === locale) {
        islandStore.notify(t("island.locale-switched"), {
          icon: "globe",
          duration: 1500,
        });
      }
    } catch {
      /* private mode */
    }
  }, [locale, t]);

  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        if (Math.abs(delta) > 6) {
          setHidden(delta > 0 && y > 96);
          lastY = y;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const progressRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!reading) return;
    let raf = 0;
    const update = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const ratio = total > 0 ? Math.min(window.scrollY / total, 1) : 0;
      progressRef.current?.style.setProperty("--p", String(ratio));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reading]);

  return (
    <>
      {reading && (
        <span
          ref={progressRef}
          aria-hidden
          className="no-print page-progress"
        />
      )}
      <div
        className={`no-print island-wrap ${
          hidden && !message ? "is-hidden" : ""
        }`}
      >
        <div
          ref={islandRef}
          className={`island ${message ? "has-msg" : ""}`}
          role="status"
          onClick={message ? () => islandStore.dismiss() : undefined}
        >
          <span ref={msgRef} className="island-msg" aria-live="polite">
            {message?.icon && <MessageIcon name={message.icon} />}
            {message?.text}
          </span>

          <span
            ref={controlsRef}
            className="island-controls"
            aria-hidden={Boolean(message)}
          >
            {!isHome && (
              <Link
                href={`/${locale}`}
                aria-label="Home"
                tabIndex={message ? -1 : 0}
                className="flex h-7 w-7 items-center justify-center rounded-full text-faint transition-colors hover:bg-soft hover:text-bright"
              >
                <HomeIcon />
              </Link>
            )}
            <button
              onClick={() => window.dispatchEvent(new Event("open-search"))}
              aria-label="Search"
              tabIndex={message ? -1 : 0}
              className="flex h-8 items-center rounded-full bg-soft px-3.5 font-mono text-[13px] text-muted transition-colors hover:bg-line hover:text-bright"
            >
              ⌘K
            </button>
            <ThemeToggle />
            <LanguageSwitcher />
          </span>
        </div>
      </div>
    </>
  );
}

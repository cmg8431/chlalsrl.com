"use client";

import { useTransitionRouter } from "next-view-transitions";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { formatYearMonth } from "../libs/format";

import { RECENT_POSTS_KEY } from "./recent-tracker";

export interface CommandItem {
  title: string;
  description?: string;
  date?: string;
  href: string;
  /** 있으면 날짜 대신 이 라벨을 우측에 표기 (내비게이션 액션용) */
  meta?: string;
  /** 본문 매칭 시 보여줄 주변 문맥 */
  snippet?: string;
}

interface CommandMenuProps {
  items: CommandItem[];
  placeholder: string;
  emptyMessage: string;
  recentLabel: string;
}

/** 검색어와 일치하는 구간을 밝게 표시 */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const index = text.toLowerCase().indexOf(q.toLowerCase());
  if (index === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded-[3px] bg-soft px-0.5 text-bright">
        {text.slice(index, index + q.length)}
      </mark>
      {text.slice(index + q.length)}
    </>
  );
}

export function CommandMenu({
  items,
  placeholder,
  emptyMessage,
  recentLabel,
}: CommandMenuProps) {
  const router = useTransitionRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [recent, setRecent] = useState<CommandItem[]>([]);
  // 본문 검색 인덱스 — 첫 오픈 때 한 번만 받아온다
  const [bodyIndex, setBodyIndex] = useState<Record<string, string> | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || bodyIndex !== null) return;
    const locale = window.location.pathname.split("/")[1] || "ko";
    fetch(`/${locale}/search-index.json`)
      .then((res) => res.json())
      .then((rows: { href: string; body: string }[]) => {
        setBodyIndex(
          Object.fromEntries(rows.map((row) => [row.href, row.body]))
        );
      })
      .catch(() => setBodyIndex({}));
  }, [open, bodyIndex]);

  // 열릴 때마다 최근 본 글을 읽어온다
  useEffect(() => {
    if (!open) return;
    try {
      setRecent(
        JSON.parse(localStorage.getItem(RECENT_POSTS_KEY) ?? "[]") as CommandItem[]
      );
    } catch {
      setRecent([]);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // 빈 쿼리: 최근 본 글을 맨 위에, 나머지는 중복 제거 후 이어 붙인다
      const recentItems = recent.map((item) => ({
        ...item,
        meta: recentLabel,
      }));
      const recentHrefs = new Set(recentItems.map((item) => item.href));
      return [
        ...recentItems,
        ...items.filter((item) => !recentHrefs.has(item.href)),
      ];
    }
    const direct = items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
    );

    // 제목·설명에 없으면 본문에서 찾고, 매칭 주변을 스니펫으로 보여준다
    if (!bodyIndex) return direct;
    const directHrefs = new Set(direct.map((item) => item.href));
    const bodyMatches: CommandItem[] = [];
    for (const item of items) {
      if (directHrefs.has(item.href)) continue;
      const body = bodyIndex[item.href];
      if (!body) continue;
      const at = body.toLowerCase().indexOf(q);
      if (at === -1) continue;
      const start = Math.max(0, at - 24);
      bodyMatches.push({
        ...item,
        snippet:
          (start > 0 ? "…" : "") +
          body.slice(start, at + q.length + 44).trim() +
          "…",
      });
    }
    return [...direct, ...bodyMatches];
  }, [items, query, recent, recentLabel, bodyIndex]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-search", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  if (!open) return null;

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    }
    if (e.key === "Enter" && filtered[cursor]) {
      close();
      router.push(filtered[cursor].href);
    }
  };

  return (
    <div className="cmd-overlay" onClick={close} role="dialog" aria-modal>
      <div className="cmd-panel" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onInputKey}
          placeholder={placeholder}
          className="cmd-input"
          aria-label={placeholder}
        />
        <ul className="cmd-list">
          {filtered.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-faint">
              {emptyMessage}
            </li>
          ) : (
            filtered.map((item, i) => (
              <li key={item.href}>
                <button
                  onClick={() => {
                    close();
                    router.push(item.href);
                  }}
                  onMouseEnter={() => setCursor(i)}
                  className={`cmd-item ${i === cursor ? "is-active" : ""}`}
                >
                  <span className="flex min-w-0 flex-col items-start gap-0.5">
                    <span className="max-w-full truncate">
                      <Highlight text={item.title} query={query} />
                    </span>
                    {item.snippet && (
                      <span className="max-w-full truncate text-xs text-faint">
                        <Highlight text={item.snippet} query={query} />
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-faint">
                    {item.meta ?? (item.date ? formatYearMonth(item.date) : "")}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="cmd-hint">
          <span>↑↓</span>
          <span>↵</span>
          <span>esc</span>
        </div>
      </div>
    </div>
  );
}

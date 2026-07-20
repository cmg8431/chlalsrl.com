"use client";

import { useTransitionRouter } from "next-view-transitions";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { formatYearMonth } from "../libs/format";

export interface CommandItem {
  title: string;
  description?: string;
  date: string;
  href: string;
}

interface CommandMenuProps {
  items: CommandItem[];
  placeholder: string;
  emptyMessage: string;
}

export function CommandMenu({
  items,
  placeholder,
  emptyMessage,
}: CommandMenuProps) {
  const router = useTransitionRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
    );
  }, [items, query]);

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
                  <span className="truncate">{item.title}</span>
                  <span className="shrink-0 font-mono text-xs text-faint">
                    {formatYearMonth(item.date)}
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

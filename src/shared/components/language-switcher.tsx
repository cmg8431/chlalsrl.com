"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { changeLanguage, SUPPORTED_LOCALES, useLocale, useT } from "../libs";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useT();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  const toggle = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        top: rect.bottom + 10,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Change language"
        className={`flex h-7 items-center gap-1 rounded-full px-2 font-mono text-[11px] uppercase text-faint transition-colors hover:bg-soft hover:text-bright ${className}`}
      >
        {locale}
        <svg
          width="8"
          height="8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="m5 9 7 7 7-7" />
        </svg>
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[70]" onClick={() => setOpen(false)}>
            <div
              role="menu"
              className="lang-menu"
              style={{ top: position.top, right: position.right }}
              onClick={(e) => e.stopPropagation()}
            >
              {SUPPORTED_LOCALES.map((loc) => {
                const active = loc === locale;
                return (
                  <button
                    key={loc}
                    role="menuitem"
                    onClick={() => {
                      setOpen(false);
                      changeLanguage(loc);
                    }}
                    className={`flex w-full items-center justify-between gap-6 rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                      active
                        ? "font-medium text-bright"
                        : "text-muted hover:bg-soft hover:text-bright"
                    }`}
                  >
                    <span>{t(`languages.${loc}`)}</span>
                    <span className="font-mono text-[10px] uppercase text-faint">
                      {active ? "✓" : loc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

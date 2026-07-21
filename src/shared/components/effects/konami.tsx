"use client";

import { useEffect } from "react";

import { islandStore } from "../layouts/island-store";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

/** 코나미 커맨드를 입력하면 아일랜드가 반겨준다 */
export function Konami({ message }: { message: string }) {
  useEffect(() => {
    let progress = 0;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA)$/.test(target.tagName)) return;

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (key === SEQUENCE[progress]) {
        progress += 1;
      } else {
        progress = key === SEQUENCE[0] ? 1 : 0;
      }
      if (progress === SEQUENCE.length) {
        progress = 0;
        islandStore.notify(message, { icon: "heart", duration: 2600 });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [message]);

  return null;
}

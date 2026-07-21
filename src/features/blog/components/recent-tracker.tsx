"use client";

import { useEffect } from "react";

export const RECENT_POSTS_KEY = "recent-posts";

interface RecentPost {
  href: string;
  title: string;
  date: string;
}

/** 글 방문 기록 — ⌘K의 '최근 본 글' 섹션에 쓰인다 (최대 5개) */
export function RecentTracker({ href, title, date }: RecentPost) {
  useEffect(() => {
    try {
      const list = JSON.parse(
        localStorage.getItem(RECENT_POSTS_KEY) ?? "[]",
      ) as RecentPost[];
      const next = [
        { href, title, date },
        ...list.filter((item) => item.href !== href),
      ].slice(0, 5);
      localStorage.setItem(RECENT_POSTS_KEY, JSON.stringify(next));
    } catch {
      /* private mode */
    }
  }, [href, title, date]);

  return null;
}

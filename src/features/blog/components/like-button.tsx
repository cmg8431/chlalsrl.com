"use client";

import { useEffect, useState } from "react";

import { islandStore, useT } from "@/shared";

import {
  fetchLikeState,
  guestbookEnabled,
  toggleLike,
  type LikeState,
} from "../libs/guestbook";

export function LikeButton({ slug }: { slug: string }) {
  const t = useT();
  const [state, setState] = useState<LikeState | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!guestbookEnabled) return;
    fetchLikeState(slug)
      .then(setState)
      .catch(() => setState(null));
  }, [slug]);

  if (!guestbookEnabled) return null;

  const liked = state?.liked ?? false;

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    const prev = state;
    if (prev) {
      setState({
        likes: prev.likes + (prev.liked ? -1 : 1),
        liked: !prev.liked,
      });
    }
    try {
      const next = await toggleLike(slug);
      setState(next);
      if (next.liked) {
        islandStore.notify(t("island.thanks"), {
          icon: "heart",
          duration: 1200,
        });
      }
    } catch {
      setState(prev ?? null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-14 flex justify-center">
      <button
        onClick={toggle}
        aria-pressed={liked}
        aria-label="Like"
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${
          liked
            ? "border-faint bg-soft text-bright"
            : "border-line text-muted hover:border-faint hover:text-bright"
        }`}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={`transition-transform duration-300 ${liked ? "scale-110" : ""}`}
        >
          <path d="M12 20.5s-7.5-4.7-9.5-9A5.3 5.3 0 0 1 12 6.6a5.3 5.3 0 0 1 9.5 4.9c-2 4.3-9.5 9-9.5 9Z" />
        </svg>
        {state !== null && (
          <span className="font-mono text-xs tabular-nums">{state.likes}</span>
        )}
      </button>
    </div>
  );
}

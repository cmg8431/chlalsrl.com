"use client";

import { useEffect, useState } from "react";

import { islandStore, useT } from "@/shared";

import {
  fetchLikeState,
  guestbookEnabled,
  toggleLike,
  type LikeState,
} from "../libs/guestbook";

const BURST_ANGLES = [-70, -30, 10, 190, 230, 150];

export function LikeButton({ slug }: { slug: string }) {
  const t = useT();
  const [state, setState] = useState<LikeState | null>(null);
  const [busy, setBusy] = useState(false);
  // 좋아요 순간마다 키를 바꿔 파티클을 새로 그린다
  const [burst, setBurst] = useState(0);

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
      if (!prev.liked) setBurst((n) => n + 1);
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
        className={`relative flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${
          liked
            ? "border-faint bg-soft text-bright"
            : "border-line text-muted hover:border-faint hover:text-bright"
        }`}
      >
        {burst > 0 && (
          <span key={burst} aria-hidden className="like-burst">
            {BURST_ANGLES.map((angle) => (
              <span
                key={angle}
                style={
                  {
                    "--dx": `${Math.cos((angle * Math.PI) / 180) * 34}px`,
                    "--dy": `${Math.sin((angle * Math.PI) / 180) * 34}px`,
                  } as React.CSSProperties
                }
              />
            ))}
          </span>
        )}
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

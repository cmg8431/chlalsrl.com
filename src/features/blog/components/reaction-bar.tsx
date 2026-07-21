"use client";

import { useEffect, useState } from "react";

import {
  fetchReactions,
  guestbookEnabled,
  toggleReaction,
  type ReactionState,
} from "../libs/guestbook";

export function ReactionBar({ slug }: { slug: string }) {
  const [reactions, setReactions] = useState<ReactionState[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [pop, setPop] = useState<string | null>(null);

  useEffect(() => {
    if (!guestbookEnabled) return;
    fetchReactions(slug)
      .then(setReactions)
      .catch(() => setReactions(null));
  }, [slug]);

  if (!guestbookEnabled || !reactions) return null;

  const toggle = async (emoji: string) => {
    if (busy) return;
    setBusy(emoji);
    const prev = reactions;
    setReactions((rs) =>
      rs!.map((r) =>
        r.emoji === emoji
          ? { ...r, reacted: !r.reacted, count: r.count + (r.reacted ? -1 : 1) }
          : r
      )
    );
    setPop(emoji);
    window.setTimeout(() => setPop(null), 300);
    try {
      setReactions(await toggleReaction(slug, emoji));
    } catch {
      setReactions(prev);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mt-14 flex flex-wrap justify-center gap-2">
      {reactions.map(({ emoji, count, reacted }) => (
        <button
          key={emoji}
          onClick={() => toggle(emoji)}
          aria-pressed={reacted}
          aria-label={emoji}
          className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-90 ${
            reacted
              ? "bg-line text-bright"
              : "bg-soft text-muted hover:text-bright"
          }`}
        >
          <span
            className={`text-base leading-none transition-transform duration-300 ${
              pop === emoji ? "scale-150" : ""
            }`}
          >
            {emoji}
          </span>
          {count > 0 && (
            <span className="font-mono text-xs tabular-nums">{count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

// 배럴(@/features/blog)로 들여오면 서버 전용 콘텐츠 모듈(node:fs)까지 딸려와
// 클라이언트 번들이 깨진다 — 블로그의 클라이언트 컴포넌트들과 같이 깊은 경로로 집는다
import { Comments } from "@/features/blog/components/comments";
import {
  COMMENT_ADDED,
  type CommentAddedDetail,
  fetchComments,
  fetchLikeState,
  guestbookEnabled,
  type LikeState,
  toggleLike,
} from "@/features/blog/libs/guestbook";
import { useT } from "@/shared";

/**
 * 문서 오른쪽에 떠 있는 반응 독.
 *
 * 이력서 밑에 댓글창을 길게 붙이면 문서가 끝나고 게시판이 시작되는 꼴이 된다.
 * 반응은 문서 밖에 떠 있게 두고, 누르면 오른쪽에서 패널이 밀려 들어온다 —
 * 읽던 자리를 잃지 않고 한마디 남기고 다시 닫을 수 있어야 한다.
 *
 * Supabase 키가 없으면 아무것도 그리지 않는다(게스트북과 같은 규칙).
 */
export function ResumeDock({ slug }: { slug: string }) {
  const t = useT();
  const [like, setLike] = useState<LikeState | null>(null);
  const [comments, setComments] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  // 좋아요를 누른 순간에만 하트가 한 번 뛴다
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (!guestbookEnabled) return;
    fetchLikeState(slug)
      .then(setLike)
      .catch(() => {});
    fetchComments(slug)
      .then((rows) => setComments(rows.length))
      .catch(() => {});
  }, [slug]);

  // 댓글 목록은 자기 상태를 스스로 갱신한다 — 독의 개수는 여기서 따라간다
  useEffect(() => {
    const onAdded = (event: Event) => {
      const detail = (event as CustomEvent<CommentAddedDetail>).detail;
      if (detail?.slug !== slug) return;
      setComments((count) => (count === null ? 1 : count + 1));
    };
    window.addEventListener(COMMENT_ADDED, onAdded);
    return () => window.removeEventListener(COMMENT_ADDED, onAdded);
  }, [slug]);

  // 패널은 덮는 물건이라 Esc로 닫히지 않으면 갇힌 느낌이 든다
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!guestbookEnabled) return null;

  const liked = like?.liked ?? false;

  const onLike = async () => {
    if (busy) return;
    setBusy(true);
    // 눌린 느낌이 먼저 와야 한다 — 서버 응답은 그다음에 맞춘다
    if (like) {
      setLike({ likes: like.likes + (liked ? -1 : 1), liked: !liked });
      if (!liked) setBeat((n) => n + 1);
    }
    try {
      setLike(await toggleLike(slug));
    } catch {
      if (like) setLike(like);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="resume-dock no-print">
        <button
          type="button"
          onClick={onLike}
          aria-pressed={liked}
          aria-label={t("resume.like")}
          className="resume-dock-btn"
        >
          <svg
            key={beat}
            viewBox="0 0 20 18"
            width="16"
            height="16"
            aria-hidden
            className={beat > 0 ? "resume-dock-beat" : undefined}
          >
            <path
              d="M10 17S1 11.5 1 5.9A4.9 4.9 0 0 1 10 3a4.9 4.9 0 0 1 9 2.9C19 11.5 10 17 10 17z"
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <span className="resume-dock-count">{like?.likes ?? "·"}</span>
        </button>

        <span className="resume-dock-sep" />

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("resume.comments")}
          className="resume-dock-btn"
        >
          <svg viewBox="0 0 20 18" width="16" height="16" aria-hidden>
            <path
              d="M2 3.5A2.5 2.5 0 0 1 4.5 1h11A2.5 2.5 0 0 1 18 3.5v7a2.5 2.5 0 0 1-2.5 2.5H8l-4.5 3.5V13A2.5 2.5 0 0 1 2 10.5z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <span className="resume-dock-count">{comments ?? "·"}</span>
        </button>
      </div>

      {open && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={t("resume.close")}
          className="resume-panel-scrim no-print"
        />
      )}

      <aside
        aria-hidden={!open}
        className={`resume-panel no-print${open ? " is-open" : ""}`}
      >
        <div className="resume-panel-head">
          <span>
            {t("resume.comments")}
            {comments !== null && comments > 0 && (
              <span className="resume-panel-count">{comments}</span>
            )}
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("resume.close")}
            className="resume-panel-close"
          >
            <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden>
              <path
                d="M1 1l10 10M11 1L1 11"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
        </div>
        <div className="resume-panel-body">
          <Comments slug={slug} />
        </div>
      </aside>
    </>
  );
}

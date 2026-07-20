"use client";

import { useEffect, useState } from "react";

import { islandStore, useT, type TFunction } from "@/shared";

import { formatDateDot } from "../libs/format";
import {
  addComment,
  fetchComments,
  guestbookEnabled,
  type CommentRow,
} from "../libs/guestbook";

interface CommentFormProps {
  t: TFunction;
  bodyPlaceholder: string;
  compact?: boolean;
  busy: boolean;
  onSubmit: (author: string, body: string) => Promise<boolean>;
  onCancel?: () => void;
}

function CommentForm({
  t,
  bodyPlaceholder,
  compact = false,
  busy,
  onSubmit,
  onCancel,
}: CommentFormProps) {
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [trap, setTrap] = useState(""); // honeypot

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = author.trim();
    const text = body.trim();
    if (!name || !text || busy || trap) return;
    const ok = await onSubmit(name, text);
    if (ok) setBody("");
  };

  return (
    <form
      onSubmit={submit}
      className={`rounded-xl border border-line p-4 ${compact ? "mt-3" : "mt-6"}`}
    >
      <input
        type="text"
        value={trap}
        onChange={(e) => setTrap(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder={t("comments.name")}
        aria-label={t("comments.name")}
        maxLength={40}
        required
        className="input-quiet max-w-[12rem]"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={bodyPlaceholder}
        aria-label={bodyPlaceholder}
        maxLength={1000}
        rows={compact ? 2 : 3}
        required
        className="input-quiet mt-3 resize-none leading-relaxed"
      />
      <div className="mt-2 flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-4 py-1.5 text-sm text-faint transition-colors hover:text-bright"
          >
            {t("comments.cancel")}
          </button>
        )}
        <button
          type="submit"
          disabled={busy || !author.trim() || !body.trim()}
          className="rounded-full border border-line px-4 py-1.5 text-sm text-muted transition-colors hover:border-faint hover:text-bright disabled:cursor-default disabled:opacity-40 disabled:hover:border-line disabled:hover:text-muted"
        >
          {t("comments.submit")}
        </button>
      </div>
    </form>
  );
}

function CommentBody({
  comment,
  small = false,
}: {
  comment: CommentRow;
  small?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <span
        aria-hidden
        className={`flex shrink-0 select-none items-center justify-center rounded-full bg-soft font-semibold text-muted ${
          small ? "h-7 w-7 text-[12px]" : "h-8 w-8 text-[13px]"
        }`}
      >
        {comment.author.slice(0, 1).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2.5">
          <span className="text-sm font-medium text-bright">
            {comment.author}
          </span>
          <time
            dateTime={comment.created_at}
            className="font-mono text-[11px] tabular-nums text-faint"
          >
            {formatDateDot(comment.created_at)}
          </time>
        </div>
        <p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed">
          {comment.body}
        </p>
      </div>
    </div>
  );
}

export function Comments({ slug }: { slug: string }) {
  const t = useT();

  const [comments, setComments] = useState<CommentRow[] | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!guestbookEnabled) return;
    fetchComments(slug)
      .then(setComments)
      .catch(() => setComments([]));
  }, [slug]);

  if (!guestbookEnabled) return null;

  const post = async (
    author: string,
    body: string,
    parentId: string | null
  ): Promise<boolean> => {
    setBusy(true);
    try {
      await addComment(slug, author, body, parentId);
      setComments((prev) => [
        ...(prev ?? []),
        {
          id: `local-${(prev?.length ?? 0) + 1}`,
          author,
          body,
          created_at: new Date().toISOString(),
          parent_id: parentId,
        },
      ]);
      setReplyTo(null);
      islandStore.notify(t("comments.posted"), { icon: "check", duration: 1400 });
      return true;
    } catch {
      return false;
    } finally {
      setBusy(false);
    }
  };

  const roots = comments?.filter((c) => !c.parent_id) ?? [];
  const repliesOf = (id: string) =>
    comments?.filter((c) => c.parent_id === id) ?? [];

  return (
    <section className="mt-16 border-t border-line pt-10">
      <h2 className="text-sm font-medium text-bright">
        {t("comments.title")}
        {comments && comments.length > 0 && (
          <span className="ml-2 font-mono text-xs font-normal text-faint">
            {comments.length}
          </span>
        )}
      </h2>

      <CommentForm
        t={t}
        bodyPlaceholder={t("comments.body")}
        busy={busy}
        onSubmit={(author, body) => post(author, body, null)}
      />

      <div className="mt-8">
        {comments && comments.length === 0 && (
          <p className="text-sm text-faint">{t("comments.empty")}</p>
        )}
        <ul className="divide-y divide-line">
          {roots.map((comment) => (
            <li key={comment.id} className="py-5">
              <CommentBody comment={comment} />

              <button
                onClick={() =>
                  setReplyTo(replyTo === comment.id ? null : comment.id)
                }
                aria-expanded={replyTo === comment.id}
                className="mt-1.5 ml-11 text-[12px] font-medium text-faint transition-colors hover:text-bright"
              >
                {t("comments.reply")}
              </button>

              {(repliesOf(comment.id).length > 0 ||
                replyTo === comment.id) && (
                <div className="mt-3 ml-4 space-y-4 border-l-2 border-line pl-4">
                  {repliesOf(comment.id).map((reply) => (
                    <div key={reply.id}>
                      <CommentBody comment={reply} small />
                    </div>
                  ))}
                  {replyTo === comment.id && (
                    <CommentForm
                      t={t}
                      bodyPlaceholder={t("comments.reply-body")}
                      compact
                      busy={busy}
                      onSubmit={(author, body) =>
                        post(author, body, comment.id)
                      }
                      onCancel={() => setReplyTo(null)}
                    />
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

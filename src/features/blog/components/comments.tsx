"use client";

import { useEffect, useRef, useState } from "react";

import {
  islandStore,
  type LocaleType,
  type TFunction,
  useLocale,
  useT,
} from "@/shared";

import { formatRelativeOrDate } from "../libs/format";
import {
  addComment,
  type CommentRow,
  fetchComments,
  guestbookEnabled,
} from "../libs/guestbook";

interface CommentFormProps {
  t: TFunction;
  bodyPlaceholder: string;
  compact?: boolean;
  busy: boolean;
  onSubmit: (author: string, body: string) => Promise<boolean>;
  onCancel?: () => void;
}

const AUTHOR_KEY = "comment-author";
const BODY_MAX = 1000;

const NICK_PARTS: Record<LocaleType, { adj: string[]; noun: string[] }> = {
  ko: {
    adj: [
      "다정한",
      "씩씩한",
      "명랑한",
      "조용한",
      "수줍은",
      "용감한",
      "느긋한",
      "엉뚱한",
      "포근한",
      "새침한",
      "반짝이는",
      "궁금한",
    ],
    noun: [
      "강아지",
      "고양이",
      "여우",
      "판다",
      "토끼",
      "수달",
      "펭귄",
      "고슴도치",
      "다람쥐",
      "부엉이",
      "돌고래",
      "곰",
    ],
  },
  en: {
    adj: [
      "Cozy",
      "Brave",
      "Merry",
      "Quiet",
      "Shy",
      "Mellow",
      "Quirky",
      "Sunny",
      "Gentle",
      "Curious",
      "Sparkly",
      "Sleepy",
    ],
    noun: [
      "Puppy",
      "Cat",
      "Fox",
      "Panda",
      "Rabbit",
      "Otter",
      "Penguin",
      "Hedgehog",
      "Squirrel",
      "Owl",
      "Dolphin",
      "Bear",
    ],
  },
  ja: {
    adj: [
      "やさしい",
      "げんきな",
      "しずかな",
      "ゆかいな",
      "はにかむ",
      "ゆったり",
      "ふしぎな",
      "ふわふわ",
      "きらきら",
      "ねむたい",
      "まじめな",
      "こっそり",
    ],
    noun: [
      "いぬ",
      "ねこ",
      "きつね",
      "ぱんだ",
      "うさぎ",
      "かわうそ",
      "ぺんぎん",
      "はりねずみ",
      "りす",
      "ふくろう",
      "いるか",
      "くま",
    ],
  },
};

function randomNickname(locale: LocaleType): string {
  const parts = NICK_PARTS[locale] ?? NICK_PARTS.ko;
  const pick = (list: string[]) =>
    list[Math.floor(Math.random() * list.length)] ?? "";
  const joiner = locale === "en" ? " " : "";
  return pick(parts.adj) + joiner + pick(parts.noun);
}

function CommentForm({
  t,
  bodyPlaceholder,
  compact = false,
  busy,
  onSubmit,
  onCancel,
}: CommentFormProps) {
  const locale = useLocale();
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [trap, setTrap] = useState(""); // honeypot
  const [rolling, setRolling] = useState(false);
  const rollTimer = useRef(0);

  // 저장된 이름이 있으면 쓰고, 없으면 랜덤 닉네임으로 시작한다
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(AUTHOR_KEY);
    } catch {
      /* private mode */
    }
    setAuthor(saved || randomNickname(locale));
  }, [locale]);

  useEffect(() => () => window.clearInterval(rollTimer.current), []);

  // 슬롯처럼 몇 번 굴리다가 멈춘다 — 아바타는 이름 해시라 함께 바뀐다
  const roll = () => {
    if (rolling) return;
    setRolling(true);
    let ticks = 0;
    rollTimer.current = window.setInterval(() => {
      setAuthor(randomNickname(locale));
      ticks += 1;
      if (ticks >= 8) {
        window.clearInterval(rollTimer.current);
        setRolling(false);
      }
    }, 70);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = author.trim();
    const text = body.trim();
    if (!name || !text || busy || trap) return;
    const ok = await onSubmit(name, text);
    if (ok) {
      setBody("");
      try {
        localStorage.setItem(AUTHOR_KEY, name);
      } catch {
        /* private mode */
      }
    }
  };

  return (
    <form
      onSubmit={submit}
      className={`comment-card overflow-hidden rounded-xl border border-line bg-soft/40 ${
        compact ? "mt-3" : "mt-6"
      }`}
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
      <div className="flex items-center gap-2.5 px-4 pt-3 pb-1">
        <Avatar name={author} small />
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder={t("comments.name")}
          aria-label={t("comments.name")}
          maxLength={40}
          required
          readOnly={rolling}
          className="min-w-0 flex-1 appearance-none border-0 bg-transparent text-base font-medium text-bright outline-none placeholder:font-normal placeholder:text-faint sm:text-sm"
        />
        <button
          type="button"
          onClick={roll}
          disabled={rolling}
          aria-label={t("comments.roll")}
          title={t("comments.roll")}
          className="shrink-0 rounded-full p-1.5 text-faint transition-colors hover:text-bright disabled:pointer-events-none"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className={rolling ? "animate-spin" : ""}
          >
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <path d="M21 3v6h-6" />
          </svg>
        </button>
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          // ⌘/Ctrl+Enter로 바로 등록
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit(e);
        }}
        placeholder={bodyPlaceholder}
        aria-label={bodyPlaceholder}
        maxLength={1000}
        rows={compact ? 2 : 3}
        required
        className="w-full appearance-none resize-none border-0 bg-transparent px-4 pt-2 pb-3 text-base leading-relaxed text-foreground outline-none placeholder:text-faint sm:text-sm"
      />
      <div className="flex items-center justify-end gap-3 px-3 pb-3">
        {/* 제한에 가까워질 때만 카운터 노출 */}
        {body.length > BODY_MAX * 0.8 && (
          <span
            className={`font-mono text-[11px] tabular-nums ${
              body.length >= BODY_MAX ? "text-bright" : "text-faint"
            }`}
          >
            {body.length}/{BODY_MAX}
          </span>
        )}
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
          className="rounded-full bg-bright px-4 py-1.5 text-sm font-medium text-background transition-all hover:opacity-85 active:scale-95 disabled:cursor-default disabled:bg-line disabled:text-faint disabled:hover:opacity-100"
        >
          {t("comments.submit")}
        </button>
      </div>
    </form>
  );
}

// 이름 해시로 이모지·배경을 고정 — 같은 작성자는 항상 같은 아바타를 받는다
const AVATAR_EMOJI = [
  "🦊",
  "🐻",
  "🐼",
  "🐰",
  "🦁",
  "🐯",
  "🐨",
  "🐸",
  "🐙",
  "🦉",
  "🐳",
  "🦄",
  "🐹",
  "🐥",
  "🐢",
  "🦋",
];
const AVATAR_BG = [
  "hsla(14, 85%, 60%, 0.16)",
  "hsla(42, 90%, 55%, 0.18)",
  "hsla(140, 60%, 45%, 0.15)",
  "hsla(200, 80%, 55%, 0.16)",
  "hsla(260, 70%, 60%, 0.15)",
  "hsla(330, 75%, 60%, 0.14)",
];

function hashName(name: string): number {
  let hash = 0;
  for (const ch of name) {
    hash = (hash * 31 + (ch.codePointAt(0) ?? 0)) >>> 0;
  }
  return hash;
}

function Avatar({ name, small }: { name: string; small: boolean }) {
  const hash = hashName(name);
  return (
    <span
      aria-hidden
      style={{ backgroundColor: AVATAR_BG[(hash >> 4) % AVATAR_BG.length] }}
      className={`flex shrink-0 select-none items-center justify-center rounded-full ${
        small ? "h-7 w-7 text-[14px]" : "h-8 w-8 text-[16px]"
      }`}
    >
      {AVATAR_EMOJI[hash % AVATAR_EMOJI.length]}
    </span>
  );
}

function CommentBody({
  comment,
  small = false,
}: {
  comment: CommentRow;
  small?: boolean;
}) {
  const locale = useLocale();
  return (
    <div className="flex gap-3">
      <Avatar name={comment.author} small={small} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2.5">
          <span className="text-sm font-medium text-bright">
            {comment.author}
          </span>
          <time
            dateTime={comment.created_at}
            className="font-mono text-[11px] tabular-nums text-faint"
          >
            {formatRelativeOrDate(comment.created_at, locale)}
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
    parentId: string | null,
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
      islandStore.notify(t("comments.posted"), {
        icon: "check",
        duration: 1400,
      });
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
    <section className="mt-16">
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
        <ul className="space-y-8">
          {roots.map((comment) => (
            <li key={comment.id}>
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

              {(repliesOf(comment.id).length > 0 || replyTo === comment.id) && (
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

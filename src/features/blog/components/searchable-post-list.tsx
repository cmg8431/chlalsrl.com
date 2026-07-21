"use client";

import { Link } from "next-view-transitions";
import { useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";

import { formatDateDot, formatYearMonth } from "../libs/format";

export interface PostItem {
  id: string;
  title: string;
  date: string;
  href: string;
  category: string;
  categoryLabel: string;
  draft?: boolean;
  /** 검색 매칭에만 쓰인다 — 화면에는 그리지 않음 */
  description?: string;
  tags?: string[];
}

export interface CategoryOption {
  key: string;
  label: string;
}

interface SearchablePostListProps {
  posts: PostItem[];
  /** "전체" 포함 카테고리 필터 목록 — 2개 이하(전체+1)면 필터 숨김 */
  categories: CategoryOption[];
  allLabel: string;
  placeholder: string;
  emptyMessage: string;
  noResultMessage: string;
  draftLabel: string;
  resetLabel: string;
}

function Row({
  post,
  showCategory,
  draftLabel,
}: {
  post: PostItem;
  showCategory: boolean;
  draftLabel: string;
}) {
  // 작성중 글은 제목만 예고편으로 노출 — 링크 없이 배지로 상태를 알린다
  if (post.draft) {
    return (
      <div className="-mx-4 flex items-baseline justify-between gap-6 rounded-md px-4 py-4">
        <span className="flex min-w-0 items-baseline gap-2.5">
          {showCategory && (
            <span className="shrink-0 text-[11px] text-faint">
              {post.categoryLabel}
            </span>
          )}
          <span className="truncate text-faint">{post.title}</span>
        </span>
        <span className="flex shrink-0 items-baseline gap-2.5">
          <time
            dateTime={post.date}
            className="hidden font-mono text-xs tabular-nums text-faint sm:inline"
          >
            {formatYearMonth(post.date)}
          </time>
          <span className="rounded-full bg-soft px-2.5 py-0.5 text-[11px] text-faint">
            {draftLabel}
          </span>
        </span>
      </div>
    );
  }

  return (
    <Link
      href={post.href}
      className="row-link group -mx-4 flex items-baseline justify-between gap-6 rounded-md px-4 py-4"
    >
      <span className="flex min-w-0 items-baseline gap-2.5">
        {showCategory && (
          <span className="shrink-0 text-[11px] text-faint">
            {post.categoryLabel}
          </span>
        )}
        <span
          className="truncate text-foreground transition-colors group-hover:text-bright"
          style={
            {
              viewTransitionName: `post-${post.id}`,
              viewTransitionClass: "vt-morph",
            } as React.CSSProperties
          }
        >
          {post.title}
        </span>
      </span>
      <span className="flex shrink-0 items-baseline gap-2.5 font-mono text-xs tabular-nums text-faint">
        <time dateTime={post.date}>{formatDateDot(post.date)}</time>
      </span>
    </Link>
  );
}

export function SearchablePostList({
  posts,
  categories,
  allLabel,
  placeholder,
  emptyMessage,
  noResultMessage,
  draftLabel,
  resetLabel,
}: SearchablePostListProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  // URL(?c=&q=)과 동기화 — 필터 상태를 공유하거나 뒤로가기로 복원할 수 있게
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get("c");
    const q = params.get("q");
    if (c && categories.some((option) => option.key === c)) setCategory(c);
    if (q) setQuery(q);
    // 최초 진입 시 한 번만 복원한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (category) params.set("c", category);
    else params.delete("c");
    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");
    const next = params.toString();
    const url = next ? `?${next}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [category, query]);

  const showFilter = categories.length > 1;

  // 필터 전환 시 남는 글 제목이 새 위치로 모핑되도록 View Transition으로 감싼다
  const changeCategory = (next: string | null) => {
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (doc.startViewTransition) {
      doc.startViewTransition(() => flushSync(() => setCategory(next)));
    } else {
      setCategory(next);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (category && post.category !== category) return false;
      if (!q) return true;
      // 제목·설명·태그를 함께 검색한다
      return (
        post.title.toLowerCase().includes(q) ||
        post.description?.toLowerCase().includes(q) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [posts, query, category]);

  const byYear = useMemo(() => {
    const groups = new Map<string, PostItem[]>();
    for (const post of filtered) {
      const year = String(new Date(post.date).getFullYear());
      if (!groups.has(year)) groups.set(year, []);
      groups.get(year)!.push(post);
    }
    return Array.from(groups.entries()).sort(
      ([a], [b]) => Number(b) - Number(a),
    );
  }, [filtered]);

  if (posts.length === 0) {
    return <p className="text-sm text-faint">{emptyMessage}</p>;
  }

  return (
    <div>
      {showFilter && (
        <div className="mb-5 flex flex-wrap gap-1.5">
          {[{ key: null as string | null, label: allLabel }, ...categories].map(
            ({ key, label }) => {
              const active = category === key;
              return (
                <button
                  key={key ?? "__all"}
                  onClick={() => changeCategory(key)}
                  aria-pressed={active}
                  className={`flex h-8 items-center rounded-full px-3.5 text-[13px] transition-colors ${
                    active
                      ? "bg-soft font-medium text-bright"
                      : "text-faint hover:text-bright"
                  }`}
                >
                  {label}
                </button>
              );
            },
          )}
        </div>
      )}

      <div className="relative">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-faint"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="input-quiet !pl-7"
          aria-label={placeholder}
        />
      </div>

      <div className="mt-10 space-y-12">
        {byYear.length === 0 ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-faint">{noResultMessage}</p>
            <button
              onClick={() => {
                setQuery("");
                changeCategory(null);
              }}
              className="rounded-full border border-line px-3.5 py-1.5 text-xs text-muted transition-colors hover:border-faint hover:text-bright"
            >
              ↺ {resetLabel}
            </button>
          </div>
        ) : (
          byYear.map(([year, yearPosts]) => (
            <section key={year}>
              <h2 className="mb-2 font-mono text-xs text-faint">{year}</h2>
              <ul className="divide-y divide-line">
                {yearPosts.map((post) => (
                  <li key={post.href}>
                    <Row
                      post={post}
                      showCategory={showFilter && !category}
                      draftLabel={draftLabel}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

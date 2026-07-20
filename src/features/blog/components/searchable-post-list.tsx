"use client";

import { Link } from "next-view-transitions";
import { useMemo, useState } from "react";

import { formatDateDot } from "../libs/format";

export interface PostItem {
  id: string;
  title: string;
  date: string;
  href: string;
  category: string;
  categoryLabel: string;
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
}

function Row({ post, showCategory }: { post: PostItem; showCategory: boolean }) {
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
      <time
        dateTime={post.date}
        className="shrink-0 font-mono text-xs tabular-nums text-faint"
      >
        {formatDateDot(post.date)}
      </time>
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
}: SearchablePostListProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const showFilter = categories.length > 1;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (post) =>
        (!category || post.category === category) &&
        (!q || post.title.toLowerCase().includes(q))
    );
  }, [posts, query, category]);

  const byYear = useMemo(() => {
    const groups = new Map<string, PostItem[]>();
    for (const post of filtered) {
      const year = String(new Date(post.date).getFullYear());
      if (!groups.has(year)) groups.set(year, []);
      groups.get(year)!.push(post);
    }
    return Array.from(groups.entries()).sort(
      ([a], [b]) => Number(b) - Number(a)
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
                  onClick={() => setCategory(key)}
                  aria-pressed={active}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    active
                      ? "bg-soft font-medium text-bright"
                      : "text-faint hover:text-bright"
                  }`}
                >
                  {label}
                </button>
              );
            }
          )}
        </div>
      )}

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="input-quiet"
        aria-label={placeholder}
      />

      <div className="mt-10 space-y-12">
        {byYear.length === 0 ? (
          <p className="text-sm text-faint">{noResultMessage}</p>
        ) : (
          byYear.map(([year, yearPosts]) => (
            <section key={year}>
              <h2 className="mb-2 font-mono text-xs text-faint">{year}</h2>
              <ul className="divide-y divide-line">
                {yearPosts.map((post) => (
                  <li key={post.href}>
                    <Row post={post} showCategory={showFilter && !category} />
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

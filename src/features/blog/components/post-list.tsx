import { Link } from "next-view-transitions";

import { formatDateDot } from "../libs/format";
import { readingMinutes } from "../libs/reading-time";

import type { Content } from "../libs";
import type { LocaleType } from "@/shared";

interface PostListProps {
  contents: Content[];
  locale: LocaleType;
  emptyMessage?: string;
  /** 있으면 행 앞에 카테고리 라벨을 보여준다 (혼합 목록용) */
  categoryLabels?: Record<string, string>;
}

export function PostList({
  contents,
  locale,
  emptyMessage,
  categoryLabels,
}: PostListProps) {
  if (contents.length === 0) {
    return <p className="py-6 text-sm text-faint">{emptyMessage}</p>;
  }

  return (
    <ul className="divide-y divide-line">
      {contents.map((content) => (
        <li key={`${content.category}-${content.slug}`}>
          <Link
            href={`/${locale}/blog/${content.slug}`}
            className="row-link group -mx-4 flex items-baseline justify-between gap-6 rounded-md px-4 py-4"
          >
            <span className="flex min-w-0 items-baseline gap-2.5">
              {categoryLabels?.[content.category] && (
                <span className="shrink-0 text-[11px] text-faint">
                  {categoryLabels[content.category]}
                </span>
              )}
              <span
                className="truncate text-foreground transition-colors group-hover:text-bright"
                style={
                  {
                    viewTransitionName: `post-${content.category}-${content.slug}`,
                    viewTransitionClass: "vt-morph",
                  } as React.CSSProperties
                }
              >
                {content.frontmatter.title}
              </span>
            </span>
            <span className="flex shrink-0 items-baseline gap-2.5 font-mono text-xs tabular-nums text-faint">
              <span className="hidden sm:inline">
                {readingMinutes(content.content)} min
              </span>
              <time dateTime={content.frontmatter.date}>
                {formatDateDot(content.frontmatter.date)}
              </time>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

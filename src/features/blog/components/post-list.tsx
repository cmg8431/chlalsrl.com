import { Link } from "next-view-transitions";

import { formatDateDot } from "../libs/format";

import type { Content } from "../libs";
import type { LocaleType } from "@/shared";

interface PostListProps {
  contents: Content[];
  locale: LocaleType;
  emptyMessage?: string;
}

export function PostList({ contents, locale, emptyMessage }: PostListProps) {
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
            <span
              className="text-foreground transition-colors group-hover:text-bright"
              style={
                {
                  viewTransitionName: `post-${content.category}-${content.slug}`,
                  viewTransitionClass: "vt-morph",
                } as React.CSSProperties
              }
            >
              {content.frontmatter.title}
            </span>
            <time
              dateTime={content.frontmatter.date}
              className="shrink-0 font-mono text-xs tabular-nums text-faint"
            >
              {formatDateDot(content.frontmatter.date)}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
}

import { Link } from "next-view-transitions";

import type { ChangelogEntry } from "../libs/git";

const REPO_URL = "https://github.com/cmg8431/chlalsrl.com";

/** 타입별 도트 색 — 라이트/다크 양쪽에서 읽히는 중간 채도 고정 색 */
const TYPE_COLOR: Record<string, string> = {
  feat: "#C46B47",
  fix: "#748C7C",
  style: "#8A7FB8",
  docs: "#B08D3E",
  refactor: "#6E8CA8",
  perf: "#B8608A",
};

function formatDateDot(date: string): string {
  return date.replaceAll("-", ".");
}

export function Changelog({
  entries,
  title,
  historyLabel,
  historyHref,
}: {
  entries: ChangelogEntry[];
  title: string;
  historyLabel: string;
  historyHref: string;
}) {
  if (entries.length === 0) return null;

  return (
    <section>
      <div className="mb-1 flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <h2 className="text-sm font-medium text-bright">{title}</h2>
          <span className="font-mono text-[11px] text-faint">git log</span>
        </div>
        <Link
          href={historyHref}
          className="text-xs text-faint transition-colors hover:text-bright"
        >
          {historyLabel} →
        </Link>
      </div>
      <ul className="divide-y divide-line">
        {entries.map((entry) => (
          <li key={entry.hash}>
            <a
              href={`${REPO_URL}/commit/${entry.hash}`}
              target="_blank"
              rel="noreferrer"
              className="row-link group -mx-4 flex items-center gap-3 rounded-md px-4 py-3"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: TYPE_COLOR[entry.type] ?? "#9B958B",
                }}
              />
              <span className="w-14 shrink-0 font-mono text-[11px] text-faint">
                {entry.type}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-foreground transition-colors group-hover:text-bright">
                {entry.subject}
              </span>
              <time
                dateTime={entry.date}
                className="shrink-0 font-mono text-xs tabular-nums text-faint"
              >
                {formatDateDot(entry.date)}
              </time>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

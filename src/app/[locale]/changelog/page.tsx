import { Link } from "next-view-transitions";

import { getChangelog } from "@/features/changelog";
import { LocaleType, Reveal, translation } from "@/shared";

import type { ChangelogEntry } from "@/features/changelog";

const SITE_URL = "https://chlalsrl.com";
const REPO_URL = "https://github.com/cmg8431/chlalsrl.com";
const SUPPORTED = ["ko", "en", "ja"] as const;

const TYPE_COLOR: Record<string, string> = {
  feat: "#C46B47",
  fix: "#748C7C",
  style: "#8A7FB8",
  docs: "#B08D3E",
  refactor: "#6E8CA8",
  perf: "#B8608A",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleType }>;
}) {
  const { locale } = await params;
  const { t } = await translation(locale);
  const url = `${SITE_URL}/${locale}/changelog`;
  return {
    title: t("changelog.title"),
    description: t("changelog.description"),
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          SUPPORTED.map((loc) => [loc, `${SITE_URL}/${loc}/changelog`])
        ),
        "x-default": `${SITE_URL}/ko/changelog`,
      },
    },
    openGraph: { url, title: t("changelog.title") },
  };
}

function groupByMonth(
  entries: ChangelogEntry[]
): Array<[string, ChangelogEntry[]]> {
  const groups = new Map<string, ChangelogEntry[]>();
  for (const entry of entries) {
    const month = entry.date.slice(0, 7); // YYYY-MM
    if (!groups.has(month)) groups.set(month, []);
    groups.get(month)!.push(entry);
  }
  return Array.from(groups.entries());
}

export default async function ChangelogPage({
  params,
}: {
  params: Promise<{ locale: LocaleType }>;
}) {
  const { locale } = await params;
  const { t } = await translation(locale);
  const entries = getChangelog(80);
  const months = groupByMonth(entries);

  return (
    <div>
      <Reveal>
        <Link
          href={`/${locale}`}
          className="arrow-link text-xs text-faint transition-colors hover:text-muted"
        >
          <span className="arrow inline-block rotate-180">→</span>{" "}
          {t("post.back")}
        </Link>
        <div className="mt-6 flex items-baseline justify-between">
          <h1 className="text-xl font-semibold tracking-tight text-bright">
            {t("changelog.title")}
          </h1>
          <a
            href={`${REPO_URL}/commits/main`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-faint transition-colors hover:text-bright"
          >
            GitHub ↗
          </a>
        </div>
        <p className="mt-1 text-sm text-muted">{t("changelog.description")}</p>
      </Reveal>

      <Reveal delay={60}>
        <div className="mt-10 space-y-12">
          {months.length === 0 ? (
            <p className="text-sm text-faint">{t("changelog.empty")}</p>
          ) : (
            months.map(([month, monthEntries]) => (
              <section key={month}>
                <h2 className="mb-2 font-mono text-xs text-faint">
                  {month.replace("-", ".")}
                </h2>
                <ul className="divide-y divide-line">
                  {monthEntries.map((entry) => (
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
                            backgroundColor:
                              TYPE_COLOR[entry.type] ?? "#9B958B",
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
                          {entry.date.replaceAll("-", ".")}
                        </time>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>
      </Reveal>
    </div>
  );
}

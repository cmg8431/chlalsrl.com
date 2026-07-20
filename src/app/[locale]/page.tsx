import { Link } from "next-view-transitions";

import { getAllContentsForLocale, PostList } from "@/features/blog";
import { Changelog, getChangelog } from "@/features/changelog";
import { PROJECTS } from "@/features/projects";
import {
  CopyEmailButton,
  GithubIcon,
  LinkedinIcon,
  localizedNames,
  LocaleType,
  Reveal,
  RssIcon,
  translation,
  Wordmark,
  XIcon,
} from "@/shared";

const SECTIONS = [
  { path: "blog", key: "blog", disabled: false },
  { path: "guestbook", key: "guestbook", disabled: false },
  // 이력서는 작업 중 — 완성되면 disabled만 풀면 된다
  { path: "resume", key: "resume", disabled: true },
] as const;

const CONNECT = [
  { label: "GitHub", href: "https://github.com/cmg8431", Icon: GithubIcon },
  { label: "X", href: "https://twitter.com/cmg8431", Icon: XIcon },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/cmg8431/",
    Icon: LinkedinIcon,
  },
  { label: "RSS", href: "/rss.xml", Icon: RssIcon },
] as const;

const ICON_BUTTON_CLASS =
  "rounded-full p-2 text-faint transition-colors hover:bg-soft hover:text-bright";

const SITE_URL = "https://chlalsrl.com";
const SUPPORTED = ["ko", "en", "ja"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleType }>;
}) {
  const { locale } = await params;
  const url = `${SITE_URL}/${locale}`;
  return {
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          SUPPORTED.map((loc) => [loc, `${SITE_URL}/${loc}`])
        ),
        "x-default": `${SITE_URL}/ko`,
      },
    },
    openGraph: { url },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: LocaleType }>;
}) {
  const { locale } = await params;
  const { t } = await translation(locale);
  const contents = getAllContentsForLocale(locale).filter(
    (content) => !content.frontmatter.draft
  );
  const changelog = getChangelog(6);

  return (
    <div className="space-y-16">
      {/* intro */}
      <Reveal>
        <section className="pt-6">
          <h1 className="text-2xl font-semibold tracking-tight text-bright">
            <span className="vt-wordmark inline-block">
              <Wordmark
                primary={localizedNames(locale).primary}
                secondary={localizedNames(locale).secondary}
              />
            </span>
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Product Engineer at{" "}
            <a
              href="https://link.inpock.co.kr/"
              target="_blank"
              rel="noreferrer"
              className="link-quiet"
            >
              @inpock
            </a>
          </p>
          <p className="mt-5 max-w-lg whitespace-pre-line break-keep leading-relaxed">
            {t("home.tagline")}
          </p>

          <div className="-mx-2 mt-5 flex gap-1">
            <CopyEmailButton
              email="mingi@ab-z.com"
              className={ICON_BUTTON_CLASS}
            />
            {CONNECT.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                aria-label={label}
                title={label}
                className={ICON_BUTTON_CLASS}
              >
                <Icon />
              </a>
            ))}
          </div>
        </section>
      </Reveal>

      {/* sections */}
      <Reveal delay={60}>
        <nav>
          <ul>
            {SECTIONS.map(({ path, key, disabled }) => {
              const inner = (
                <>
                  <span>
                    <span className="block font-medium text-bright">
                      {t(`sections.${key}.title`)}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted">
                      {t(`sections.${key}.description`)}
                    </span>
                  </span>
                  {disabled ? (
                    <span className="shrink-0 rounded-full bg-soft px-2.5 py-1 text-[11px] leading-none text-faint">
                      {t(`sections.${key}.badge`)}
                    </span>
                  ) : (
                    <span className="arrow text-faint transition-colors group-hover:text-bright">
                      →
                    </span>
                  )}
                </>
              );

              return (
                <li key={path}>
                  {disabled ? (
                    <div className="flex items-center justify-between border-b border-line py-5 opacity-55">
                      {inner}
                    </div>
                  ) : (
                    <Link
                      href={`/${locale}/${path}`}
                      className="arrow-link group flex items-center justify-between border-b border-line py-5"
                    >
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </Reveal>

      {/* recent writing */}
      {contents.length > 0 && (
        <Reveal delay={60}>
          <section>
            <h2 className="mb-1 text-sm font-medium text-bright">
              {t("home.recent")}
            </h2>
            <PostList
              contents={contents.slice(0, 3)}
              locale={locale}
              categoryLabels={Object.fromEntries(
                contents.map((content) => [
                  content.category,
                  t(`categories.${content.category}`),
                ])
              )}
            />
            {contents.length > 3 && (
              <Link
                href={`/${locale}/blog`}
                className="arrow-link mt-3 inline-block text-sm text-faint transition-colors hover:text-bright"
              >
                {t("home.all-posts")} <span className="arrow">→</span>
              </Link>
            )}
          </section>
        </Reveal>
      )}

      {/* projects — 데이터는 features/projects/data.ts에서 수정 */}
      <Reveal delay={70}>
        <section>
          <h2 className="mb-1 text-sm font-medium text-bright">
            {t("home.projects")}
          </h2>
          <ul className="divide-y divide-line">
            {PROJECTS.map((project) => {
              const inner = (
                <>
                  <span className="flex min-w-0 items-baseline gap-2.5">
                    <span className="truncate text-foreground transition-colors group-hover:text-bright">
                      {project.name}
                    </span>
                    <span className="hidden truncate text-sm text-muted sm:inline">
                      {project.description[locale]}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-baseline gap-2 font-mono text-xs tabular-nums text-faint">
                    {project.period}
                    {project.href && <span aria-hidden>↗</span>}
                  </span>
                </>
              );
              return (
                <li key={project.name}>
                  {project.href ? (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className="row-link group -mx-4 flex items-baseline justify-between gap-6 rounded-md px-4 py-4"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="-mx-4 flex items-baseline justify-between gap-6 px-4 py-4">
                      {inner}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </Reveal>

      {/* changelog — 빌드 시점 git log에서 뽑은 사이트 업데이트 히스토리 */}
      <Reveal delay={80}>
        <Changelog
          entries={changelog}
          title={t("home.updates")}
          historyLabel={t("home.history")}
          historyHref={`/${locale}/changelog`}
        />
      </Reveal>
    </div>
  );
}

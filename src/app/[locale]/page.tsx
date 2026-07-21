import { Link } from "next-view-transitions";

import { getAllContentsForLocale, PostList } from "@/features/blog";
import {
  CopyEmailButton,
  GithubIcon,
  LinkedinIcon,
  type LocaleType,
  localizedNames,
  Reveal,
  RssIcon,
  translation,
  Wordmark,
  XIcon,
} from "@/shared";

const SECTIONS = [
  { path: "blog", key: "blog", disabled: false },
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
  "rounded-full p-2 text-faint transition-all hover:bg-soft hover:text-bright active:scale-90";

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
          SUPPORTED.map((loc) => [loc, `${SITE_URL}/${loc}`]),
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
    (content) => !content.frontmatter.draft,
  );

  // 홈은 인물 프로필 문서 — 레이아웃 그래프의 #person을 주체로 연결한다
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/${locale}#profile`,
    mainEntity: { "@id": `${SITE_URL}/#person` },
    inLanguage: locale,
  };

  return (
    <div className="space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
                ]),
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
    </div>
  );
}

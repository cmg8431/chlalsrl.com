import { getAllContentsForLocale, SearchablePostList } from "@/features/blog";
import { IslandSignal, LocaleType, Reveal, translation } from "@/shared";

const SITE_URL = "https://chlalsrl.com";
const SUPPORTED = ["ko", "en", "ja"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleType }>;
}) {
  const { locale } = await params;
  const { t } = await translation(locale);
  const url = `${SITE_URL}/${locale}/blog`;
  return {
    title: t("blog.title"),
    description: t("sections.blog.description"),
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          SUPPORTED.map((loc) => [loc, `${SITE_URL}/${loc}/blog`])
        ),
        "x-default": `${SITE_URL}/ko/blog`,
      },
    },
    openGraph: { url, title: t("blog.title") },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: LocaleType }>;
}) {
  const { locale } = await params;
  const { t } = await translation(locale);
  const contents = getAllContentsForLocale(locale);

  const posts = contents.map((content) => ({
    id: `${content.category}-${content.slug}`,
    title: content.frontmatter.title,
    date: content.frontmatter.date,
    href: `/${locale}/blog/${content.slug}`,
    category: content.category,
    categoryLabel: t(`categories.${content.category}`),
    draft: content.frontmatter.draft,
    description: content.frontmatter.description,
    tags: content.frontmatter.tags,
  }));

  const categories = Array.from(
    new Set(contents.map((content) => content.category))
  ).map((category) => ({
    key: category,
    label: t(`categories.${category}`),
  }));

  return (
    <div>
      <IslandSignal
        message={t("island.posts", { count: contents.length })}
        icon="pen"
      />
      <Reveal>
        <h1 className="text-xl font-semibold tracking-tight text-bright">
          {t("blog.title")}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {t("blog.count", { count: contents.length })}
        </p>
      </Reveal>

      <Reveal delay={60}>
        <div className="mt-8">
          <SearchablePostList
            posts={posts}
            categories={categories}
            allLabel={t("categories.all")}
            placeholder={t("blog.search")}
            emptyMessage={t("blog.empty")}
            noResultMessage={t("blog.no-result")}
            draftLabel={t("blog.draft")}
            resetLabel={t("blog.reset")}
          />
        </div>
      </Reveal>
    </div>
  );
}

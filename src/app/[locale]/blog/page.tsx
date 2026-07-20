import { getAllContentsForLocale, SearchablePostList } from "@/features/blog";
import { IslandSignal, LocaleType, Reveal, translation } from "@/shared";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleType }>;
}) {
  const { locale } = await params;
  const { t } = await translation(locale);
  return { title: t("blog.title") };
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
          />
        </div>
      </Reveal>
    </div>
  );
}

import { Comments } from "@/features/blog";
import { IslandSignal, LocaleType, Reveal, translation } from "@/shared";

const SITE_URL = "https://chlalsrl.com";
const SUPPORTED = ["ko", "en", "ja"] as const;

/** 방명록은 글이 아니므로 슬러그 충돌이 없는 예약 키를 쓴다 */
const GUESTBOOK_SLUG = "__guestbook";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleType }>;
}) {
  const { locale } = await params;
  const { t } = await translation(locale);
  const url = `${SITE_URL}/${locale}/guestbook`;
  return {
    title: t("sections.guestbook.title"),
    description: t("sections.guestbook.description"),
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          SUPPORTED.map((loc) => [loc, `${SITE_URL}/${loc}/guestbook`])
        ),
        "x-default": `${SITE_URL}/ko/guestbook`,
      },
    },
    openGraph: { url, title: t("sections.guestbook.title") },
  };
}

export default async function GuestbookPage({
  params,
}: {
  params: Promise<{ locale: LocaleType }>;
}) {
  const { locale } = await params;
  const { t } = await translation(locale);

  return (
    <div>
      <IslandSignal message={t("island.guestbook")} icon="pen" />
      <Reveal>
        <h1 className="text-xl font-semibold tracking-tight text-bright">
          {t("sections.guestbook.title")}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {t("sections.guestbook.description")}
        </p>
      </Reveal>

      <Reveal delay={60}>
        {/* 댓글 인프라 재사용 — 예약 슬러그 하나에 모든 방명록이 쌓인다 */}
        <Comments slug={GUESTBOOK_SLUG} />
      </Reveal>
    </div>
  );
}

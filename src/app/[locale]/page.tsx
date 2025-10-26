import { LanguageSwitcher, translation, LocaleType } from "@/shared";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: LocaleType }>;
}) {
  const { locale } = await params;
  const { t } = await translation(locale, "common");

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <LanguageSwitcher />
      <p>{t("hello")}</p>
    </div>
  );
}

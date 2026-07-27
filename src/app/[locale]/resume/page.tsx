import { RESUME_SLUG, ResumeDocument } from "@/features/resume";
import { type LocaleType, translation } from "@/shared";
import { ResumeDock } from "./resume-dock";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleType }>;
}) {
  const { locale } = await params;
  const { t } = await translation(locale);
  return { title: t("sections.resume.title") };
}

export default async function ResumePage({
  params,
}: {
  params: Promise<{ locale: LocaleType }>;
}) {
  const { locale } = await params;

  return (
    <>
      <ResumeDocument locale={locale} />
      <ResumeDock slug={RESUME_SLUG} />
    </>
  );
}

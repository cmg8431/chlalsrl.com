import { notFound } from "next/navigation";

import { RESUME_SLUG, ResumeDocument } from "@/features/resume";
import { type LocaleType, translation } from "@/shared";
import { ResumeDock } from "../resume-dock";

/** 지원하는 곳마다 링크를 따로 발급한다. 문자·숫자·하이픈만 받는다 */
const SLUG = /^[a-z0-9][a-z0-9-]{0,58}[a-z0-9]$/;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleType }>;
}) {
  const { locale } = await params;
  const { t } = await translation(locale);
  return {
    title: t("sections.resume.title"),
    // 보낸 사람만 아는 주소다 — 검색에 걸리면 회사별로 나눈 의미가 없다
    robots: { index: false, follow: false },
  };
}

/**
 * 회사별 링크. 문서는 `/resume`와 완전히 같고 열람 기록만 이 이름으로 남는다.
 *
 * 받는 사람 화면에 "당신이 보고 있습니다"라고 써 붙이지 않는다 — 읽기도 전에
 * 불편해지고, 어차피 알아야 할 사람은 보낸 쪽이다.
 */
export default async function CompanyResumePage({
  params,
}: {
  params: Promise<{ locale: LocaleType; company: string }>;
}) {
  const { locale, company } = await params;
  if (!SLUG.test(company)) notFound();

  return (
    <>
      <ResumeDocument locale={locale} company={company} />
      <ResumeDock slug={RESUME_SLUG} />
    </>
  );
}

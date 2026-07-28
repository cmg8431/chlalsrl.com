import {
  type LocaleType,
  localizedNames,
  translation,
  Wordmark,
} from "@/shared";
import type { ResumeExperience } from "../libs";
import { getResume } from "../libs";
import { AchievementList } from "./achievement-list";
import { AiNative } from "./ai-native";
import { ProjectThumb } from "./project-thumb";
import { ResumeSummary } from "./resume-summary";
import { ResumeView } from "./resume-view";

/** 본문 · 메타 두 단계만 쓴다. 크기를 늘리는 대신 잉크 농도로 위계를 만든다 */
const TYPE = {
  body: "text-[13.5px] leading-[1.72]",
  meta: "font-mono text-[10.5px] tabular-nums text-faint",
} as const;

/**
 * 좁은 한 단으로 간다. 왼쪽에 라벨 칼럼을 세우면 그 칼럼이 대부분 비어
 * 문서가 한쪽으로 기운다 — 축을 하나로 모으는 편이 훨씬 정돈돼 보인다.
 * 라벨은 본문 위에 작게 얹어 세로 공간을 거의 먹지 않게 한다.
 */
function Section({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12" data-section-label={title}>
      <h2 className="mb-6 flex items-baseline gap-2.5">
        <span className="font-mono text-[10.5px] tabular-nums text-line">
          {String(index).padStart(2, "0")}
        </span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">
          {title}
        </span>
      </h2>
      {children}
    </section>
  );
}

/**
 * 회사 하나. 왼쪽에 회사·직무·기간을 세우고 오른쪽에 성과를 흘린다.
 * 경력과 사이드가 같은 틀을 쓴다 — 무게 차이는 섹션이 이미 말해준다.
 */
function ExperienceBlock({
  exp,
  labels,
}: {
  exp: ResumeExperience;
  labels: {
    situation: string;
    action: string;
    result: string;
    evidence: string;
  };
}) {
  return (
    <div className="resume-exp">
      {/* 성과를 훑는 동안 회사와 기간이 옆에 붙어 있게 한다 */}
      <div className="resume-exp-meta">
        <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-bright">
          {exp.company}
        </h3>
        <p className="mt-1 text-[12.5px] leading-[1.5] text-muted">
          {exp.role}
        </p>
        {exp.location && (
          <p className="mt-0.5 text-[12px] leading-[1.5] text-faint">
            {exp.location}
          </p>
        )}
        <time className={`mt-1.5 block ${TYPE.meta}`}>{exp.period}</time>
      </div>

      <div className="min-w-0">
        {exp.context && (
          <p className={`max-w-[41rem] break-keep ${TYPE.body} text-muted`}>
            {exp.context}
          </p>
        )}
        <AchievementList achievements={exp.achievements} labels={labels} />
      </div>
    </div>
  );
}

/** 제목 왼쪽, 기간 오른쪽 끝 */
function HeadRow({
  title,
  period,
}: {
  title: React.ReactNode;
  period?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h3 className="text-[13.5px] font-medium tracking-tight text-bright">
        {title}
      </h3>
      {period && <time className={`shrink-0 ${TYPE.meta}`}>{period}</time>}
    </div>
  );
}

/**
 * 이력서 본문. `/resume`와 회사별 링크(`/resume/<회사>`)가 같은 문서를 쓴다.
 *
 * company가 있으면 문서는 그대로 두고 열람 기록만 그 이름으로 남긴다 —
 * 받는 사람 화면에 "당신이 보고 있습니다"라고 써 붙이면 읽기 전에 불편해진다.
 */
export async function ResumeDocument({
  locale,
  company,
}: {
  locale: LocaleType;
  company?: string;
}) {
  const { t } = await translation(locale);
  const resume = getResume(locale);
  const starLabels = {
    situation: t("resume.situation"),
    action: t("resume.action"),
    result: t("resume.result"),
    evidence: t("resume.evidence"),
  };

  return (
    <div className="resume-doc print-area">
      <div className="resume-intro no-print" aria-hidden />
      <ResumeView company={company} locale={locale} />
      <header>
        <div
          data-stage
          style={{ "--stage": 0 } as React.CSSProperties}
          className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2"
        >
          <h1 className="text-[34px] font-bold leading-none tracking-[-0.035em] text-bright">
            <Wordmark
              primary={localizedNames(locale).primary}
              secondary={localizedNames(locale).secondary}
            />
          </h1>
        </div>

        {/* 직무 한 줄, 연락 한 줄. 이름 옆에 붙이면 이름이 먼저 안 읽힌다 */}
        <p
          data-stage
          style={{ "--stage": 1 } as React.CSSProperties}
          className="mt-2.5 text-[13.5px] font-medium text-muted"
        >
          {resume.role}
        </p>

        {/* 주소·링크는 모노로 — 라틴 문자만 남는 줄이라 자간이 고르게 선다 */}
        <div
          data-stage
          style={{ "--stage": 2 } as React.CSSProperties}
          className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] text-faint"
        >
          <span>{resume.location}</span>
          {resume.links.map((link) => (
            <span key={link.label} className="flex items-center">
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="link-quiet"
              >
                {link.label}
              </a>
            </span>
          ))}
        </div>

        {/* 인사 한 줄로 연다. 훅을 세우려 애쓸수록 이력서가 광고처럼 읽힌다 */}
        <p
          data-stage
          style={{ "--stage": 3 } as React.CSSProperties}
          className="mt-8 max-w-[41rem] break-keep text-[16px] font-semibold leading-[1.55] tracking-[-0.012em] text-bright"
        >
          {resume.headline}
        </p>

        <div
          data-stage
          style={{ "--stage": 4 } as React.CSSProperties}
          className="mt-3.5 max-w-[41rem] space-y-2.5"
        >
          {resume.intro.map((paragraph) => (
            <p
              key={paragraph}
              className="break-keep text-[13.5px] leading-[1.75] text-muted"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </header>

      {/* 30초 요약 — 문서 흐름 밖에서 아래로부터 떠오른다 */}
      <ResumeSummary
        data={resume.summary}
        openLabel={t("resume.summaryOpen")}
        closeLabel={t("resume.close")}
      />

      {/* AI Native — 도구 숙련이 아니라 조율을 보여주는 블록 */}
      <div
        data-stage
        style={{ "--stage": 7 } as React.CSSProperties}
        className="mt-10"
      >
        <AiNative data={resume.aiNative} />
      </div>

      <Section index={1} title={t("resume.experience")}>
        <div className="space-y-12">
          {resume.experience.map((exp) => (
            <ExperienceBlock
              key={`${exp.company}-${exp.period}`}
              exp={exp}
              labels={starLabels}
            />
          ))}
        </div>
      </Section>

      {/* 회사 밖에서 이어온 일 — 경력과 같은 틀로 세운다 */}
      {resume.side.length > 0 && (
        <Section index={2} title={t("resume.side")}>
          <div className="space-y-12">
            {resume.side.map((item) => (
              <ExperienceBlock
                key={`${item.company}-${item.period}`}
                exp={item}
                labels={starLabels}
              />
            ))}

            {/* 개인 프로젝트가 생기면 같은 섹션 아래에 카드로 붙는다 */}
            {resume.projects.map((project, index) => {
              const body = (
                <>
                  <div className="resume-shot">
                    <ProjectThumb name={project.name} index={index} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[14px] font-semibold tracking-tight text-bright">
                        {project.name}
                      </span>
                      <span className={`shrink-0 ${TYPE.meta}`}>
                        {project.period}
                      </span>
                    </div>
                    <p className={`mt-1 break-keep ${TYPE.body} text-muted`}>
                      {project.description}
                    </p>
                    {project.tag && (
                      <span className="resume-shot-tag">{project.tag}</span>
                    )}
                  </div>
                </>
              );

              return project.href ? (
                <a
                  key={project.name}
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="resume-card group"
                >
                  {body}
                </a>
              ) : (
                <div key={project.name} className="resume-card group">
                  {body}
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {resume.awards.length > 0 && (
        <Section index={3} title={t("resume.awards")}>
          <div className="space-y-3.5">
            {resume.awards.map((award) => (
              <div key={award.title}>
                <HeadRow title={award.title} period={award.date} />
                <p className={`mt-0.5 ${TYPE.body} text-muted`}>
                  {award.issuer}
                  {award.description && (
                    <span className="ml-2 text-faint">{award.description}</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section index={4} title={t("resume.education")}>
        <div className="space-y-2">
          {resume.education.map((edu) => (
            <div
              key={edu.school}
              className="flex items-baseline justify-between gap-4"
            >
              <p className={TYPE.body}>
                <span className="font-medium text-bright">{edu.school}</span>
                <span className="ml-2 text-muted">{edu.degree}</span>
              </p>
              <time className={`shrink-0 ${TYPE.meta}`}>{edu.period}</time>
            </div>
          ))}
          <div className="!mt-4 flex flex-wrap gap-x-2 gap-y-1">
            {resume.certifications.map((cert) => (
              <span key={cert.name} className="resume-chip">
                {cert.name}
              </span>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}

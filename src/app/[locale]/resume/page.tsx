import { redirect } from "next/navigation";

import {
  AchievementList,
  getResume,
  HighlightCard,
  PrintButton,
  ProjectThumb,
  ResumeControls,
  type ResumeExperience,
  ResumeSpotlight,
} from "@/features/resume";
import {
  type LocaleType,
  localizedNames,
  translation,
  Wordmark,
} from "@/shared";

/** 이력서 작업 중 — 내용이 채워지면 이 줄만 지우면 된다. 로컬에서는 미리 볼 수 있다 */
const WIP = process.env.NODE_ENV === "production";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleType }>;
}) {
  const { locale } = await params;
  const { t } = await translation(locale);
  return { title: t("sections.resume.title") };
}

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
  labels: { situation: string; action: string; result: string };
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

export default async function ResumePage({
  params,
}: {
  params: Promise<{ locale: LocaleType }>;
}) {
  const { locale } = await params;
  if (WIP) redirect(`/${locale}`);

  const { t } = await translation(locale);
  const resume = getResume(locale);
  const starLabels = {
    situation: t("resume.situation"),
    action: t("resume.action"),
    result: t("resume.result"),
  };

  return (
    <div className="resume-doc print-area">
      <div className="resume-intro no-print" aria-hidden />
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
          <PrintButton label={t("resume.print")} />
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
          className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-faint"
        >
          <span>{resume.location}</span>
          {resume.links.map((link) => (
            <span key={link.label} className="flex items-center gap-2">
              <span className="text-line">·</span>
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

        {/* 어절 단위로 올라온다 — 한 덩어리로 나타나면 문장이 사건이 되지 않는다 */}
        <h2 className="resume-headline mt-9 max-w-[36rem] break-keep text-[28px] font-semibold leading-[1.32] tracking-[-0.022em] text-bright">
          {resume.headline.split(" ").map((word, index) => (
            <span
              key={`${word}-${index}`}
              className="resume-word"
              style={{ "--w": index } as React.CSSProperties}
            >
              {word}
            </span>
          ))}
        </h2>

        {/* 훑고 지나가는 6초 안에 눈이 멈출 자리. 선 대신 여백으로만 띄운다 */}
        <dl className="mt-7 grid max-w-[40rem] grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
          {resume.highlights.map((highlight, index) => (
            <HighlightCard
              key={highlight.label}
              value={highlight.value}
              label={highlight.label}
              source={highlight.source}
              stage={3 + index}
            />
          ))}
        </dl>

        <div
          data-stage
          style={{ "--stage": 6 } as React.CSSProperties}
          className="mt-7 max-w-[41rem] space-y-2"
        >
          {/* 첫 문단은 리드 — 한 급 크고 진하게 두어 눈이 여기서 시작하게 한다 */}
          {resume.intro.map((paragraph, index) => (
            <p
              key={paragraph}
              className={
                index === 0
                  ? "break-keep text-[14.5px] leading-[1.68] text-foreground"
                  : `break-keep ${TYPE.body} text-muted`
              }
            >
              {paragraph}
            </p>
          ))}
        </div>
      </header>

      {/* AI Native — 도구 숙련이 아니라 조율을 보여주는 파란 강조 블록 */}
      <section
        data-stage
        style={{ "--stage": 7 } as React.CSSProperties}
        className="ai-native mt-10"
        aria-label={resume.aiNative.title}
      >
        <div className="ai-native-head">
          <span className="ai-native-badge">{resume.aiNative.title}</span>
          <p className="ai-native-lead">{resume.aiNative.lead}</p>
        </div>
        <div className="ai-native-grid">
          {resume.aiNative.points.map((point) => (
            <div key={point.label} className="ai-native-point">
              <span className="ai-native-label">{point.label}</span>
              <h3 className="ai-native-title">{point.title}</h3>
              <p className="ai-native-body">{point.body}</p>
            </div>
          ))}
        </div>
      </section>

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

      <ResumeSpotlight />

      {/* 지금 어디를 읽고 있는지만 알려준다 */}
      <ResumeControls />
    </div>
  );
}

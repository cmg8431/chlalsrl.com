import { redirect } from "next/navigation";

import { getResume, PrintButton } from "@/features/resume";
import { LocaleType, Reveal, translation } from "@/shared";

/** 이력서 작업 중 — 완성되면 이 플래그만 끄면 된다 */
const WIP = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleType }>;
}) {
  const { locale } = await params;
  const { t } = await translation(locale);
  return { title: t("sections.resume.title") };
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 text-xs font-medium uppercase tracking-widest text-faint">
      {children}
    </h2>
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

  return (
    <div className="print-area expand-x">
      {/* header */}
      <Reveal>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-bright">
              {resume.name}
              <span className="ml-2.5 text-sm font-normal text-faint">
                {resume.alias}
              </span>
            </h1>
            <p className="mt-1 text-sm text-muted">
              {resume.role} · {resume.location}
            </p>
          </div>
          <PrintButton label={t("resume.print")} />
        </div>

        <p className="mt-8 max-w-lg leading-relaxed">{resume.summary}</p>

        <div className="mt-6 flex gap-5 text-sm text-muted">
          {resume.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="link-quiet"
            >
              {link.label}
            </a>
          ))}
        </div>
      </Reveal>

      {/* experience */}
      <Reveal delay={60}>
        <section className="mt-20">
          <SectionTitle>{t("resume.experience")}</SectionTitle>
          <div className="space-y-12">
            {resume.experience.map((exp) => (
              <article
                key={`${exp.company}-${exp.period}`}
                className="grid gap-2 sm:grid-cols-[8.5rem_1fr] sm:gap-8 xl:grid-cols-[11rem_1fr]"
              >
                <time className="font-mono text-xs tabular-nums text-faint sm:pt-1">
                  {exp.period}
                </time>
                <div>
                  <h3 className="font-medium text-bright">{exp.company}</h3>
                  <p className="text-sm text-muted">{exp.role}</p>
                  {exp.summary && (
                    <p className="mt-2 text-sm text-muted">{exp.summary}</p>
                  )}
                  <ul className="mt-3 max-w-[38rem] space-y-1.5 text-sm leading-relaxed">
                    {exp.points.map((point, i) => (
                      <li key={`${i}-${point}`} className="flex gap-2.5">
                        <span className="select-none text-faint">·</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      {/* projects */}
      <Reveal delay={60}>
        <section className="mt-20">
          <SectionTitle>{t("resume.projects")}</SectionTitle>
          <div className="space-y-10 xl:grid xl:grid-cols-2 xl:gap-x-14 xl:gap-y-10 xl:space-y-0">
            {resume.projects.map((project) => (
              <article key={project.name}>
                <h3 className="font-medium text-bright">
                  {project.href ? (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className="link-quiet"
                    >
                      {project.name}
                    </a>
                  ) : (
                    project.name
                  )}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>
                <p className="mt-2 font-mono text-xs text-faint">
                  {project.tech.join(" · ")}
                </p>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      {/* skills */}
      <Reveal delay={60}>
        <section className="mt-20">
          <SectionTitle>{t("resume.skills")}</SectionTitle>
          <div className="space-y-2.5 text-sm">
            {resume.skills.map((group) => (
              <div key={group.category} className="flex gap-6">
                <span className="w-24 shrink-0 text-faint">
                  {group.category}
                </span>
                <span>{group.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* education */}
      <Reveal delay={60}>
        <section className="mt-20">
          <SectionTitle>{t("resume.education")}</SectionTitle>
          <div className="space-y-6">
            {resume.education.map((edu) => (
              <div
                key={edu.school}
                className="grid gap-1 sm:grid-cols-[8.5rem_1fr] sm:gap-8 xl:grid-cols-[11rem_1fr]"
              >
                <time className="font-mono text-xs tabular-nums text-faint sm:pt-1">
                  {edu.period}
                </time>
                <div>
                  <h3 className="font-medium text-bright">{edu.school}</h3>
                  <p className="text-sm text-muted">{edu.degree}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}

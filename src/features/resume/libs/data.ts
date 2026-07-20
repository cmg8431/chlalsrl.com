import type { Resume } from "./types";
import type { LocaleType } from "@/shared";

/**
 * 이력서 데이터. 아래 플레이스홀더를 실제 내용으로 교체하면 된다.
 * UI는 이 구조만 알고 있으므로 여기만 고치면 페이지에 반영된다.
 */

const LINKS: Resume["links"] = [
  { label: "github", href: "https://github.com/cmg8431" },
  { label: "mail", href: "mailto:mingi@ab-z.com" },
];

const ko: Resume = {
  name: "최민기",
  alias: "Mingi Choe",
  role: "Product Engineer",
  location: "Seoul, KR",
  summary:
    "인터랙션이 즐거운 웹을 만듭니다. (한 줄 소개를 여기에 — 무엇을 만들고, 무엇을 중요하게 생각하는지.)",
  links: LINKS,
  experience: [
    {
      company: "회사 이름",
      role: "Product Engineer",
      period: "2024.01 — 현재",
      summary: "팀/제품 한 줄 설명",
      points: [
        "한 일 + 임팩트 (예: OO 페이지 로딩 시간 60% 개선)",
        "한 일 + 임팩트",
        "한 일 + 임팩트",
      ],
    },
    {
      company: "이전 회사 이름",
      role: "Frontend Engineer Intern",
      period: "2023.06 — 2023.12",
      points: ["한 일 + 임팩트", "한 일 + 임팩트"],
    },
  ],
  projects: [
    {
      name: "프로젝트 이름",
      description: "무엇을 왜 만들었는지 한두 문장.",
      tech: ["Next.js", "TypeScript", "Tailwind CSS"],
      href: "https://github.com/cmg8431",
    },
    {
      name: "다른 프로젝트",
      description: "무엇을 왜 만들었는지 한두 문장.",
      tech: ["React", "..."],
    },
  ],
  skills: [
    { category: "languages", items: ["TypeScript", "JavaScript"] },
    { category: "frontend", items: ["React", "Next.js", "Tailwind CSS"] },
    { category: "etc", items: ["Git", "..."] },
  ],
  education: [
    {
      school: "학교 이름",
      degree: "전공 / 학위",
      period: "2020.03 — 2024.02",
    },
  ],
};

const en: Resume = {
  ...ko,
  name: "Mingi Choe",
  alias: "최민기",
  summary:
    "I build webs that are fun to interact with. (One-liner here — what you build and what you care about.)",
  experience: [
    {
      company: "Company Name",
      role: "Product Engineer",
      period: "Jan 2024 — Present",
      summary: "One line about the team/product",
      points: [
        "What you did + impact (e.g. cut page load time by 60%)",
        "What you did + impact",
        "What you did + impact",
      ],
    },
    {
      company: "Previous Company",
      role: "Frontend Engineer Intern",
      period: "Jun 2023 — Dec 2023",
      points: ["What you did + impact", "What you did + impact"],
    },
  ],
  projects: [
    {
      name: "Project Name",
      description: "One or two sentences on what and why.",
      tech: ["Next.js", "TypeScript", "Tailwind CSS"],
      href: "https://github.com/cmg8431",
    },
    {
      name: "Another Project",
      description: "One or two sentences on what and why.",
      tech: ["React", "..."],
    },
  ],
  education: [
    {
      school: "School Name",
      degree: "Major / Degree",
      period: "Mar 2020 — Feb 2024",
    },
  ],
};

// ja 전용 번역이 생기기 전까지는 영문 이력서를 그대로 쓴다
const RESUME: Record<LocaleType, Resume> = { ko, en, ja: en };

export function getResume(locale: LocaleType): Resume {
  return RESUME[locale] ?? RESUME.ko;
}

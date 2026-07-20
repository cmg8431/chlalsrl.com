export interface ResumeLink {
  label: string;
  href: string;
}

export interface ResumeExperience {
  company: string;
  role: string;
  period: string;
  summary?: string;
  points: string[];
}

export interface ResumeProject {
  name: string;
  description: string;
  tech: string[];
  href?: string;
}

export interface ResumeSkillGroup {
  category: string;
  items: string[];
}

export interface ResumeEducation {
  school: string;
  degree: string;
  period: string;
}

export interface Resume {
  name: string;
  alias: string;
  role: string;
  location: string;
  summary: string;
  links: ResumeLink[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  skills: ResumeSkillGroup[];
  education: ResumeEducation[];
}

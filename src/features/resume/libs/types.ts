export interface ResumeLink {
  label: string;
  href: string;
}

/**
 * 성과 하나. 상황 → 행동 → 결과로 나눠 쓴다.
 *
 * 줄글로 쓰면 "무엇이 문제였고 그래서 뭘 했는지"가 문장 속에 섞여 읽는 사람이
 * 직접 분해해야 한다. 세 칸으로 갈라두면 훑는 사람은 결과만, 파고드는 사람은
 * 상황부터 읽을 수 있다. 확인할 근거가 있으면 href로 건다.
 */
export interface ResumeAchievement {
  title: string;
  period?: string;
  href?: string;
  /** 제목 아래 한 줄 — 무엇을 어떻게 했고 뭐가 달라졌는지 압축 */
  summary: string;
  /** 왜 이 일이 필요했나 */
  situation: string[];
  /** 무엇을 했나. 첫 줄에 가장 중요한 결정을 둔다 */
  action: string[];
  /** 무엇이 달라졌나. 수치는 여기에 */
  result: string[];
}

export interface ResumeExperience {
  company: string;
  role: string;
  period: string;
  location?: string;
  /** 성과를 읽기 전에 회사·제품·내 자리를 알려주는 한 줄 */
  context?: string;
  achievements: ResumeAchievement[];
}

export interface ResumeProject {
  name: string;
  period?: string;
  description: string;
  href?: string;
  /** 미리보기 이미지. 지금은 자리를 보려고 picsum 시드를 쓰고 있다 */
  image?: string;
  /** 이미지 위에 얹는 짧은 꼬리표 — 무엇으로 만든 것인지 한 마디 */
  tag?: string;
}

export interface ResumeEducation {
  school: string;
  degree: string;
  period: string;
}

export interface ResumeCertification {
  name: string;
  issuer?: string;
  date?: string;
}

export interface ResumeAward {
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface Resume {
  name: string;
  alias: string;
  role: string;
  location: string;
  /** 한 줄로 끊어지는 헤드라인. 두 줄로 접히면 힘이 빠지니 짧게 */
  headline: string;
  /**
   * 첫 화면에서 증거 역할을 하는 수치 셋. 경력에서 가장 센 것만 끌어올린다.
   * 훑고 지나가는 6초 안에 눈이 멈출 유일한 자리다.
   */
  highlights: {
    value: string;
    label: string;
    /** 이 수치의 근거가 되는 성과 제목 — 누르면 그 항목으로 데려간다 */
    source?: string;
  }[];
  /** 자기소개 두 문단 — 무엇을 잘하는가 / 어떻게 일하는가 */
  intro: string[];
  /**
   * AI Native 섹션 — 왜 AI 시대의 인재인가를 실제 방식으로 증명한다.
   * 파란 톤의 독립 블록으로, 도구 숙련이 아니라 오케스트레이션을 보여준다.
   */
  aiNative: {
    title: string;
    lead: string;
    points: { label: string; title: string; body: string }[];
  };
  links: ResumeLink[];
  experience: ResumeExperience[];
  /** 만든 것 — 프로젝트 섹션에서 사이드와 함께 세운다 */
  projects: ResumeProject[];
  /** 회사 밖에서 이어온 일 — 경력과 같은 틀로 세운다. 무게만 섹션으로 가른다 */
  side: ResumeExperience[];
  /** 수상은 경력 다음으로 센 증거다 */
  awards: ResumeAward[];
  education: ResumeEducation[];
  certifications: ResumeCertification[];
}

import type { LocaleType } from "@/shared";
import type { Resume } from "./types";

/**
 * 실제 값: 이름·회사·기간·학력·자격·수상·프로젝트·블로그 글.
 * 내용은 커밋·PR 기록에서 가져온 실제 작업이다.
 *
 * - 자기소개는 헤드라인 한 줄 + 한 문단. 일하는 방식을 설명하는 둘째 문단은
 *   덜어냈다. 어느 이력서에나 있는 말이라 읽는 사람이 그냥 건너뛴다.
 * - 성과는 항목당 셋. 원인 특정 → 어떻게 풀었나 → 무엇이 달라졌나 순서로,
 *   마지막 줄에 수치를 몰아준다. 페이지가 그 줄만 진하게 렌더한다.
 * - 확인할 수 있는 근거는 링크로 건다.
 *
 * 분량은 인쇄 3장을 상한으로 둔다. 성과를 늘리는 대신 센 것만 남기고 병합했다.
 * 불릿 한 줄은 A4 폭에서 두 줄로 접히지 않게 60자 안쪽으로 쓴다.
 * 섹션에 담지 못한 일은 회사 context 마지막 문장에 한 줄로 접어 둔다.
 *
 * 제목과 본문에 em dash 를 쓰지 않는다. 붙이면 문장이 두 도막으로 갈라져
 * 읽는 속도가 끊긴다 — 쉼표로 잇거나 순서를 바꿔 한 문장으로 쓴다.
 *
 * highlights[].source 는 achievement.title 과 정확히 같아야 한다.
 * 그 문자열로 data-guide-label 을 찾아 스크롤하기 때문에, 오타가 나면
 * 눌러도 조용히 아무 일도 일어나지 않는다.
 */

const LINKS: Resume["links"] = [
  { label: "chlalsrl.com", href: "https://www.chlalsrl.com" },
  { label: "github.com/cmg8431", href: "https://github.com/cmg8431" },
  {
    label: "linkedin.com/in/cmg8431",
    href: "https://www.linkedin.com/in/cmg8431/",
  },
  { label: "mingi@ab-z.com", href: "mailto:mingi@ab-z.com" },
];

const INPOCK = "https://link.inpock.co.kr/";

const ko: Resume = {
  name: "최민기",
  alias: "Mingi Choe",
  role: "프로덕트 엔지니어",
  location: "Seoul, KR",
  headline:
    "새 라인이 열릴 때마다 0에서 1을 맡아, 디자인부터 프론트엔드까지 세워 왔습니다.",
  highlights: [
    {
      value: "0 → 1",
      label: "매니저 · 결제 · 딜 · AI 신규 라인",
      source: "인포크 매니저 0 → v1.5",
    },
    {
      value: "-40%",
      label: "메인 서비스 공통 번들",
      source: "번들 · 청크 구조 개선",
    },
    {
      value: "1,990",
      label: "커밋 레거시를 한 번에 전환",
      source: "인포크링크 React 전면 마이그레이션 · 디자인 시스템 통합",
    },
  ],
  intro: [
    "인포크에서 링크인바이오 서비스를 4년째 만들며, 매니저·결제·딜·AI까지 새 라인이 열릴 때마다 0에서 1을 맡았습니다. 그중 매니저는 디자인부터 프론트엔드까지 맡아 한 달 만에 파는 제품으로 냈고, 구조조정으로 4명까지 줄었던 팀을 다시 20명으로 키우며 흑자 전환을 함께 만들었습니다.",
  ],
  summary: {
    label: "30초 요약",
    headline:
      "새 라인의 0에서 1을 반복해 맡았고, 미뤄둔 레거시를 끊어내는 쪽을 골라 왔습니다",
    points: [
      {
        title: "0에서 1을 여러 번 만들었습니다",
        body: "매니저·결제·딜·AI까지 새 라인이 열릴 때마다 처음부터 맡았습니다. 매니저는 디자인부터 프론트엔드까지 혼자 세워 한 달 만에 파는 제품으로 냈습니다.",
        sources: ["인포크 매니저 0 → v1.5"],
      },
      {
        title: "레거시를 미루지 않고 끊었습니다",
        body: "누적 1,990 커밋의 Vue/Nuxt 메인 서비스를 점진 이관 대신 빅뱅으로 옮기고, 공통 번들을 318KB에서 191KB로 줄였습니다.",
        sources: [
          "인포크링크 React 전면 마이그레이션 · 디자인 시스템 통합",
          "번들 · 청크 구조 개선",
        ],
      },
      {
        title: "제품이 걸린 문제를 먼저 봤습니다",
        body: "토큰 XSS 노출과 단일 계정 제약을 하나의 릴리즈로 묶어 풀었고, 1초로 갈리는 티켓팅에서는 시각의 근거를 클라이언트에서 서버로 옮겼습니다.",
        sources: [
          "멀티 계정 · httpOnly 쿠키 보안 개편",
          "클라이언트 시계를 걷어낸 서버시간 정확도",
        ],
      },
    ],
  },
  aiNative: {
    title: "Working with AI",
    lead: "AI에 맡길 수 있게 코드베이스를 정리하고, 결과를 검증할 장치를 코드에 심어 두고 일합니다.",
    points: [
      {
        label: "맥락",
        title: "AI가 읽을 코드베이스를 따로 만듭니다",
        body: "AGENTS.md와 컨벤션·디자인 시스템·인프라 컨텍스트, AI가 읽는 아이콘 카탈로그를 코드처럼 버전 관리합니다. 매번 말로 설명하던 맥락을 파일로 내려두면 에이전트가 같은 판단을 반복합니다.",
      },
      {
        label: "절차",
        title: "반복되는 일을 스킬로 고정합니다",
        body: "PRD를 코드로, Figma를 컴포넌트로, 목 데이터를 실제 API로 잇는 일까지 스킬 10여 개로 묶었습니다. 제 반복을 줄이려고 만든 건데, 저장소에 있다 보니 팀도 같이 쓰고 다듬고 있습니다.",
      },
      {
        label: "검증",
        title: "AI가 끝났다고 해도 통과해야 끝납니다",
        body: "종료 훅에서 린트와 타입체크가 실패하면 세션이 끝나지 않고, env와 credentials는 읽기 자체를 막아 뒀습니다. 손끝으로 정하는 값은 실제 화면을 만지며 맞춥니다.",
      },
      {
        label: "설계",
        title: "AI가 다룰 수 있는 디자인 시스템을 만듭니다",
        body: "prop 타입에서 인스펙터 컨트롤을, 컴포넌트에서 아나토미를 자동으로 뽑습니다. 플레이그라운드에 에이전트 하네스를 붙여 컴포넌트를 대화로 조립하게 만들고 있습니다.",
      },
    ],
  },
  links: LINKS,
  experience: [
    {
      company: "인포크 (Team AB-Z)",
      role: "Product Engineer",
      period: "2022.11 — 현재",
      location: "Seoul, South Korea",
      context:
        "인플루언서를 위한 올인원 서비스 인포크를 개발합니다. 링크인바이오 인포크링크를 4년간 메인으로 맡았고, 매니저 · 딜 · 스토어 · AI까지 사내 프론트엔드 30여 개 저장소에 머지된 PR 1,799건을 남겼습니다. 아래에 담지 못한 일로는 외부에 넘기던 결제를 5개월에 자체 구축한 결제 · 정산 시스템, 제품에 AI를 붙이는 라인을 0에서 세운 나노바나나 · AI 3.0 Chat · Agent Hub, 인포크딜 역제안 흐름과 Sendbird 실시간 채팅이 있습니다.",
      achievements: [
        {
          title: "인포크 매니저 0 → v1.5",
          period: "2024.09 — 2024.12",
          summary:
            "인스타그램 자동화 DM · 답글 SaaS를 디자인부터 프론트엔드까지 맡아 한 달 만에 파는 제품을 내고, 넉 달에 v1.5까지 올렸습니다",
          situation: [
            "DM · 댓글 자동화를 팔 SaaS 어드민이 없어 0에서 시작해야 했음",
            "온보딩 어디서 이탈하는지 볼 수 있는 지표가 전혀 없었음",
          ],
          action: [
            "온보딩 · 자동화 DM · 이벤트 추첨으로 한 달 만에 v0.1을 내고, 자동 답글, 링크 퀵액션, viral 트리거, 예약 발송까지 두 달에 연속 배포",
            "auth HOC로 인증 라우트를 추상화하고 useSafeRouter로 라우팅 예외를 한 곳에 수렴",
            "GA4 · hotjar · 채널톡으로 온보딩 퍼널을 계측하고, 인스타 썸네일 호환을 위해 next/image 최적화를 끄는 결정",
          ],
          result: [
            "한 달에 v0.1로 판매 시작, 넉 달에 v1.5까지 신규 라인을 제품으로 세움",
            "이후 1년간 인포크 프로덕트 매출 10배 성장, 온보딩 이탈 지점을 지표로 확인",
          ],
        },
        {
          title: "번들 · 청크 구조 개선",
          period: "2026.07",
          summary:
            "Vue 시절부터 이어진 단일 공통 청크를 진입점별로 쪼개고 방문자 경로의 불필요한 SDK를 걷어내, 공통 번들을 318KB에서 191KB로 줄였습니다",
          situation: [
            "First Load JS shared가 318KB라 어느 페이지로 들어와도 같은 무게를 먼저 부담",
            "pages/_app에 방문자 · 어드민 코드가 함께 묶여 방문자도 어드민 코드를 받고 있었음",
          ],
          action: [
            "공통 청크를 진입점별로 분할하고 pages/_app을 방문자 · 어드민으로 갈라냄",
            "방문자 경로의 핵클 SDK를 제외하되, 지우기 전에 의도된 수집인지 데이터 담당자에게 먼저 확인",
            "청크 개수가 늘어난 만큼의 요청 수 증가는 배포 후 모니터링하기로 합의",
          ],
          result: [
            "공통 번들 318KB → 191KB (-40%), pages/_app 217KB → 88.6KB (-59%)",
            "방문자 페이지 394KB → 257KB (-35%), 어드민 편집 592KB → 375KB (-37%)",
          ],
        },
        {
          title: "인포크링크 React 전면 마이그레이션 · 디자인 시스템 통합",
          period: "2025.10 — 2026.01",
          summary:
            "누적 1,990 커밋의 Vue/Nuxt 메인 서비스를 점진 이관 대신 빅뱅으로 옮기고, 전 라인을 하나의 디자인 시스템과 서비스별 병렬 배포 위에 세웠습니다",
          href: INPOCK,
          situation: [
            "메인 서비스가 4년간 Vue/Nuxt로 굴러 1,990 커밋의 레거시가 쌓여 있었음",
            "공용 UI가 서비스마다 갈라져 옮겨 앉을 착지 지점 자체가 없었음",
          ],
          action: [
            "병행 운영은 길어질수록 중복 구현 비용이 커진다고 보고, ids v2와 공용 사이드바로 착지 지점을 먼저 만든 뒤 빅뱅 전환으로 결정",
            "모노레포에 link 패키지를 세워 v1.0.0 출시, 한 달간 후속 수정 20여 건으로 v1.0.7까지 안정화",
            "전체 배포를 서비스별 병렬 워크플로우로 쪼개고 Dockerfile의 pnpm 버전 통일",
          ],
          result: [
            "병행 운영 기간 없이 한 번에 전환, 방문자 번들 385KB → 304KB (-21%)",
            "링크 · 매니저 · 딜 · 외부앱이 같은 디자인 시스템 위에 정렬되고 독립 배포",
          ],
        },
        {
          title: "멀티 계정 · httpOnly 쿠키 보안 개편",
          period: "2026.05 — 2026.06",
          summary:
            "토큰 XSS 노출과 단일 계정 제약을, 인증에 얽힌 네 갈래를 묶은 단일 릴리즈로 한 번에 해소했습니다",
          situation: [
            "인증 토큰이 JS에서 접근 가능한 저장소에 있어 XSS에 그대로 노출",
            "계정을 하나만 연결할 수 있고, 401 처리가 SSR · CSR에 따로 있어 SSR에서 터지는 경로가 남아 있었음",
          ],
          action: [
            "나눠 고치면 중간 상태가 오래 남는다고 보고, httpOnly 전환 · 멀티 계정 · 401 분기 통합 · utm 쿠키 영속화를 단일 릴리즈로 묶음",
            "계정 선택 모달 · 바텀시트로 전환 UX를 만들고, 부모 도메인과 host 양쪽의 잔여 쿠키 정리",
            "앱 웹뷰의 만료 토큰 재주입으로 만료 페이지 무한 루프 차단",
          ],
          result: [
            "토큰이 JS에서 접근 불가능해지고, 로그아웃 없이 계정 전환 가능",
            "쿠키 휘발로 새던 광고 어트리뷰션 동시 해소, 한 달간 hotfix 8건으로 안정화",
          ],
        },
      ],
    },
  ],
  projects: [],
  side: [
    {
      company: "타불라라사 tabularasa",
      role: "개인사업자 · 프론트엔드",
      period: "2025.03 — 현재",
      context:
        "제 이름으로 낸 개인사업자입니다. 프론트엔드만 맡기도 하고 수집 · API · 배포까지 혼자 끌고 가기도 합니다. 계약과 정산 같은 코드 밖의 일도 직접 처리하는데, 나중에 창업했을 때 겪을 일을 미리 겪어두려고 택한 방식입니다. 지금은 기관마다 흩어진 공공주택 공고를 한곳에 모으는 버드집(birdzip.com)을 만들고 있습니다.",
      achievements: [
        {
          title: "SieMatic 코리아 웹사이트 구축",
          period: "2026.03 — 2026.06",
          summary:
            "독일 주방 브랜드의 한국 웹사이트에서 프론트엔드를 단독으로 맡아 이미지 자산 575MB를 79MB로 줄이고, 계약부터 정산까지 직접 처리했습니다",
          situation: [
            "브랜드 사이트는 첫 화면의 이미지가 곧 제품 인상인데 원본이 575MB였음",
            "쇼룸 · 카탈로그가 계속 바뀌어 배포할 때마다 이미지가 즉시 갈려야 했음",
          ],
          action: [
            "이미지 파이프라인을 다시 짜 중복 제거 · 1600px 리사이즈 · blur placeholder 적용",
            "S3 · CloudFront로 옮기고 배포 시 캐시를 자동 무효화해 교체가 바로 반영되게 함",
            "페이지를 서버 컴포넌트로 전환하고 메타데이터 팩토리 · 구조화 데이터로 SEO 정리",
          ],
          result: [
            "이미지 자산 575MB → 79MB (-86%), 교체가 배포 즉시 반영",
            "계약, 개발, 정산, 세금계산서까지 한 사이클을 직접 돌려봄",
          ],
        },
      ],
    },
    {
      company: "왓타 whata",
      role: "리드 · 프론트엔드 · 디자인 · 마케팅",
      period: "2023.10 — 2024.01",
      context:
        "티켓팅에 쓰는 서버시간 서비스를 세 명 팀으로 만들었습니다. 리드를 맡아 프론트엔드 · 디자인 · 마케팅을 메인으로 가져갔고, 광고비 없이 실제로 쓰인 장면을 콘텐츠로 만들어 DAU 400 · MAU 1,000까지 올렸습니다. 게시물 1건이 1만 노출 · 재게시 34회를 기록했습니다.",
      achievements: [
        {
          title: "클라이언트 시계를 걷어낸 서버시간 정확도",
          period: "2023.10 — 2023.12",
          summary:
            "1초로 갈리는 티켓팅에서 화면의 시계가 틀리면 제품 자체가 의미를 잃습니다. 시각의 근거를 클라이언트에서 서버로 옮겼습니다",
          situation: [
            "브라우저 시계는 기기마다 몇 초씩 어긋나고, 백그라운드 탭에서는 그대로 밀림",
          ],
          action: [
            "서버 시간 provider를 분리해 화면의 모든 시각이 서버 응답을 기준으로 흐르게 함",
            "worker timer로 백그라운드 throttle을 우회해 탭을 옮겨도 시계가 밀리지 않게 처리",
            "정확도가 곧 신뢰인 제품이라, 밀리초 시각과 응답 지연(ms)을 숨기지 않고 그대로 노출",
          ],
          result: [
            "탭을 옮기거나 화면을 오래 켜둬도 시계가 밀리지 않음",
            "국내 첫 MLB 개막전 예매 성공 사례가 서비스 사용 후기로 남음",
          ],
        },
      ],
    },
  ],
  awards: [
    {
      title: "스마틴 앱 챌린지 2022 개발부문 우수상 (창업진흥원상)",
      issuer: "중소벤처기업부 · SK플래닛",
      date: "2022.11",
      description: "지도 기반 환경 커뮤니티 「병주고 약주고」",
    },
    {
      title: "한국코드페어 해커톤 고등부 금상 (과학기술정보통신부장관상)",
      issuer: "과학기술정보통신부",
      date: "2021.12",
      description: "이동 약자를 위한 접근성 경로 안내 「고잉」",
    },
  ],
  education: [
    {
      school: "인하대학교",
      degree: "소프트웨어융합공학과 학사",
      period: "2026.03 — 2030.03",
    },
    {
      school: "한세사이버보안고등학교",
      degree: "해킹보안과 졸업",
      period: "2020.03 — 2023.02",
    },
  ],
  certifications: [
    { name: "네트워크 관리사 2급", issuer: "한국정보통신자격협회" },
    { name: "리눅스 마스터 2급", issuer: "한국정보통신자격협회" },
    { name: "정보처리기능사", issuer: "한국산업인력공단" },
  ],
};

const en: Resume = {
  ...ko,
  name: "Mingi Choe",
  alias: "최민기",
  role: "Product Engineer",
  headline:
    "Whenever a new line opened, I took it from zero, owning design through frontend.",
  highlights: [
    {
      value: "0 → 1",
      label: "Manager · payments · deal · AI lines",
      source: "inpock manager, v0.1 to v1.5",
    },
    {
      value: "-40%",
      label: "Shared bundle, main service",
      source: "Bundle and chunk restructuring",
    },
    {
      value: "1,990",
      label: "Commits of legacy, one cutover",
      source: "Full React migration and design system consolidation",
    },
  ],
  intro: [
    "I've built inpock's link-in-bio service for four years, taking the zero-to-one part whenever a new line opened: manager, payments, deal, AI. I owned manager from design through frontend, shipping it as a sellable product within a month. When restructuring shrank the team to four, I helped turn it profitable and grow it back to twenty.",
  ],
  summary: {
    label: "30-second read",
    headline:
      "I took the zero-to-one of every new line, and chose to cut the legacy others kept deferring",
    points: [
      {
        title: "I built zero-to-one more than once",
        body: "Manager, payments, deal, AI: whenever a new line opened I took it from the start. I built manager alone, design through frontend, and shipped it as a sellable product within a month.",
        sources: ["inpock manager, v0.1 to v1.5"],
      },
      {
        title: "I cut the legacy instead of deferring it",
        body: "I moved a Vue/Nuxt main service of 1,990 accumulated commits in one cutover rather than a gradual port, and brought the shared bundle from 318KB down to 191KB.",
        sources: [
          "Full React migration and design system consolidation",
          "Bundle and chunk restructuring",
        ],
      },
      {
        title: "I looked at what the product had riding on it",
        body: "I resolved token XSS exposure and the single-account limit in one release, and in ticketing decided by a single second, I moved the source of time from the client to the server.",
        sources: [
          "Multi-account and httpOnly cookie overhaul",
          "Server-time accuracy without the client clock",
        ],
      },
    ],
  },
  aiNative: {
    title: "Working with AI",
    lead: "I keep the codebase in a shape AI can work on, with the checks that verify its output wired into the code itself.",
    points: [
      {
        label: "Context",
        title: "I maintain a codebase written for AI to read",
        body: "AGENTS.md, context files for conventions, design system and infrastructure, and an icon catalogue written for agents, all versioned like code. Once the context people used to explain by hand lives in files, agents make the same call every time.",
      },
      {
        label: "Procedure",
        title: "I freeze repeated work into skills",
        body: "PRD to code, Figma to components, mocks to real APIs, bundled into about ten skills. I built them to cut my own repetition; since they live in the repo, the team uses and refines them too.",
      },
      {
        label: "Verification",
        title: "AI saying it's done doesn't make it done",
        body: "A stop hook refuses to end the session while lint or typecheck fails, and env files and credentials are blocked from being read at all. Values decided by feel I still set by hand on a real screen.",
      },
      {
        label: "Design",
        title: "I build a design system AI can operate",
        body: "Inspector controls are derived from prop types and anatomy is extracted from the components themselves. I'm wiring an agent harness into the playground so components can be assembled through conversation.",
      },
    ],
  },
  experience: [
    {
      company: "Inpock (Team AB-Z)",
      role: "Product Engineer",
      period: "Nov 2022 — Present",
      location: "Seoul, South Korea",
      context:
        "I build inpock, an all-in-one service for influencers. I owned the link-in-bio product for four years and left 1,799 merged PRs across ~30 internal frontend repos. Work not covered below includes the in-house payments and settlement system I built in five months, the AI line I took from zero (Nano Banana, AI 3.0 Chat, Agent Hub), the inpock deal reverse-offer flow, and Sendbird realtime chat.",
      achievements: [
        {
          title: "inpock manager, v0.1 to v1.5",
          period: "Sep 2024 — Dec 2024",
          summary:
            "Built an Instagram DM and reply automation SaaS from design through frontend, shipping a sellable product in one month and reaching v1.5 in four",
          situation: [
            "There was no admin product to sell Instagram DM and comment automation",
            "No instrumentation existed to show where onboarding lost people",
          ],
          action: [
            "Shipped v0.1 with onboarding, automated DMs and giveaway draws within a month, then auto-replies, link quick actions, viral triggers and scheduled sends over the next two",
            "Abstracted authenticated routes behind an auth HOC and funnelled routing edge cases through useSafeRouter",
            "Instrumented the funnel with GA4, hotjar and Channel Talk, and disabled next/image optimisation where Instagram thumbnails required it",
          ],
          result: [
            "Selling from v0.1 within a month, v1.5 by the fourth, a new line turned into a product",
            "10x growth in inpock product revenue over the following year, with onboarding drop-off now visible",
          ],
        },
        {
          title: "Bundle and chunk restructuring",
          period: "Jul 2026",
          summary:
            "Split a single shared chunk inherited from the Vue era into per-entry chunks and dropped an SDK the visitor path never needed, cutting shared JS from 318KB to 191KB",
          situation: [
            "First Load JS shared sat at 318KB, so every entry point paid the same weight first",
            "pages/_app bundled visitor and admin code together, shipping admin code to visitors",
          ],
          action: [
            "Split the shared chunk per entry point and separated visitor from admin code in pages/_app",
            "Dropped the Hackle SDK from the visitor path, but confirmed with the data owner first that the logging was not intentional collection",
            "Agreed to monitor request count after release, weighing the size win against that cost",
          ],
          result: [
            "Shared bundle 318KB → 191KB (-40%), pages/_app 217KB → 88.6KB (-59%)",
            "Visitor page 394KB → 257KB (-35%), admin editor 592KB → 375KB (-37%)",
          ],
        },
        {
          title: "Full React migration and design system consolidation",
          period: "Oct 2025 — Jan 2026",
          summary:
            "Moved a 1,990-commit Vue/Nuxt main service in one cutover instead of a long parallel migration, and put every line on one design system and per-service deploys",
          href: INPOCK,
          situation: [
            "The main service had run on Vue/Nuxt for four years with 1,990 commits of legacy",
            "Shared UI had drifted apart per service, so there was nowhere to land",
          ],
          action: [
            "Judging that parallel stacks only get more expensive the longer they run, I landed ids v2 and a shared sidebar first, then committed to a big-bang cutover",
            "Stood up a link package in the monorepo, shipped v1.0.0, and merged 20+ fixes to v1.0.7 within a month",
            "Split the single deploy job into parallel per-service workflows and unified pnpm across Dockerfiles",
          ],
          result: [
            "One cutover with no parallel-run period; visitor bundle 385KB → 304KB (-21%)",
            "Link, manager, deal and external apps share one design system and deploy independently",
          ],
        },
        {
          title: "Multi-account and httpOnly cookie overhaul",
          period: "May 2026 — Jun 2026",
          summary:
            "Fixed token exposure and the single-account limit in one release that bundled four tangled strands of authentication",
          situation: [
            "Auth tokens lived in JS-readable storage, fully exposed to XSS",
            "Only one account could connect, and 401 handling was split between SSR and CSR, crashing on window during SSR",
          ],
          action: [
            "Judging that split fixes would leave intermediate states for months, I bundled httpOnly migration, multi-account, unified 401 handling and utm cookie persistence into one release",
            "Built account switching with a picker modal and bottom sheet, clearing leftover cookies on both the parent domain and the host",
            "Re-injected expired tokens in the app webview to stop the expiry-page loop",
          ],
          result: [
            "Tokens are no longer reachable from JS, and accounts switch without logging out",
            "Fixed ad attribution leaking through volatile cookies; stabilised with 8 hotfixes",
          ],
        },
      ],
    },
  ],
  projects: [],
  side: [
    {
      company: "tabularasa",
      role: "Sole proprietor · Frontend",
      period: "Mar 2025 — Present",
      context:
        "A sole proprietorship registered in my own name. Depending on the job I own only the frontend, or carry collection, API and deploy alone. I also handle the parts outside the code, contracts and settlement, deliberately, as preparation for founding something later. Right now I'm building birdzip.com, which gathers public housing listings scattered across agencies.",
      achievements: [
        {
          title: "SieMatic Korea website",
          period: "Mar 2026 — Jun 2026",
          summary:
            "Owned the frontend for a German kitchen brand's Korean site, cutting image assets from 575MB to 79MB, and handled everything from contract to settlement myself",
          situation: [
            "On a brand site the first image is the product impression, yet the source came in at 575MB",
            "Showrooms and catalogues kept changing, so image swaps had to appear on deploy",
          ],
          action: [
            "Rebuilt the image pipeline with deduplication, 1600px resizing and blur placeholders",
            "Moved serving to S3 and CloudFront with automatic cache invalidation on deploy",
            "Converted pages to server components and unified SEO with a metadata factory and structured data",
          ],
          result: [
            "Image assets 575MB → 79MB (-86%), with swaps landing on deploy",
            "Ran one full cycle, contract through build, settlement and tax invoice, on my own",
          ],
        },
      ],
    },
    {
      company: "whata",
      role: "Lead · Frontend · Design · Marketing",
      period: "Oct 2023 — Jan 2024",
      context:
        "Built a server-time service for ticket rushes with a team of three. I led it and owned frontend, design and marketing, turning real usage into content with no ad budget and reaching 400 DAU and 1,000 MAU. One post hit 10k impressions and 34 reposts.",
      achievements: [
        {
          title: "Server-time accuracy without the client clock",
          period: "Oct 2023 — Dec 2023",
          summary:
            "When a ticket drop is decided in a single second, a clock that lies makes the whole product pointless. I moved the source of truth to the server",
          situation: [
            "Browser clocks drift by seconds per device, and background tabs throttle them further",
          ],
          action: [
            "Split out a server-time provider so every time on screen flows from the server response",
            "Worked around background throttling with a worker timer so the clock holds across tabs",
            "Since accuracy is the product itself, I showed millisecond precision and response latency on screen rather than hiding them",
          ],
          result: [
            "The clock stays accurate across tab switches and long sessions",
            "The first domestic MLB opening-game ticket win with it became a public user story",
          ],
        },
      ],
    },
  ],
  awards: [
    {
      title: "Smarteen App Challenge 2022 — Excellence Award, Development",
      issuer: "Ministry of SMEs and Startups · SK Planet",
      date: "Nov 2022",
      description: "Byeongjugo Yakjugo, a map-based environmental community",
    },
    {
      title: "Korea Code Fair Hackathon — Gold Prize, High School Division",
      issuer: "Ministry of Science and ICT",
      date: "Dec 2021",
      description: "Going, accessible route guidance for limited mobility",
    },
  ],
  education: [
    {
      school: "Inha University",
      degree: "B.S. Software Convergence Engineering",
      period: "Mar 2026 — Mar 2030",
    },
    {
      school: "Hansei Cybersecurity High School",
      degree: "Hacking & Security",
      period: "Mar 2020 — Feb 2023",
    },
  ],
  certifications: [
    { name: "Network Administrator Level 2", issuer: "KAIT" },
    { name: "Linux Master Level 2", issuer: "KAIT" },
    { name: "Craftsman Information Processing", issuer: "HRD Korea" },
  ],
};

// ja 전용 번역이 생기기 전까지는 영문 이력서를 그대로 쓴다
const RESUME: Record<LocaleType, Resume> = { ko, en, ja: en };

export function getResume(locale: LocaleType): Resume {
  return RESUME[locale] ?? RESUME.ko;
}

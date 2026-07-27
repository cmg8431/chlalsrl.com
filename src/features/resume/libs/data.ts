import type { LocaleType } from "@/shared";
import type { Resume } from "./types";

/**
 * 실제 값: 이름·회사·기간·학력·자격·수상·프로젝트·블로그 글.
 * 내용은 ~/orca/cv/docs/history 의 커밋·PR 기록에서 가져온 실제 작업이다.
 * 다만 PR 제목 기반이라 단독/팀 비중과 코드네임 정의는 본인 확인이 필요하고,
 * MAU·결제 처리량 같은 비즈니스 지표는 아직 비어 있다.
 *
 * - 자기소개는 헤드라인 한 줄 + 두 문단. 강점을 따로 나열하지 않는다.
 * - 성과는 항목당 셋. 원인 특정 → 어떻게 풀었나 → 무엇이 달라졌나 순서로,
 *   마지막 줄에 수치를 몰아준다. 페이지가 그 줄만 진하게 렌더한다.
 * - 확인할 수 있는 근거는 링크로 건다.
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
  role: "프론트엔드 개발자",
  location: "Seoul, KR",
  headline:
    "4년 굴린 서비스를 React로 다시 세우고, 공통 번들을 40% 덜어냈습니다.",
  highlights: [
    {
      value: "318KB → 191KB",
      label: "공통 번들 First Load JS",
      source: "번들 · 청크 구조 개선",
    },
    {
      value: "v0.1 → v1.5",
      label: "인포크 매니저, 4개월",
      source: "인포크 매니저 0 → v1.5",
    },
    {
      value: "0 → 1",
      label: "결제 · 매니저 · 딜 · AI 4개 라인",
      source: "결제 시스템 0 → 1 구축",
    },
  ],
  intro: [
    "열여덟에 실습생으로 인포크에 들어와 링크인바이오 서비스를 4년째 만들고 있습니다. 결제·매니저·딜·AI까지 새 라인이 열릴 때마다 0에서 시작하는 쪽을 맡았습니다.",
    "재현이 안 되는 오류는 로그로 좁히고, 인증처럼 숨은 경우가 많은 일은 단계적 수정보다 한 번에 묶는 쪽을 택합니다. 결정의 맥락은 블로그와 사내 문서에 남겨 같은 논의가 반복되지 않게 합니다. toss/es-hangul과 vercel/turborepo에 PR을 머지했습니다.",
  ],
  links: LINKS,
  experience: [
    {
      company: "인포크 (Team AB-Z)",
      role: "Product Engineer",
      period: "2022.11 — 현재",
      location: "Seoul, South Korea",
      context:
        "인플루언서를 위한 올인원 서비스 인포크를 개발합니다. 링크인바이오 인포크링크를 4년간 메인으로 맡았고, 매니저 · 딜 · 스토어 · AI까지 사내 프론트엔드 30여 개 저장소에 머지된 PR 1,799건을 남겼습니다.",
      achievements: [
        {
          title: "번들 · 청크 구조 개선",
          period: "2026.07",
          summary:
            "Vue 시절부터 이어진 단일 공통 청크를 진입점별로 쪼개고 방문자 경로의 불필요한 SDK를 걷어내, 공통 번들을 318KB → 191KB로 줄였습니다",
          situation: [
            "First Load JS shared가 318KB로, 어느 페이지로 들어오든 모든 진입점이 같은 무게를 먼저 부담하는 구조",
            "pages/_app 청크에 방문자·어드민 코드가 함께 묶여 있어 방문자 페이지도 어드민용 코드를 받고 있었음",
            "핵클 SDK가 방문자 페이지에서도 초기화되며 events · 코호트 요청을 쏘고 있었음",
          ],
          action: [
            "공통 청크를 진입점별로 분할하고 pages/_app에 묶여 있던 코드를 방문자 · 어드민으로 갈라냄",
            "방문자 경로에서 핵클 SDK 호출 제외 — 지우기 전에 해당 로깅이 의도된 수집인지 데이터 담당자에게 먼저 확인 (청크 약 15% 절감)",
            "청크 개수가 늘어난 만큼 요청 수 증가는 배포 후 모니터링하기로 하고, 감량 폭과 비용을 함께 보기로 합의",
          ],
          result: [
            "공통 번들(First Load JS shared) 318KB → 191KB (-40%)",
            "방문자 페이지 394KB → 257KB (-35%), pages/_app 217KB → 88.6KB (-59%)",
            "어드민 게시글 편집 592KB → 375KB (-37%), 어드민 전체 594KB → 491KB (-17%)",
          ],
        },
        {
          title: "인포크링크 React 전면 마이그레이션",
          period: "2025.11 — 2026.01",
          summary:
            "누적 1,990 커밋의 Vue/Nuxt 메인 서비스를 점진 이관 대신 빅뱅으로 옮기고, 방문자 페이지 번들을 385KB → 304KB로 줄였습니다",
          href: INPOCK,
          situation: [
            "링크인바이오 인포크링크는 4년간 Vue/Nuxt로 굴러온 메인 서비스로, 누적 1,990 커밋의 레거시가 쌓여 있었음",
            "두 스택을 동시에 굴리는 점진 이관은 기간이 길어질수록 중복 구현과 유지 비용이 커지는 구조",
            "공용 UI와 사이드바가 서비스마다 갈라져 있어 옮겨 앉을 착지 지점 자체가 없었음",
          ],
          action: [
            "직전 달에 디자인 시스템 ids v2와 공용 사이드바를 먼저 정리해 착지 지점을 만든 뒤 빅뱅 전환으로 결정",
            "모노레포 inpock-frontend 안에 link 패키지를 새로 세워 v1.0.0 출시, 한 달간 후속 수정 20여 건을 머지하며 v1.0.7까지 안정화",
            "절대경로·배럴 export 정리, 아이콘·이미지 중앙화, Docker 빌드 최적화로 번들 축소",
            "이후 반년간 v1.2.0까지 운영하며 마이그레이션이 끝난 Vue 페이지와 데드 코드 제거",
          ],
          result: [
            "마이그레이션 직후 방문자 페이지 번들 385KB → 304KB (-21%)로 1차 감량",
            "Vue·React 병행 운영 기간 없이 한 번에 전환 완료",
            "메인 서비스가 사내 모노레포·디자인 시스템과 같은 기반 위로 합류",
          ],
        },
        {
          title: "멀티 계정 · httpOnly 쿠키 보안 개편",
          period: "2026.05 — 2026.06",
          summary:
            "토큰 XSS 노출과 단일 계정 제약을, httpOnly 전환·멀티 계정·401 분기 통합을 묶은 단일 릴리즈로 한 번에 해소했습니다",
          situation: [
            "인증 토큰이 JS에서 접근 가능한 저장소에 있어 XSS에 그대로 노출되는 구조",
            "계정을 하나만 연결할 수 있어 채널을 여럿 운영하는 사용자가 로그아웃·재로그인을 반복",
            "401 처리가 SSR과 CSR에 따로 있어, SSR에서 window를 참조하다 터지는 경로가 남아 있었음",
          ],
          action: [
            "httpOnly 전환 · 멀티 계정 · 401 SSR/CSR 분기 통합 · utm 광고 식별자 쿠키 영속화를 단일 릴리즈로 묶음 — 인증은 숨은 경우가 많아 나눠 고치면 중간 상태가 오래 남는다고 판단",
            "계정 선택 모달과 바텀시트로 멀티 계정 전환 UX 구성",
            "부모 도메인과 현재 host 양쪽에서 인증 쿠키를 지워 잔여 쿠키 정리",
            "앱 웹뷰의 만료 토큰 재주입으로 만료 페이지 무한 루프 차단",
          ],
          result: [
            "토큰이 JS에서 접근 불가능해지고, 로그아웃 없이 계정 전환 가능",
            "한 달간 hotfix 8건으로 안정화",
            "쿠키 휘발로 새던 광고 어트리뷰션 동시 해소",
          ],
        },
        {
          title: "결제 시스템 0 → 1 구축",
          period: "2023.08 — 2023.12",
          summary:
            "외부 결제로 라우팅하던 구조를 방문자 결제와 판매자·관리자 정산 두 모듈로 나눠 5개월에 자체 구축했습니다",
          situation: [
            "결제를 외부로 넘기던 구조라 주문·정산 데이터를 서비스가 갖고 있지 않았음",
            "판매자 정산과 현금영수증 발행을 운영팀이 손으로 처리",
            "결제 예외가 나도 팀이 먼저 알 방법이 없어 사용자 문의로 인지",
          ],
          action: [
            "방문자 결제와 판매자·관리자 정산 두 모듈을 같은 날 오픈, 토스페이먼츠로 가상계좌·카드·현금영수증 발행 통합",
            "국민은행 가상계좌 페이업 버그는 해당 옵션만 셀러별로 제외하는 분기로 우회",
            "제주·도서산간 배송비는 우체국 도서산간 코드를 기준으로 분리",
            "현금영수증 폼은 소득공제를 먼저 노출하고 정보 미입력 시 제출 차단",
            "구매 예외 발생 시 Slack 자동 알림 연결",
          ],
          result: [
            "5개월에 외부 결제 라우팅 → 자체 결제·정산 플랫폼으로 전환",
            "운영팀이 정산과 현금영수증을 화면에서 직접 처리",
            "결제 예외를 사용자 문의 전에 팀이 먼저 인지",
          ],
        },
        {
          title: "인포크 매니저 0 → v1.5",
          period: "2024.09 — 2024.12",
          summary:
            "인스타그램 자동화 DM·답글 SaaS 어드민을 0에서 세워 4개월에 v0.1 → v1.5까지 올렸습니다",
          situation: [
            "인스타그램 DM·댓글 자동화를 팔 SaaS 어드민이 없어 0에서 시작해야 했음",
            "온보딩 어디서 이탈하는지 볼 수 있는 지표가 전혀 없었음",
          ],
          action: [
            "온보딩 · 자동화 DM · 이벤트 추첨(워터마크)으로 v0.1 출시",
            "자동 답글(v1.0~1.2) → 링크 퀵액션(v1.3) → viral 트리거(v1.4) → 예약 발송(v1.5)까지 두 달 만에 연속 배포",
            "auth HOC로 인증이 필요한 라우트를 추상화하고 useSafeRouter 훅으로 라우팅 예외를 한 곳에 수렴",
            "GA4 · hotjar · 채널톡을 붙여 온보딩 퍼널 계측",
            "인스타그램 썸네일 호환을 위해 next/image 최적화를 끄는 결정",
          ],
          result: [
            "4개월에 v0.1 → v1.5, 신규 라인을 판매 가능한 제품으로 세움",
            "온보딩 이탈 지점을 지표로 확인 가능",
          ],
        },
        {
          title: "인포크딜 역제안 · Sendbird 채팅",
          period: "2025.04 — 2025.06",
          summary:
            "크리에이터가 브랜드에 먼저 제안하는 역제안·역비딩 흐름과 실시간 채팅을 0에서 붙였습니다",
          situation: [
            "브랜드가 크리에이터를 찾는 단방향 구조라, 크리에이터가 먼저 제안할 경로가 없었음",
            "제안 이후 협의가 외부 메신저로 흩어져 서비스에 기록이 남지 않았음",
          ],
          action: [
            "역제안 화면과 역비딩 흐름을 0에서 설계하고 미들웨어·토큰 처리까지 직접 구현",
            "Sendbird로 실시간 채팅 연동 — 메시지 URL 경로 설계, 비회원 입력 횟수 제한, OG 메시지의 에러 텍스트 노출 차단",
            "다국어 selectBox와 React Native 웹뷰 분기 처리",
            "역제안 5차 · 역비딩 3차 QA를 한 달에 진행",
          ],
          result: [
            "크리에이터 → 브랜드 방향의 신규 거래 경로 오픈",
            "협의가 서비스 안 채팅에 기록으로 남음",
            "웹뷰에서 터지던 window undefined 해소, 한 달에 PR 약 30건",
          ],
        },
        {
          title: "백오피스 · 정산 회계 시스템",
          period: "2023.02 — 2025.12",
          summary:
            "운영팀이 손으로 처리하던 정산·회계를 화면으로 옮기고, 약 3년간 168 PR로 운영 도구를 키웠습니다",
          situation: [
            "크리에이터 · 브랜드 정산과 부가세 소명자료를 수기로 처리",
            "매치업 조회가 느리고 캠페인 현황을 볼 대시보드가 없었음",
          ],
          action: [
            "매치업 키워드 검색을 5단계로 나눠 배포하고 쿼리 리팩터링으로 조회 성능 개선",
            "공동구매 캠페인 대시보드 구축",
            "크리에이터 · 브랜드 정산 시스템과 현금영수증 관리 화면 구현",
            "정산 스프린트를 세 차례 진행하며 부가세 · 소명자료까지 처리 범위 확장",
          ],
          result: [
            "운영 대시보드가 회계까지 다루는 도구로 확장",
            "약 3년간 168 PR",
          ],
        },
        {
          title: "디자인 시스템 ids · 모노레포 CI 개편",
          period: "2025.10 — 현재",
          summary:
            "서비스마다 갈라진 UI와 배포 파이프라인을 하나의 디자인 시스템과 서비스별 병렬 워크플로우로 모았습니다",
          situation: [
            "inpock-ui-react가 서비스별로 갈라져 같은 컴포넌트가 중복 구현",
            "전체 배포가 한 워크플로우에 묶여 한 서비스 배포에 전부 대기",
            "Dockerfile마다 pnpm 버전이 달라 빌드 편차 발생",
          ],
          action: [
            "신규 디자인 시스템 ids를 모노레포로 이관하고 v0.2.6 → v2 통합에 참여",
            "link · manager · external로 서비스 폴더 분리",
            "전체 배포를 서비스별 병렬 워크플로우로 분할하고 수동 배포 워크플로우를 따로 분리",
            "Dockerfile의 pnpm 버전 통일",
          ],
          result: [
            "링크 · 매니저 · 딜 · 외부앱 전 라인이 같은 디자인 시스템 위에 정렬",
            "서비스 단위 독립 배포로 대기 시간 제거",
          ],
        },
        {
          title: "AI 라인 — 나노바나나 · AI 3.0 Chat · Agent Hub",
          period: "2025.07 — 현재",
          summary:
            "제품에 AI를 붙이는 라인을 0에서 맡아 외부 유입 페이지부터 에이전트 인프라까지 넓히고 있습니다",
          situation: [
            "제품에 AI를 붙이는 라인이 없어 0에서 시작",
            "AI 기능은 호출 비용이 있어 사용량 제어 없이는 열 수 없는 구조",
          ],
          action: [
            "외부 유입 페이지를 세우고 나노바나나 AI를 1 · 2차에 걸쳐 배포",
            "이미지 생성 리밋과 채팅 최대 입력 제어 설계",
            "AI 3.0 Chat 온보딩과 hackle 로깅 연결",
            "YAML 프롬프트 빌더와 디스크 스냅샷 파이프라인으로 에이전트 인프라 구축 중",
          ],
          result: [
            "AI 라인이 제품 안에서 열리고, 이탈 지점을 지표로 확인",
            "프롬프트 · 스냅샷을 코드처럼 관리하는 기반 마련",
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
        "제 이름으로 낸 개인사업자입니다. 일에 따라 프론트엔드만 맡기도 하고 수집 · API · 배포까지 혼자 끌고 가기도 합니다. 계약과 정산 같은 코드 밖의 일도 직접 처리하는데, 나중에 창업했을 때 겪을 일을 미리 겪어두려고 택한 방식입니다.",
      achievements: [
        {
          title: "SieMatic 코리아 웹사이트 구축",
          period: "2026.03 — 2026.06",
          summary:
            "독일 주방 브랜드의 한국 웹사이트에서 프론트엔드를 단독으로 맡아 이미지 자산 575MB를 79MB로 줄이고, 외주사와의 계약부터 함께 일한 분의 정산까지 직접 처리했습니다",
          situation: [
            "브랜드 사이트는 첫 화면의 이미지 품질이 곧 제품 인상인데, 원본 자산이 575MB로 그대로 올릴 수 없는 규모였음",
            "디자인 · API · 인프라를 각각 다른 담당이 맡아, 프론트엔드가 그 사이를 맞춰 붙이는 자리였음",
            "쇼룸 · 카탈로그가 계속 바뀌어 배포할 때마다 이미지가 즉시 갈려야 했음",
            "개발만 받아 가는 자리가 아니라, 외주사와 범위 · 일정 · 대금을 직접 정하고 함께 일한 분의 몫까지 책임지는 자리였음",
          ],
          action: [
            "이미지 파이프라인을 다시 짜 중복 제거 · 1600px 리사이즈 · blur placeholder를 적용해 575MB → 79MB",
            "이미지를 S3 · CloudFront에서 서빙하도록 옮기고, 배포 시 캐시를 자동 무효화해 교체가 바로 반영되게 함",
            "페이지를 서버 컴포넌트로 전환하고 메타데이터 팩토리 · 구조화 데이터로 SEO를 정리",
            "운영팀이 쓸 어드민 대시보드 화면까지 프론트엔드에서 함께 구현",
            "외주사와 직접 커뮤니케이션하며 계약을 맺고, 함께 작업한 분의 정산과 세금계산서 발행까지 처리",
          ],
          result: [
            "이미지 자산 575MB → 79MB (-86%)",
            "프론트엔드 저장소를 처음부터 배포까지 단독으로 끌고 감",
            "이미지 교체가 배포 즉시 반영돼 운영이 개발자를 거치지 않음",
            "계약 → 개발 → 정산 → 세금계산서까지 한 사이클을 직접 돌려봄 — 창업 전에 겪어두려고 자처한 자리",
          ],
        },
        {
          title: "버드집 birdzip — 공공주택 공고 탐색 (진행 중)",
          period: "2026.07 — 현재",
          summary:
            "기관마다 흩어진 공공 임대 · 청약 공고를 한곳에 모으는 자체 서비스. 30분마다 도는 수집 파이프라인과 지도 탐색을 2주 만에 세웠습니다",
          situation: [
            "LH · SH · GH · 안심주택 공고가 기관별로 흩어져 있어 조건에 맞는 집을 찾으려면 사이트를 돌아다녀야 함",
            "공고 원문은 PDF로 올라오고 위치 · 교통 정보가 본문에 묻혀 있어 비교가 어려움",
          ],
          action: [
            "LH API와 안심주택 게시판, SH · GH를 크롤러로 모아 Postgres에 적재하고 oRPC로 제공",
            "GitHub Actions에서 30분마다 수집 후 자동 배포하고, 크롤 전에 DB 스키마를 맞춰 컬럼 드리프트를 차단",
            "PDF 텍스트 추출과 지오코딩 · 대중교통 정보를 붙여 공고를 비교 가능한 데이터로 만듦",
            "MapLibre 전체화면 지도에 서울 지하철 노선 · 역 geojson을 얹어 위치로 탐색하게 함",
            "Base UI와 motion 위에 @birdzip/ui · @birdzip/icons · 디자인 토큰 · 플레이그라운드로 디자인 시스템을 따로 세움",
          ],
          result: [
            "birdzip.com 라이브 — 공고가 30분마다 갱신됨",
            "2주 만에 수집 → 저장 → 지도 탐색까지 도는 제품",
            "지금은 조건 기반 맞춤 탐색을 다듬는 중",
          ],
        },
      ],
    },
    {
      company: "왓타 whata",
      role: "리드 · 프론트엔드 · 디자인 · 마케팅",
      period: "2023.10 — 2024.01",
      context:
        "티켓팅에 쓰는 서버시간 서비스를 세 명 팀으로 만들었습니다. 리드를 맡아 프론트엔드 · 디자인 · 마케팅을 메인으로 가져갔고, DAU 400 · MAU 1,000까지 올렸습니다.",
      achievements: [
        {
          title: "서버시간 정확도 — 클라이언트 시계 의존 제거",
          period: "2023.10 — 2023.12",
          summary:
            "1초로 갈리는 티켓팅에서 화면의 시계가 틀리면 제품 자체가 의미를 잃습니다. 시각의 근거를 클라이언트에서 서버로 옮겼습니다",
          situation: [
            "티켓 오픈은 초 단위로 갈리는데 브라우저 시계는 기기마다 몇 초씩 어긋나 있음",
            "백그라운드 탭에서는 setTimeout이 throttle되며 시계가 그대로 밀려버림",
            "정확한지 눈으로 확인할 방법이 없으면 사용자는 이 서비스를 믿고 쓰지 않음",
          ],
          action: [
            "서버 시간 provider를 분리해 화면의 모든 시각이 서버 응답을 기준으로 흐르게 함",
            "worker timer로 백그라운드 throttle을 우회해 탭을 옮겨도 시계가 밀리지 않게 처리",
            "밀리초 단위 시각과 응답 지연(ms)을 숨기지 않고 화면에 그대로 노출 — 정확도가 곧 신뢰인 제품이라 근거를 보여주는 쪽을 택함",
            "모바일 100vh 이슈, useShare 공유 훅, Sentry · GTM 환경 분리, next-sitemap 동적 사이트맵",
          ],
          result: [
            "탭을 옮기거나 화면을 오래 켜둬도 시계가 밀리지 않음",
            "국내 첫 MLB 개막전 예매 성공 사례가 서비스 사용 후기로 남음",
          ],
        },
        {
          title: "바이럴 마케팅 직접 운영",
          period: "2023.11 — 2024.01",
          summary:
            "광고비 없이, 서비스가 실제로 쓰인 장면을 콘텐츠로 만들어 DAU 400 · MAU 1,000까지 끌어올렸습니다",
          situation: [
            "예산 없이 시작한 서비스라 알려질 경로가 처음부터 없었음",
            "티켓팅 수요는 경기 · 공연 일정에 붙어 특정 시점에만 몰리는 구조",
          ],
          action: [
            "기능 설명 대신 실제로 쓰인 장면을 소재로 삼음 — 개발자가 이 서비스로 MLB 개막전 티켓팅에 성공한 후기",
            "X · 인스타그램 채널을 직접 운영하며 예매가 열리는 시점에 맞춰 콘텐츠 발행",
            "해시태그를 구단 · 경기 단위로 붙여 예매를 검색하는 흐름 위에 얹음",
          ],
          result: [
            "게시물 1건이 1만 노출 · 재게시 34회",
            "DAU 400 · MAU 1,000",
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
  role: "Frontend Engineer",
  headline:
    "I rebuilt a four-year-old service on React and cut its shared bundle by 40%.",
  highlights: [
    {
      value: "318KB → 191KB",
      label: "Shared First Load JS",
      source: "Bundle and chunk restructuring",
    },
    {
      value: "v0.1 → v1.5",
      label: "inpock manager, 4 months",
      source: "inpock manager, 0 to v1.5",
    },
    {
      value: "0 → 1",
      label: "Payments · manager · deal · AI",
      source: "Payments from zero to one",
    },
  ],
  intro: [
    "I joined inpock at eighteen as an intern and have been building its link-in-bio service for four years. Whenever a new product line opened — payments, manager, deal, AI — I took the part that starts from zero.",
    "I narrow unreproducible errors down with logs, and for work with many hidden cases, like authentication, I prefer one bundled release over a long chain of fixes. I write down why decisions were made so the same discussion doesn't repeat. Merged PRs into toss/es-hangul and vercel/turborepo.",
  ],
  experience: [
    {
      company: "Inpock (Team AB-Z)",
      role: "Product Engineer",
      period: "Nov 2022 — Present",
      location: "Seoul, South Korea",
      context:
        "I build inpock, an all-in-one service for influencers. I owned the link-in-bio product for four years and left 1,799 merged PRs across ~30 internal frontend repos — manager, deal, store and AI lines.",
      achievements: [
        {
          title: "Bundle and chunk restructuring",
          period: "Jul 2026",
          summary:
            "Split a single shared chunk inherited from the Vue era into per-entry chunks and dropped an SDK the visitor path never needed, cutting shared JS from 318KB to 191KB",
          situation: [
            "First Load JS shared sat at 318KB, so every entry point paid the same weight before rendering anything",
            "The pages/_app chunk bundled visitor and admin code together, shipping admin code to visitor pages",
            "The Hackle SDK initialised on visitor pages too, firing events and cohort requests",
          ],
          action: [
            "Split the shared chunk per entry point and separated visitor from admin code inside pages/_app",
            "Removed the Hackle SDK from the visitor path — but confirmed with the data owner first that the logging was not intentional collection (~15% of the chunk)",
            "Agreed to monitor request count after release, since more chunks means more requests, and to weigh the size win against that cost",
          ],
          result: [
            "Shared First Load JS 318KB → 191KB (-40%)",
            "Visitor page 394KB → 257KB (-35%), pages/_app 217KB → 88.6KB (-59%)",
            "Admin post editor 592KB → 375KB (-37%), admin overall 594KB → 491KB (-17%)",
          ],
        },
        {
          title: "Full React migration of inpock link",
          period: "Nov 2025 — Jan 2026",
          summary:
            "Moved a 1,990-commit Vue/Nuxt main service in one cutover instead of a long parallel migration, and cut the visitor-page bundle from 385KB to 304KB",
          href: INPOCK,
          situation: [
            "inpock link, the link-in-bio main service, had run on Vue/Nuxt for four years with 1,990 commits of legacy",
            "An incremental migration means running two stacks at once — the longer it lasts, the more duplicated work it costs",
            "Shared UI and the sidebar had drifted apart per service, so there was nowhere to land",
          ],
          action: [
            "Landed the ids v2 design system and a shared sidebar the month before, then committed to a big-bang cutover",
            "Stood up a new link package inside the inpock-frontend monorepo, shipped v1.0.0, and merged 20+ follow-up fixes to v1.0.7 within a month",
            "Cut the bundle with absolute paths, barrel-export cleanup, centralised icons and images, and Docker build tuning",
            "Ran it to v1.2.0 over the next six months, removing migrated Vue pages and dead code",
          ],
          result: [
            "First pass right after the migration: visitor-page bundle 385KB → 304KB (-21%)",
            "No period of running Vue and React side by side",
            "The main service now sits on the same monorepo and design system as everything else",
          ],
        },
        {
          title: "Multi-account and httpOnly cookie overhaul",
          period: "May 2026 — Jun 2026",
          summary:
            "Fixed token exposure and the single-account limit in one release that bundled httpOnly migration, multi-account and unified 401 handling",
          situation: [
            "Auth tokens lived in JS-readable storage, fully exposed to XSS",
            "Only one account could be connected, so users running several channels logged out and back in constantly",
            "401 handling was split between SSR and CSR, leaving a path that crashed on window during SSR",
          ],
          action: [
            "Bundled httpOnly migration, multi-account, unified 401 SSR/CSR handling and utm cookie persistence into a single release — auth has too many hidden cases to leave half-migrated",
            "Built account switching with a picker modal and bottom sheet",
            "Cleared auth cookies on both the parent domain and the current host to remove leftovers",
            "Re-injected expired tokens in the app webview to stop the expiry-page loop",
          ],
          result: [
            "Tokens are no longer reachable from JS, and accounts switch without logging out",
            "Stabilised with 8 hotfixes over the following month",
            "Ad attribution that leaked through volatile cookies was fixed along the way",
          ],
        },
        {
          title: "Payments from zero to one",
          period: "Aug 2023 — Dec 2023",
          summary:
            "Replaced third-party payment routing with our own checkout and seller/admin settlement in five months",
          situation: [
            "Payments were routed out to a third party, so the service never held its own order or settlement data",
            "Seller settlement and cash receipts were handled by hand",
            "Payment failures only surfaced through user complaints",
          ],
          action: [
            "Opened visitor checkout and seller/admin settlement on the same day, integrating Toss Payments with virtual accounts, cards and cash receipts",
            "Worked around a KB virtual-account payup bug by disabling only that option per seller",
            "Split Jeju and remote-island shipping fees using Korea Post's remote-area codes",
            "Put the tax deduction first in the cash-receipt form and blocked submission on missing fields",
            "Wired Slack alerts for checkout exceptions",
          ],
          result: [
            "External routing → our own payment and settlement platform in five months",
            "Operations handles settlement and cash receipts directly on screen",
            "The team sees payment failures before users report them",
          ],
        },
        {
          title: "inpock manager, v0.1 to v1.5",
          period: "Sep 2024 — Dec 2024",
          summary:
            "Built the admin for an Instagram DM and reply automation SaaS from zero, reaching v1.5 in four months",
          situation: [
            "There was no admin product to sell Instagram DM and comment automation — it started from nothing",
            "No instrumentation existed to show where onboarding lost people",
          ],
          action: [
            "Shipped v0.1 with onboarding, automated DMs and watermarked giveaway draws",
            "Followed with auto-replies (v1.0–1.2) → link quick actions (v1.3) → viral triggers (v1.4) → scheduled sends (v1.5) in two months",
            "Abstracted authenticated routes behind an auth HOC and funnelled routing edge cases through a useSafeRouter hook",
            "Instrumented the onboarding funnel with GA4, hotjar and Channel Talk",
            "Disabled next/image optimisation where Instagram thumbnails required it",
          ],
          result: [
            "v0.1 → v1.5 in four months, turning a new line into a sellable product",
            "Onboarding drop-off became visible as a metric",
          ],
        },
        {
          title: "inpock deal reverse offers and Sendbird chat",
          period: "Apr 2025 — Jun 2025",
          summary:
            "Built the reverse-offer and reverse-bidding flow that lets creators approach brands first, plus realtime chat",
          situation: [
            "The marketplace only ran one way — brands found creators, creators had no way to pitch first",
            "Negotiation moved to outside messengers, so nothing was recorded in the product",
          ],
          action: [
            "Designed the reverse-offer screens and bidding flow from scratch, including middleware and token handling",
            "Integrated Sendbird for realtime chat — message URL routing, input limits for guests, and blocking raw error text from OG messages",
            "Handled localised select boxes and React Native webview branching",
            "Ran five rounds of reverse-offer QA and three of bidding QA within a month",
          ],
          result: [
            "Opened a new creator → brand deal path",
            "Negotiation now stays recorded inside the product",
            "Fixed the window-undefined crash in the webview; ~30 PRs in a month",
          ],
        },
        {
          title: "Back office and settlement accounting",
          period: "Feb 2023 — Dec 2025",
          summary:
            "Moved manual settlement and accounting onto screens, growing the internal tool over ~3 years and 168 PRs",
          situation: [
            "Creator and brand settlement, VAT and supporting documents were all handled manually",
            "Match-up queries were slow and there was no dashboard for campaign status",
          ],
          action: [
            "Shipped match-up keyword search in five stages and refactored the queries for speed",
            "Built the group-buying campaign dashboard",
            "Implemented creator/brand settlement and the cash-receipt admin",
            "Ran three settlement sprints, extending scope to VAT and supporting documents",
          ],
          result: [
            "The ops dashboard grew into a tool that covers accounting",
            "168 PRs over roughly three years",
          ],
        },
        {
          title: "ids design system and monorepo CI",
          period: "Oct 2025 — Present",
          summary:
            "Pulled per-service UI and deployment pipelines onto one design system and parallel per-service workflows",
          situation: [
            "inpock-ui-react had forked per service, duplicating the same components",
            "One workflow deployed everything, so any release blocked the rest",
            "pnpm versions differed across Dockerfiles, causing build drift",
          ],
          action: [
            "Moved the new ids design system into the monorepo and joined the v0.2.6 → v2 consolidation",
            "Split service folders into link, manager and external",
            "Broke the single deploy job into parallel per-service workflows and separated the manual deploy path",
            "Unified pnpm versions across Dockerfiles",
          ],
          result: [
            "Link, manager, deal and external apps all sit on the same design system",
            "Services deploy independently, with no waiting on each other",
          ],
        },
        {
          title: "AI line — Nano Banana, AI 3.0 Chat, Agent Hub",
          period: "Jul 2025 — Present",
          summary:
            "Took the AI line from zero, from external landing pages through to agent infrastructure",
          situation: [
            "There was no AI line in the product — it started from zero",
            "AI features cost money per call, so nothing could ship without usage control",
          ],
          action: [
            "Built external landing pages and shipped Nano Banana AI across two releases",
            "Designed image-generation limits and maximum chat input control",
            "Wired AI 3.0 Chat onboarding to hackle logging",
            "Currently building agent infrastructure with a YAML prompt builder and disk snapshot pipeline",
          ],
          result: [
            "The AI line ships inside the product, with drop-off visible as a metric",
            "Prompts and snapshots are now managed like code",
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
        "A sole proprietorship registered in my own name. Depending on the job I own only the frontend, or carry collection, API and deploy alone. I also handle the parts outside the code — contracts and settlement — deliberately, as preparation for founding something later.",
      achievements: [
        {
          title: "SieMatic Korea website",
          period: "Mar 2026 — Jun 2026",
          summary:
            "Owned the frontend for a German kitchen brand's Korean site, cutting image assets from 575MB to 79MB, while handling the client contract and settling with the person who worked with me",
          situation: [
            "On a brand site the first image is the product impression, yet the source assets came in at 575MB",
            "Design, API and infrastructure each had their own owner, and the frontend was where those pieces had to meet",
            "Showrooms and catalogues kept changing, so image swaps had to appear the moment they deployed",
            "This was not a hand-me-the-spec seat: scope, schedule and payment were mine to agree, and so was paying the person working with me",
          ],
          action: [
            "Rebuilt the image pipeline with deduplication, 1600px resizing and blur placeholders: 575MB → 79MB",
            "Moved image serving to S3 and CloudFront with automatic cache invalidation on deploy",
            "Converted pages to server components and unified SEO with a metadata factory and structured data",
            "Built the operations admin dashboard screens on the frontend side as well",
            "Negotiated and signed the contract with the agency directly, and handled settlement and tax invoicing for my collaborator",
          ],
          result: [
            "Image assets 575MB → 79MB (-86%)",
            "Carried the frontend repo from first commit through deploy alone",
            "Image swaps land on deploy, so operations no longer goes through a developer",
            "Ran one full cycle — contract, build, settlement, tax invoice — on purpose, as a rehearsal for founding a company",
          ],
        },
        {
          title: "birdzip — public housing listings (in progress)",
          period: "Jul 2026 — Present",
          summary:
            "A self-initiated service gathering public housing listings scattered across agencies, with a collection pipeline running every 30 minutes and map-based browsing, built in two weeks",
          situation: [
            "LH, SH, GH and Ansim listings live on separate sites, so finding a match means touring agencies one by one",
            "Listings arrive as PDFs with location and transit details buried in the text, making comparison hard",
          ],
          action: [
            "Collect from the LH API, the Ansim board, SH and GH into Postgres, served over oRPC",
            "Crawl and auto-deploy every 30 minutes from GitHub Actions, syncing the DB schema before each crawl to prevent column drift",
            "Extract PDF text and enrich each listing with geocoding and transit data so listings become comparable",
            "Built a full-screen MapLibre explorer with Seoul subway line and station geojson",
            "Stood up a separate design system — @birdzip/ui and @birdzip/icons on Base UI and motion, with tokens and a playground",
          ],
          result: [
            "birdzip.com is live, refreshing listings every 30 minutes",
            "Collection → storage → map browsing running end to end in two weeks",
            "Currently refining condition-based matching",
          ],
        },
      ],
    },
    {
      company: "whata",
      role: "Lead · Frontend · Design · Marketing",
      period: "Oct 2023 — Jan 2024",
      context:
        "Built a server-time service for ticket rushes with a team of three. I led it and owned frontend, design and marketing, taking it to 400 DAU and 1,000 MAU.",
      achievements: [
        {
          title: "Server-time accuracy — removing the client clock",
          period: "Oct 2023 — Dec 2023",
          summary:
            "When a ticket drop is decided in a single second, a clock that lies makes the whole product pointless. I moved the source of truth from the client to the server",
          situation: [
            "Ticket drops are decided by seconds, yet browser clocks drift by several seconds from device to device",
            "In a background tab setTimeout is throttled, so the clock silently falls behind",
            "Without a way to see that the time is right, no one trusts a service like this",
          ],
          action: [
            "Split out a server-time provider so every time on screen flows from the server response",
            "Worked around background throttling with a worker timer so the clock holds even after switching tabs",
            "Showed millisecond precision and response latency on screen instead of hiding them — accuracy is the product, so the evidence belongs in the UI",
            "Mobile 100vh fix, a useShare hook, Sentry and GTM environment separation, a dynamic sitemap",
          ],
          result: [
            "The clock stays accurate across tab switches and long sessions",
            "The first domestic MLB opening-game ticket win with it became a public user story",
          ],
        },
        {
          title: "Running the viral marketing myself",
          period: "Nov 2023 — Jan 2024",
          summary:
            "With no ad budget, I turned real usage into content and grew it to 400 DAU and 1,000 MAU",
          situation: [
            "A self-funded service with no distribution channel to start from",
            "Demand for ticketing spikes only around specific games and shows",
          ],
          action: [
            "Used real usage as the material instead of feature copy — a developer landing MLB opening-day tickets with it",
            "Ran the X and Instagram channels myself, publishing against the drop schedule",
            "Tagged posts per team and per game so they sat on the search path people already take",
          ],
          result: [
            "One post reached 10k impressions and 34 reposts",
            "400 DAU, 1,000 MAU",
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

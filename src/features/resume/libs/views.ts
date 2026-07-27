/**
 * 이력서 열람 기록 — Supabase REST를 브라우저에서 직접 호출한다(게스트북과 같은 방식).
 *
 * 남기는 것은 어느 링크가 언제 얼마나 읽혔는지뿐이다. 회사별 링크를 보내고
 * 팔로업 시점을 잡는 게 목적이라 그 이상은 필요 없다 — IP도 UA도 저장하지 않고,
 * 세션 ID는 브라우저가 스스로 만든 난수라 사람을 되짚을 수 없다.
 *
 * 테이블은 쓰기만 열려 있다(스키마: supabase/schema.sql). 공개 키로는 읽지 못한다.
 */

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const resumeViewsEnabled = Boolean(URL && KEY);

const SESSION_KEY = "resume-session-id";

function sessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export interface ResumeViewRecord {
  /** 회사별 링크로 들어왔을 때만 채워진다. 맨 URL이면 null */
  company: string | null;
  locale: string;
  referrer: string | null;
  /** 문서에 머문 시간(초) */
  seconds: number;
  /** 가장 깊이 내려간 섹션 — 어디서 덮었는지가 곧 관심사다 */
  deepestSection: string | null;
}

export function recordResumeView(record: ResumeViewRecord): void {
  if (!URL || !KEY) return;

  let session: string;
  try {
    session = sessionId();
  } catch {
    return; // 저장소가 막힌 브라우저 — 기록을 포기하지 페이지를 깨뜨리진 않는다
  }

  // keepalive: 탭이 닫히는 중에도 요청이 끝까지 살아남는다
  void fetch(`${URL}/rest/v1/resume_views`, {
    method: "POST",
    keepalive: true,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      company: record.company,
      locale: record.locale,
      session_id: session,
      referrer: record.referrer,
      seconds: record.seconds,
      deepest_section: record.deepestSection,
    }),
  }).catch(() => {
    // 기록이 하나 빠지는 것보다 조용한 편이 낫다
  });
}

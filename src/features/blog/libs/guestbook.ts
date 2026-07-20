/**
 * 댓글·좋아요 저장소 — Supabase REST를 브라우저에서 직접 호출한다.
 * 서버 코드 없음. 좋아요는 익명 세션 ID 기반 토글(취소 가능)이며,
 * post_likes 테이블은 봉인되어 security definer 함수로만 접근한다.
 * (스키마: supabase/schema.sql)
 */

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// env 없는 로컬 개발용 — localStorage에만 저장
const DEV_PREVIEW = !URL && process.env.NODE_ENV === "development";

export const guestbookEnabled = Boolean(URL && KEY) || DEV_PREVIEW;

function sessionId(): string {
  const KEY_NAME = "guest-session-id";
  let id = localStorage.getItem(KEY_NAME);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY_NAME, id);
  }
  return id;
}

async function rest(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(`${URL}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: KEY!,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) throw new Error(`supabase ${res.status}`);
  return res;
}

export interface LikeState {
  likes: number;
  liked: boolean;
}

function devLikeState(slug: string): LikeState {
  return {
    likes: Number(localStorage.getItem(`dev-likes:${slug}`) ?? 0),
    liked: localStorage.getItem(`dev-liked:${slug}`) === "1",
  };
}

export async function fetchLikeState(slug: string): Promise<LikeState> {
  if (DEV_PREVIEW) return devLikeState(slug);
  const res = await rest(`/rpc/like_state`, {
    method: "POST",
    body: JSON.stringify({ post_slug: slug, sid: sessionId() }),
  });
  const rows: LikeState[] = await res.json();
  return rows[0] ?? { likes: 0, liked: false };
}

export async function toggleLike(slug: string): Promise<LikeState> {
  if (DEV_PREVIEW) {
    const { likes, liked } = devLikeState(slug);
    const next = {
      likes: liked ? likes - 1 : likes + 1,
      liked: !liked,
    };
    localStorage.setItem(`dev-likes:${slug}`, String(next.likes));
    localStorage.setItem(`dev-liked:${slug}`, next.liked ? "1" : "0");
    return next;
  }
  const res = await rest(`/rpc/toggle_like`, {
    method: "POST",
    body: JSON.stringify({ post_slug: slug, sid: sessionId() }),
  });
  const rows: LikeState[] = await res.json();
  return rows[0] ?? { likes: 0, liked: false };
}

export interface CommentRow {
  id: string;
  author: string;
  body: string;
  created_at: string;
  parent_id: string | null;
}

export async function fetchComments(slug: string): Promise<CommentRow[]> {
  if (DEV_PREVIEW) {
    return JSON.parse(
      localStorage.getItem(`dev-comments:${slug}`) ?? "[]"
    ) as CommentRow[];
  }
  const res = await rest(
    `/comments?slug=eq.${encodeURIComponent(slug)}&select=id,author,body,created_at,parent_id&order=created_at.asc`
  );
  return (await res.json()) as CommentRow[];
}

export async function addComment(
  slug: string,
  author: string,
  body: string,
  parentId: string | null = null
): Promise<void> {
  if (DEV_PREVIEW) {
    const rows = await fetchComments(slug);
    rows.push({
      id: `dev-${rows.length}`,
      author,
      body,
      created_at: new Date().toISOString(),
      parent_id: parentId,
    });
    localStorage.setItem(`dev-comments:${slug}`, JSON.stringify(rows));
    return;
  }
  await rest(`/comments`, {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ slug, author, body, parent_id: parentId }),
  });
}

/** 목록용 — 전체 댓글의 slug만 한 번에 받아 글별 개수로 집계한다 */
export async function fetchCommentCounts(): Promise<Record<string, number>> {
  if (DEV_PREVIEW) {
    const counts: Record<string, number> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith("dev-comments:")) continue;
      const slug = key.slice("dev-comments:".length);
      counts[slug] = (JSON.parse(localStorage.getItem(key) ?? "[]") as unknown[])
        .length;
    }
    return counts;
  }
  const res = await rest(`/comments?select=slug`);
  const rows = (await res.json()) as { slug: string }[];
  const counts: Record<string, number> = {};
  for (const row of rows) {
    counts[row.slug] = (counts[row.slug] ?? 0) + 1;
  }
  return counts;
}

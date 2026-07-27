import { notFound } from "next/navigation";

import type { LocaleType } from "@/shared";

/**
 * 열람 통계. 보낸 링크가 열렸는지, 어디까지 읽혔는지를 본다.
 *
 * 이 표가 있어야 회사별 링크가 기능이 된다 — 기록만 쌓고 볼 방법이 없으면
 * 아무것도 안 한 것과 같다. 팔로업 시점을 잡는 게 전부라 표 하나면 충분하다.
 *
 * resume_views 는 쓰기만 열린 테이블이라 공개 키로는 읽히지 않는다.
 * 여기서만 서비스 롤 키로 읽고, 주소는 RESUME_STATS_KEY 로 잠근다.
 * 둘 중 하나라도 없으면 페이지 자체가 없는 것으로 둔다.
 */
export const dynamic = "force-dynamic";

interface ViewRow {
  company: string | null;
  locale: string;
  referrer: string | null;
  seconds: number;
  deepest_section: string | null;
  created_at: string;
}

async function fetchViews(): Promise<ViewRow[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  const res = await fetch(
    `${url}/rest/v1/resume_views?select=company,locale,referrer,seconds,deepest_section,created_at&order=created_at.desc&limit=300`,
    {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    },
  );
  if (!res.ok) return null;
  return res.json();
}

function formatWhen(iso: string, locale: LocaleType): string {
  return new Intl.DateTimeFormat(locale, {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default async function ResumeStatsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: LocaleType }>;
  searchParams: Promise<{ k?: string }>;
}) {
  const [{ locale }, { k }] = await Promise.all([params, searchParams]);

  const secret = process.env.RESUME_STATS_KEY;
  if (!secret || k !== secret) notFound();

  const views = await fetchViews();

  return (
    <div className="prose-blog">
      <h1 className="text-[22px] font-semibold tracking-tight text-bright">
        Resume views
      </h1>

      {views === null ? (
        <p className="mt-4 text-[13.5px] leading-[1.7] text-muted">
          SUPABASE_SERVICE_ROLE_KEY 가 없거나 조회에 실패했습니다. 키를 넣고
          supabase/schema.sql 의 resume_views 를 실행해 주세요.
        </p>
      ) : views.length === 0 ? (
        <p className="mt-4 text-[13.5px] leading-[1.7] text-muted">
          아직 기록이 없습니다.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left font-mono text-[11.5px]">
            <thead className="text-faint">
              <tr>
                <th className="py-2 pr-4 font-normal">when</th>
                <th className="py-2 pr-4 font-normal">company</th>
                <th className="py-2 pr-4 font-normal">read</th>
                <th className="py-2 pr-4 font-normal">reached</th>
                <th className="py-2 font-normal">from</th>
              </tr>
            </thead>
            <tbody>
              {views.map((view) => (
                <tr
                  key={`${view.created_at}-${view.company ?? ""}`}
                  className="border-t border-line text-muted"
                >
                  <td className="py-2 pr-4 tabular-nums whitespace-nowrap">
                    {formatWhen(view.created_at, locale)}
                  </td>
                  <td className="py-2 pr-4 text-bright">
                    {view.company ?? "—"}
                  </td>
                  <td className="py-2 pr-4 tabular-nums">{view.seconds}s</td>
                  <td className="py-2 pr-4">{view.deepest_section ?? "—"}</td>
                  <td className="py-2 max-w-[16rem] truncate">
                    {view.referrer ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

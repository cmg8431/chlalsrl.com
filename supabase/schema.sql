-- chlalsrl.com 댓글·좋아요 스키마 (전체 재실행 안전 — idempotent)
-- Supabase 대시보드 → SQL Editor에 붙여넣고 실행.

-- (v1 잔재 정리)
drop function if exists like_post(text);
drop table if exists likes;

-- 좋아요: 익명 세션 단위로 저장 → 취소(토글) 가능
create table if not exists post_likes (
  slug text not null,
  session_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (slug, session_id)
);
-- 직접 접근은 전부 차단 (정책 없는 RLS) — 아래 함수로만 읽고 쓴다.
alter table post_likes enable row level security;

create or replace function like_state(post_slug text, sid uuid)
returns table (likes bigint, liked boolean)
language sql
security definer
as $$
  select count(*)::bigint as likes,
         (bool_or(session_id = sid) is true) as liked
  from post_likes
  where slug = post_slug;
$$;

create or replace function toggle_like(post_slug text, sid uuid)
returns table (likes bigint, liked boolean)
language plpgsql
security definer
as $$
begin
  if exists (
    select 1 from post_likes p
    where p.slug = post_slug and p.session_id = sid
  ) then
    delete from post_likes p
    where p.slug = post_slug and p.session_id = sid;
  else
    insert into post_likes (slug, session_id) values (post_slug, sid);
  end if;

  return query
    select count(*)::bigint, (bool_or(p.session_id = sid) is true)
    from post_likes p
    where p.slug = post_slug;
end;
$$;

-- 댓글 (parent_id: 대댓글 — 1단계 중첩)
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  author text not null,
  body text not null,
  created_at timestamptz not null default now()
);
alter table comments
  add column if not exists parent_id uuid references comments(id) on delete cascade;

create index if not exists comments_slug_idx on comments (slug, created_at);
alter table comments enable row level security;

drop policy if exists "anyone can read comments" on comments;
create policy "anyone can read comments" on comments for select using (true);

drop policy if exists "anyone can write comments" on comments;
create policy "anyone can write comments" on comments for insert
  with check (
    char_length(author) between 1 and 40
    and char_length(body) between 1 and 1000
  );

-- 문장 하이라이트: 독자가 공유한 문장을 모아 인기 문장을 집계
create table if not exists highlights (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  text text not null,
  created_at timestamptz not null default now()
);
create index if not exists highlights_slug_idx on highlights (slug);
alter table highlights enable row level security;

drop policy if exists "anyone can read highlights" on highlights;
create policy "anyone can read highlights" on highlights for select using (true);

drop policy if exists "anyone can write highlights" on highlights;
create policy "anyone can write highlights" on highlights for insert
  with check (char_length(text) between 8 and 300);

-- 이력서 열람: 회사별 링크(/resume/<회사>)가 언제 · 얼마나 · 어디까지 읽혔는지.
-- 사람을 되짚을 수 있는 값은 넣지 않는다 — IP도 UA도 저장하지 않고,
-- session_id 는 브라우저가 스스로 만든 난수다.
create table if not exists resume_views (
  id uuid primary key default gen_random_uuid(),
  company text,
  locale text not null,
  session_id uuid not null,
  referrer text,
  seconds integer not null default 0,
  deepest_section text,
  created_at timestamptz not null default now()
);
create index if not exists resume_views_company_idx
  on resume_views (company, created_at desc);
alter table resume_views enable row level security;

-- 방문 하나에 줄 하나. 머문 시간은 읽는 도중에 여러 번 갱신되므로
-- 같은 방문이면 덮어써야 한다 — 그 짝을 맞추는 열쇠가 visit_id 다.
alter table resume_views
  add column if not exists visit_id uuid not null default gen_random_uuid();
create unique index if not exists resume_views_visit_idx on resume_views (visit_id);

-- 쓰기만 연다. 읽기 정책이 없으므로 공개 키로는 아무도 조회하지 못한다.
-- 통계는 서비스 롤 키를 쓰는 서버(/resume/stats)에서만 읽는다.
drop policy if exists "anyone can record a resume view" on resume_views;
create policy "anyone can record a resume view" on resume_views for insert
  with check (
    seconds between 0 and 86400
    and (company is null or char_length(company) between 1 and 60)
    and char_length(locale) between 2 and 8
    and (referrer is null or char_length(referrer) <= 500)
    and (deepest_section is null or char_length(deepest_section) <= 80)
  );

-- 갱신은 이 함수로만 한다. 테이블에 update 정책을 열면 visit_id 를 아는
-- 누구나 남의 줄을 고칠 수 있어서, 정의자 권한으로 감싸고 값은 여기서 검증한다.
-- 시간은 큰 쪽을 남긴다 — 늦게 온 요청이 이전 값을 깎지 못하게.
create or replace function record_resume_view(
  visit uuid,
  sid uuid,
  view_company text,
  view_locale text,
  view_referrer text,
  view_seconds integer,
  view_deepest text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if view_seconds is null or view_seconds < 0 or view_seconds > 86400 then
    return;
  end if;
  if view_locale is null or char_length(view_locale) not between 2 and 8 then
    return;
  end if;

  insert into resume_views as v (
    visit_id, session_id, company, locale, referrer, seconds, deepest_section
  )
  values (
    visit, sid, left(view_company, 60), view_locale,
    left(view_referrer, 500), view_seconds, left(view_deepest, 80)
  )
  on conflict (visit_id) do update
    set seconds = greatest(v.seconds, excluded.seconds),
        deepest_section = coalesce(excluded.deepest_section, v.deepest_section);
end;
$$;

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

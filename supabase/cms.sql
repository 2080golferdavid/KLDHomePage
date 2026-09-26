-- 한국장타협회 MVP 콘텐츠 저장소
--
-- Supabase SQL Editor 에서 이 파일 전체를 한 번 실행합니다.
-- 다시 실행해도 테이블이 있으면 그냥 넘어갑니다.
--
-- 글 읽기/쓰기는 Next.js 서버가 SUPABASE_SERVICE_ROLE_KEY 로 합니다.
-- 이 키는 브라우저에 넣으면 안 됩니다. NEXT_PUBLIC_ 을 붙이지 마세요.
-- 방문자용 anon 키로는 이 표를 읽거나 쓰지 못합니다.

create table if not exists public.cms_collections (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

comment on table public.cms_collections is
  'MVP 콘텐츠. key 는 settings, about, officials, news, contact, legal, inquiries, players, events';

alter table public.cms_collections enable row level security;

-- 공개 정책은 만들지 않습니다.
-- 서비스 롤 키만 RLS 를 우회해 읽고 씁니다.

create or replace function public.cms_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cms_collections_updated_at on public.cms_collections;
create trigger cms_collections_updated_at
before update on public.cms_collections
for each row execute function public.cms_set_updated_at();

-- key 와 나중에 나눌 Payload 컬렉션
--   settings   -> Global SiteSettings (로고, 파비콘, 히어로, 슬로건, SNS)
--   about      -> Global About
--   officials  -> Collection Officials
--   news       -> Collection News
--   contact    -> Global Contact
--   legal      -> privacy / terms
--   inquiries  -> Collection Inquiries
--   players    -> 2단계 Collection Players. 지금은 빈 배열.
--   events     -> 2단계 Collection Events. 참가 신청은 아직 없음.

-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  KLD (Korea Long Drive) — Supabase DB 스키마(Schema) v1          ║
-- ║                                                                    ║
-- ║  실행 방법:                                                         ║
-- ║   1) Supabase 대시보드 → SQL Editor 를 연다.                        ║
-- ║   2) 이 파일 전체를 복사해 붙여넣고 "Run" 을 누른다.                 ║
-- ║   3) 한 번만 실행해야 한다. 재실행 시 이미 존재한다는 오류가 난다. ║
-- ║      (테이블을 초기화하고 싶다면 맨 아래 "초기화" 블록 참고)        ║
-- ║                                                                    ║
-- ║  포함 내용:                                                         ║
-- ║   - 확장(Extension) 활성화                                          ║
-- ║   - 열거형(ENUM) 타입 정의                                          ║
-- ║   - 6개 테이블 + 외래키 + 인덱스                                    ║
-- ║   - updated_at 자동 갱신 트리거                                     ║
-- ║   - 회원가입 시 public.users 자동 생성 트리거                       ║
-- ║   - Row Level Security(RLS) 정책                                    ║
-- ║   - 결제 코드 사용 RPC 함수(use_payment_code)                       ║
-- ╚══════════════════════════════════════════════════════════════════╝


-- ════════════════════════════════════════
-- 0. 확장(Extension)
-- ════════════════════════════════════════
-- UUID 자동 생성을 위한 pgcrypto 확장 활성화.
-- Supabase 프로젝트에는 대부분 기본 활성화되어 있지만 안전하게 명시한다.
create extension if not exists pgcrypto;


-- ════════════════════════════════════════
-- 1. 열거형(ENUM) 타입
-- ════════════════════════════════════════
-- 회원 등급(member_type): 일반 / 정회원
create type public.member_type as enum ('general', 'full');

-- 회원 상태(status): 가입 대기 / 활성
create type public.user_status as enum ('pending', 'active');

-- 대회 디비전(Division): 한국어 그대로 사용해 프론트엔드와 값이 일치되도록 한다.
create type public.division as enum ('아마추어', '마스터즈', '우먼스', '오픈');

-- 참가 신청 상태(registration_status)
create type public.registration_status as enum (
  'pending',      -- 신청 완료, 승인 대기
  'confirmed',    -- 승인(참가 확정)
  'cancelled',    -- 취소
  'waitlist'      -- 정원 초과로 대기
);


-- ════════════════════════════════════════
-- 2. 헬퍼(Helper) 함수
-- ════════════════════════════════════════

-- 현재 요청자가 관리자인지 판별한다.
-- Supabase에서는 관리자 플래그를 auth.users 의 app_metadata.role 에 저장한다.
-- (대시보드 → Authentication → 사용자 편집 → app_metadata 에 { "role": "admin" } 입력)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- 테이블 수정 시 updated_at 컬럼을 자동으로 현재 시각으로 갱신한다.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ════════════════════════════════════════
-- 3. 테이블(Tables)
-- ════════════════════════════════════════

-- ── 3-1. users ──────────────────────────
-- Supabase의 auth.users 와 1:1 로 연결되는 프로필 확장 테이블.
-- 회원가입 시 아래(섹션 5)의 트리거가 자동으로 이 행을 만든다.
create table public.users (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null unique,
  name         text not null,
  member_type  public.member_type not null default 'general',
  status       public.user_status not null default 'pending',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.users is 'auth.users 를 확장한 회원 프로필';


-- ── 3-2. players ────────────────────────
-- 대회에 출전하는 "선수" 정보. users 와 1:1.
create table public.players (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null unique references public.users(id) on delete cascade,
  photo_url   text,
  bio         text,
  /* equipment 는 { category, brand, model, note }[] 형식의 JSON 배열을 저장한다.
     유연한 스키마를 위해 JSONB 를 사용하며, 프런트엔드의 PlayerEquipment 타입과 일치한다. */
  equipment   jsonb not null default '[]'::jsonb,
  region      text,
  division    public.division not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  /* equipment 는 배열이어야 한다(객체 하나만 들어오는 실수 방지). */
  constraint players_equipment_is_array check (jsonb_typeof(equipment) = 'array')
);

comment on table public.players is '선수 프로필 — users 1:1';


-- ── 3-3. competitions ───────────────────
-- 대회 일정과 기본 정보.
create table public.competitions (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  date        timestamptz not null,
  location    text not null,
  /* 해당 대회에 개최되는 디비전 목록. 여러 디비전을 동시에 여는 경우가 많으므로 배열로 저장한다. */
  divisions   public.division[] not null default array[]::public.division[],
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.competitions is '대회 일정/기본 정보';


-- ── 3-4. competition_results ────────────
-- 대회별 · 디비전별 · 선수별 성적. 한 선수가 한 대회에서 같은 디비전으로
-- 두 번 기록을 가지지 않도록 고유 제약을 건다.
create table public.competition_results (
  id              uuid primary key default gen_random_uuid(),
  competition_id  uuid not null references public.competitions(id) on delete cascade,
  player_id       uuid not null references public.players(id) on delete cascade,
  division        public.division not null,
  distance        integer not null check (distance >= 0),  -- 단위: 미터(m)
  rank            integer not null check (rank >= 1),
  points          integer not null default 0 check (points >= 0),
  created_at      timestamptz not null default now(),
  unique (competition_id, player_id, division)
);

comment on table public.competition_results is '대회 성적(비거리/순위/포인트)';


-- ── 3-5. registrations ──────────────────
-- 대회 참가 신청. 한 사용자가 같은 대회의 같은 디비전에 중복 신청하지 못하도록 한다.
create table public.registrations (
  id              uuid primary key default gen_random_uuid(),
  competition_id  uuid not null references public.competitions(id) on delete cascade,
  user_id         uuid not null references public.users(id) on delete cascade,
  division        public.division not null,
  status          public.registration_status not null default 'pending',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (competition_id, user_id, division)
);

comment on table public.registrations is '대회 참가 신청';


-- ── 3-6. payment_codes ──────────────────
-- 관리자가 미리 발급한 결제 인증 코드. 1회성 토큰 역할.
-- 사용자가 use_payment_code() RPC 로 코드를 사용하면 해당 사용자의
-- member_type 이 'full' 로 승격된다.
create table public.payment_codes (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  used_by     uuid references public.users(id) on delete set null,
  used_at     timestamptz,
  created_at  timestamptz not null default now(),
  /* 사용 처리는 used_by 와 used_at 이 함께 채워지거나, 둘 다 NULL 이어야 한다. */
  constraint payment_codes_used_consistency check (
    (used_by is null and used_at is null)
    or (used_by is not null and used_at is not null)
  )
);

comment on table public.payment_codes is '정회원 전환 결제 코드(1회 사용)';


-- ════════════════════════════════════════
-- 4. 인덱스(Indexes)
-- ════════════════════════════════════════
-- 조회 패턴에 맞춰 보조 인덱스를 만든다. UNIQUE/PK 에 이미 있는 것은 생략.
create index idx_players_division          on public.players (division);
create index idx_players_region            on public.players (region);
create index idx_results_competition_id    on public.competition_results (competition_id);
create index idx_results_player_id         on public.competition_results (player_id);
create index idx_registrations_competition on public.registrations (competition_id);
create index idx_registrations_user        on public.registrations (user_id);
create index idx_competitions_date         on public.competitions (date desc);


-- ════════════════════════════════════════
-- 5. 트리거(Triggers)
-- ════════════════════════════════════════

-- updated_at 자동 갱신 트리거 — 여러 테이블에 동일 로직 적용.
create trigger users_set_updated_at
before update on public.users
for each row execute function public.set_updated_at();

create trigger players_set_updated_at
before update on public.players
for each row execute function public.set_updated_at();

create trigger competitions_set_updated_at
before update on public.competitions
for each row execute function public.set_updated_at();

create trigger registrations_set_updated_at
before update on public.registrations
for each row execute function public.set_updated_at();


-- auth.users 에 신규 가입자가 생기면 public.users 에 자동으로 프로필 행을 만든다.
-- name 은 회원가입 시 전달한 raw_user_meta_data.name 을 우선 사용하고,
-- 없으면 이메일의 로컬 파트(@ 앞부분)를 기본값으로 채운다.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();


-- ════════════════════════════════════════
-- 6. Row Level Security (RLS)
-- ════════════════════════════════════════
-- RLS 를 enable 하면 "정책(policy)이 허용하지 않는 한" 기본적으로
-- 모든 접근이 차단된다. 아래에서 테이블별로 필요한 접근만 허용한다.

alter table public.users                enable row level security;
alter table public.players              enable row level security;
alter table public.competitions         enable row level security;
alter table public.competition_results  enable row level security;
alter table public.registrations        enable row level security;
alter table public.payment_codes        enable row level security;


-- ── 6-1. users ──────────────────────────
-- 이메일 등 개인정보 보호를 위해 "본인 + 관리자" 만 조회 가능.
create policy users_select_self_or_admin
  on public.users for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

-- 본인만 본인 프로필을 수정 가능. 관리자는 전체 수정 가능.
-- member_type / status 같은 권한 필드는 실제로는 트리거나 함수에서만
-- 바꾸도록 제한하는 것이 안전하다(아래 "권장 강화" 주석 참고).
create policy users_update_self_or_admin
  on public.users for update
  to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- 삭제는 관리자만.
create policy users_delete_admin
  on public.users for delete
  to authenticated
  using (public.is_admin());

-- INSERT 는 트리거(handle_new_auth_user)로만 만들어지도록 두고,
-- 정책을 열어두지 않는다(직접 insert 시도는 차단).


-- ── 6-2. players ────────────────────────
-- 선수 프로필은 공개 정보로 취급한다. 비로그인 방문자도 조회 가능.
create policy players_select_public
  on public.players for select
  to anon, authenticated
  using (true);

-- 프로필 생성은 본인 계정(user_id = auth.uid())에 한해 가능. 관리자는 예외 허용.
create policy players_insert_self
  on public.players for insert
  to authenticated
  with check (user_id = auth.uid() or public.is_admin());

-- 수정은 본인 또는 관리자.
create policy players_update_self_or_admin
  on public.players for update
  to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- 삭제는 관리자만(실수 방지).
create policy players_delete_admin
  on public.players for delete
  to authenticated
  using (public.is_admin());


-- ── 6-3. competitions ───────────────────
-- 대회 일정은 홍보를 위해 비로그인도 조회 가능.
create policy competitions_select_public
  on public.competitions for select
  to anon, authenticated
  using (true);

-- 등록/수정/삭제는 관리자만.
create policy competitions_insert_admin
  on public.competitions for insert
  to authenticated
  with check (public.is_admin());

create policy competitions_update_admin
  on public.competitions for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy competitions_delete_admin
  on public.competitions for delete
  to authenticated
  using (public.is_admin());


-- ── 6-4. competition_results ────────────
-- 성적도 공개 정보로 조회 가능. 기록/수정/삭제는 관리자만.
create policy results_select_public
  on public.competition_results for select
  to anon, authenticated
  using (true);

create policy results_insert_admin
  on public.competition_results for insert
  to authenticated
  with check (public.is_admin());

create policy results_update_admin
  on public.competition_results for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy results_delete_admin
  on public.competition_results for delete
  to authenticated
  using (public.is_admin());


-- ── 6-5. registrations ──────────────────
-- 본인의 신청 내역만 조회 가능. 관리자는 전체 조회 가능.
create policy registrations_select_self_or_admin
  on public.registrations for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- 신청은 본인만 가능. 정회원(full) 또는 관리자로 제한하려면 아래
-- 조건을 "and public.current_member_type() = 'full'" 식으로 강화한다.
create policy registrations_insert_self
  on public.registrations for insert
  to authenticated
  with check (user_id = auth.uid());

-- 본인은 자기 신청만 수정할 수 있다(취소 등). 관리자는 상태 승인 권한이 있다.
create policy registrations_update_self_or_admin
  on public.registrations for update
  to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- 삭제는 관리자만(사용자는 취소 = status 변경 권장).
create policy registrations_delete_admin
  on public.registrations for delete
  to authenticated
  using (public.is_admin());


-- ── 6-6. payment_codes ──────────────────
-- 보안상 결제 코드는 "직접 select/update 금지". 관리자만 조회 가능.
-- 일반 사용자는 아래의 use_payment_code() RPC 로만 코드를 사용할 수 있다.
create policy payment_codes_admin_only_select
  on public.payment_codes for select
  to authenticated
  using (public.is_admin());

create policy payment_codes_admin_only_insert
  on public.payment_codes for insert
  to authenticated
  with check (public.is_admin());

create policy payment_codes_admin_only_update
  on public.payment_codes for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy payment_codes_admin_only_delete
  on public.payment_codes for delete
  to authenticated
  using (public.is_admin());


-- ════════════════════════════════════════
-- 7. RPC 함수 — 결제 코드 사용 플로우
-- ════════════════════════════════════════
-- 사용자가 프런트엔드에서 `supabase.rpc('use_payment_code', { p_code })` 로 호출한다.
-- SECURITY DEFINER 로 실행되므로 RLS 를 우회해 payment_codes 를 안전하게 업데이트한다.
-- 성공 시 true, 유효하지 않거나 이미 사용된 코드면 false 를 반환한다.
create or replace function public.use_payment_code(p_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_matched integer;
begin
  -- 비로그인 호출 차단
  if v_user_id is null then
    raise exception '로그인이 필요합니다';
  end if;

  -- 해당 코드가 "아직 사용되지 않았을 때만" 본인 id 로 점유한다.
  -- 동시성(race condition)도 단일 UPDATE 로 원자적으로 처리된다.
  update public.payment_codes
     set used_by = v_user_id,
         used_at = now()
   where code = p_code
     and used_by is null;

  get diagnostics v_matched = row_count;

  if v_matched = 0 then
    return false;  -- 잘못된 코드거나 이미 사용됨
  end if;

  -- 유효한 코드라면 사용자를 "정회원(full) · 활성(active)" 으로 승격한다.
  update public.users
     set member_type = 'full',
         status      = 'active'
   where id = v_user_id;

  return true;
end;
$$;

-- 로그인한 사용자만 호출 가능.
revoke all on function public.use_payment_code(text) from public;
grant execute on function public.use_payment_code(text) to authenticated;


-- ════════════════════════════════════════
-- 8. 권장 강화(선택) — 운영 시 적용 고려
-- ════════════════════════════════════════
-- 1) 사용자가 직접 UPDATE 로 member_type='full' 로 올리지 못하도록
--    users_update_self_or_admin 정책의 with check 에
--      and (member_type = (select member_type from public.users where id = auth.uid()))
--    같은 조건을 추가하거나, 컬럼 단위 정책을 사용한다.
--    (Supabase 는 컬럼 레벨 정책을 지원하지 않으므로 보통 트리거로 제한한다.)
-- 2) registrations_insert_self 에 member_type='full' 조건 추가해 정회원만 신청 가능하게.
-- 3) 사진 업로드는 Supabase Storage 버킷 'player-photos' 를 public 으로 만들고,
--    players.photo_url 에 퍼블릭 URL 을 저장한다.


-- ════════════════════════════════════════
-- 9. 초기화(주의) — 개발 중에만 사용
-- ════════════════════════════════════════
-- 스키마를 통째로 지우고 다시 만들고 싶을 때 아래 블록을 먼저 실행하면 된다.
-- 운영 데이터베이스에서는 절대 실행하지 말 것.
--
-- drop function if exists public.use_payment_code(text);
-- drop function if exists public.handle_new_auth_user();
-- drop function if exists public.set_updated_at();
-- drop function if exists public.is_admin();
-- drop trigger if exists on_auth_user_created on auth.users;
-- drop table if exists public.payment_codes         cascade;
-- drop table if exists public.registrations         cascade;
-- drop table if exists public.competition_results   cascade;
-- drop table if exists public.competitions          cascade;
-- drop table if exists public.players               cascade;
-- drop table if exists public.users                 cascade;
-- drop type  if exists public.registration_status;
-- drop type  if exists public.division;
-- drop type  if exists public.user_status;
-- drop type  if exists public.member_type;

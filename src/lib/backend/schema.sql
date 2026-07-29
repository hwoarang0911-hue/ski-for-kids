-- 키즈스키 Supabase 스키마 (Phase 1 백엔드)
-- 사용법: Supabase 프로젝트 생성 → SQL Editor에 붙여넣고 실행 →
--   프로젝트 URL·anon key를 .env 에 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 로 설정.
-- 그러면 앱이 자동으로 localStorage 대신 이 DB를 사용한다(backend/index.ts).

-- ── 예약 ──────────────────────────────────────────────
create table if not exists public.bookings (
  id              text primary key,
  instructor_id   text not null,
  instructor_name text not null,
  instructor_hue  text,
  resort_id       text,
  product_id      text,
  product_title   text,
  date            date,
  time            text,
  member_names    text[] default '{}',
  price_total     integer default 0,
  status          text default 'requested',
  reviewed        boolean default false,
  pay_status      text default 'none',   -- none | paid | refunded (Phase 2)
  pay_id          text,
  created_at      timestamptz default now()
);

-- ── 후기 ──────────────────────────────────────────────
create table if not exists public.reviews (
  id            text primary key,
  instructor_id text not null,
  author        text,
  rating        integer,
  text          text,
  created_at    timestamptz default now()
);

-- ── 강사 입점 신청(공급측) ────────────────────────────
create table if not exists public.applications (
  id               text primary key,
  name             text not null,
  phone            text,
  resort_id        text,
  cert             text,
  kids_specialist  boolean default false,
  disciplines      text[] default '{}',
  formats          text[] default '{}',
  experience_years integer default 0,
  intro            text,
  cert_file_name   text,
  status           text default 'review', -- review | approved | rejected
  created_at       timestamptz default now()
);

-- ── RLS (행 수준 보안) ────────────────────────────────
-- MVP: anon 키로 읽기/쓰기 허용. 상용 전 반드시 인증 기반 정책으로 강화할 것
-- (예: 예약은 본인 것만 select/update, 후기는 예약 완료자만 insert).
alter table public.bookings     enable row level security;
alter table public.reviews      enable row level security;
alter table public.applications enable row level security;

create policy "mvp bookings all"     on public.bookings     for all using (true) with check (true);
create policy "mvp reviews all"      on public.reviews      for all using (true) with check (true);
create policy "mvp applications all" on public.applications for all using (true) with check (true);

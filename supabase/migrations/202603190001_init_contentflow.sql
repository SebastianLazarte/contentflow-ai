create extension if not exists pgcrypto;

create table if not exists public.prd (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.content_version (
  id uuid primary key default gen_random_uuid(),
  prd_id uuid not null references public.prd(id) on delete cascade,
  stage text not null check (stage in ('research', 'draft', 'fact_checked')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists prd_created_at_idx
  on public.prd (created_at desc);

create index if not exists content_version_prd_created_at_idx
  on public.content_version (prd_id, created_at desc);

create index if not exists content_version_prd_stage_created_at_idx
  on public.content_version (prd_id, stage, created_at desc);

alter table public.prd enable row level security;
alter table public.content_version enable row level security;

drop policy if exists "public can read prd" on public.prd;
create policy "public can read prd"
  on public.prd
  for select
  to anon, authenticated
  using (true);

drop policy if exists "public can insert prd" on public.prd;
create policy "public can insert prd"
  on public.prd
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "public can read content versions" on public.content_version;
create policy "public can read content versions"
  on public.content_version
  for select
  to anon, authenticated
  using (true);

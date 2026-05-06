create table if not exists public.bank_recent (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  course_id   text        not null,
  bank_id     text        not null,
  visited_at  timestamptz not null default now(),

  unique (user_id, course_id, bank_id)
);

alter table public.bank_recent enable row level security;

create policy "recent_select" on public.bank_recent
  for select using (auth.uid() = user_id);

create policy "recent_insert" on public.bank_recent
  for insert with check (auth.uid() = user_id);

create policy "recent_update" on public.bank_recent
  for update using (auth.uid() = user_id);

create index bank_recent_user_time_idx
  on public.bank_recent (user_id, visited_at desc);
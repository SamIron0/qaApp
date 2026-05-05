create table if not exists public.bank_ratings (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  course_id   text        not null,
  bank_id     text        not null,
  rating      smallint    not null check (rating between 1 and 5),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  unique (user_id, course_id, bank_id)
);

alter table public.bank_ratings enable row level security;

create policy "ratings_select" on public.bank_ratings
  for select using (true);

create policy "ratings_insert" on public.bank_ratings
  for insert with check (auth.uid() = user_id);

create policy "ratings_update" on public.bank_ratings
  for update using (auth.uid() = user_id);

create policy "ratings_delete" on public.bank_ratings
  for delete using (auth.uid() = user_id);

create index bank_ratings_bank_idx
  on public.bank_ratings (course_id, bank_id);

create index bank_ratings_user_idx
  on public.bank_ratings (user_id);
create table if not exists public.bank_bookmarks (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  course_id   text        not null,
  bank_id     text        not null,
  created_at  timestamptz not null default now(),

  unique (user_id, course_id, bank_id)
);

alter table public.bank_bookmarks enable row level security;

create policy "bookmarks_select" on public.bank_bookmarks
  for select using (auth.uid() = user_id);

create policy "bookmarks_insert" on public.bank_bookmarks
  for insert with check (auth.uid() = user_id);

create policy "bookmarks_delete" on public.bank_bookmarks
  for delete using (auth.uid() = user_id);

create index bank_bookmarks_user_idx
  on public.bank_bookmarks (user_id);

create index bank_bookmarks_bank_idx
  on public.bank_bookmarks (course_id, bank_id);
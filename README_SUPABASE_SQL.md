Copiez ce SQL dans Supabase (SQL Editor) pour créer profils + page_views et RLS.

```
-- 2.1) Profils
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  last_seen_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end; $$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- 2.2) Bump last_seen
create or replace function public.bump_last_seen()
returns trigger as $$
begin
  update public.profiles set last_seen_at = now() where id = new.id;
  return new;
end; $$ language plpgsql;

drop trigger if exists trg_auth_users_bump_last_seen on auth.users;
create trigger trg_auth_users_bump_last_seen
after update on auth.users
for each row execute function public.bump_last_seen();

-- 2.3) Pages vues
create table if not exists public.page_views (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  path text not null,
  ts timestamptz default now(),
  user_agent text,
  referrer text
);

alter table public.profiles enable row level security;
alter table public.page_views enable row level security;

create policy "read own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "update own profile" on public.profiles for update to authenticated using (id = auth.uid());
create policy "insert own profile" on public.profiles for insert to authenticated with check (id = auth.uid());

create policy "insert own views" on public.page_views for insert to authenticated with check (user_id = auth.uid());
create policy "read own views" on public.page_views for select to authenticated using (user_id = auth.uid());
```


create extension if not exists pgcrypto;
create extension if not exists citext;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) between 2 and 80),
  campus_email citext not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 3 and 120),
  description text not null check (char_length(trim(description)) between 10 and 1000),
  location text not null check (char_length(trim(location)) between 2 and 120),
  reported_date date not null check (reported_date <= current_date),
  type text not null check (type in ('lost', 'found')),
  image_url text not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_items_type on public.items(type);
create index if not exists idx_items_location on public.items(location);
create index if not exists idx_items_created_at_desc on public.items(created_at desc);
create index if not exists idx_items_user_id on public.items(user_id);
create index if not exists idx_items_user_active_created on public.items(user_id, is_active, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_items_updated_at on public.items;
create trigger set_items_updated_at
before update on public.items
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, campus_email)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    new.email
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    campus_email = excluded.campus_email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.items enable row level security;

drop policy if exists "profiles_select_own_record" on public.profiles;
create policy "profiles_select_own_record"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_insert_own_record" on public.profiles;
create policy "profiles_insert_own_record"
on public.profiles
for insert
to authenticated
with check (
  auth.uid() = id
  and campus_email = auth.jwt() ->> 'email'
);

drop policy if exists "profiles_update_own_record" on public.profiles;
create policy "profiles_update_own_record"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (
  auth.uid() = id
  and campus_email = auth.jwt() ->> 'email'
);

drop policy if exists "items_select_authenticated" on public.items;
create policy "items_select_authenticated"
on public.items
for select
to authenticated
using (
  is_active = true
  or auth.uid() = user_id
);

drop policy if exists "items_insert_own_record" on public.items;
create policy "items_insert_own_record"
on public.items
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.id = user_id
  )
);

drop policy if exists "items_update_owner_any_state" on public.items;
create policy "items_update_owner_any_state"
on public.items
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "items_delete_owner_active_only" on public.items;
create policy "items_delete_owner_active_only"
on public.items
for delete
to authenticated
using (
  auth.uid() = user_id
  and is_active = true
);

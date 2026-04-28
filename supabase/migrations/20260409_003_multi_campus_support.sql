-- Multi-Campus Support Migration
create table if not exists public.campuses (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) >= 3),
  domain text not null unique check (domain ~* '^[a-z0-9.-]+\.[a-z]{2,}$'),
  slug text not null unique check (slug ~* '^[a-z0-9-]+$'),
  created_at timestamptz not null default timezone('utc', now())
);

-- Add campus_id to profiles
alter table public.profiles 
add column if not exists campus_id uuid references public.campuses(id);

-- Add campus_id to items
alter table public.items 
add column if not exists campus_id uuid references public.campuses(id);

-- Create indexes for performance
create index if not exists idx_profiles_campus_id on public.profiles(campus_id);
create index if not exists idx_items_campus_id on public.items(campus_id);

-- Update handle_new_user to auto-link campus based on domain
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_domain text;
  found_campus_id uuid;
begin
  user_domain := split_part(new.email, '@', 2);
  
  select id into found_campus_id 
  from public.campuses 
  where domain = user_domain;

  insert into public.profiles (id, full_name, campus_email, campus_id)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    new.email,
    found_campus_id
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    campus_email = excluded.campus_email,
    campus_id = excluded.campus_id;

  return new;
end;
$$;

-- Update Item RLS to enforce campus scoping
-- Note: You may need to drop existing policies first
drop policy if exists "items_select_authenticated" on public.items;
create policy "items_select_authenticated_campus_scoped"
on public.items
for select
to authenticated
using (
  (is_active = true and campus_id = (select campus_id from public.profiles where id = auth.uid()))
  or auth.uid() = user_id
);

-- Policy to allow inserts with the correct campus_id
drop policy if exists "items_insert_own_record" on public.items;
create policy "items_insert_own_record_campus_scoped"
on public.items
for insert
to authenticated
with check (
  auth.uid() = user_id
  and campus_id = (select campus_id from public.profiles where id = auth.uid())
);

-- Enable RLS on campuses
alter table public.campuses enable row level security;

-- Anyone can see campus names/slugs
create policy "campuses_public_read"
on public.campuses for select
to authenticated, anon
using (true);

-- Anyone can register a campus (for now)
create policy "campuses_insert_public"
on public.campuses for insert
to anon, authenticated
with check (true);

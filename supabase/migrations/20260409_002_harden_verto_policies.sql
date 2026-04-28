create or replace function public.is_campus_email(email_input text)
returns boolean
language sql
immutable
as $$
  select email_input ~* '^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.(edu|ac\.[a-zA-Z]{2,}|college|university)$';
$$;

alter table public.profiles
  add constraint profiles_campus_email_format
  check (public.is_campus_email(campus_email::text));

create or replace function public.prevent_profile_email_change()
returns trigger
language plpgsql
as $$
begin
  if new.campus_email is distinct from old.campus_email then
    raise exception 'Campus email cannot be changed from the client.';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_profile_email_change_trigger on public.profiles;
create trigger prevent_profile_email_change_trigger
before update on public.profiles
for each row
execute function public.prevent_profile_email_change();

create or replace function public.normalize_item_fields()
returns trigger
language plpgsql
as $$
begin
  new.title = trim(new.title);
  new.description = trim(new.description);
  new.location = trim(new.location);
  return new;
end;
$$;

drop trigger if exists normalize_item_fields_trigger on public.items;
create trigger normalize_item_fields_trigger
before insert or update on public.items
for each row
execute function public.normalize_item_fields();

create or replace function public.normalize_profile_fields()
returns trigger
language plpgsql
as $$
begin
  new.full_name = trim(new.full_name);
  new.campus_email = lower(trim(new.campus_email))::citext;
  return new;
end;
$$;

drop trigger if exists normalize_profile_fields_trigger on public.profiles;
create trigger normalize_profile_fields_trigger
before insert or update on public.profiles
for each row
execute function public.normalize_profile_fields();

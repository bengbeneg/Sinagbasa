-- Run once in the Supabase SQL Editor for an existing SINAGBASA database.
-- It repairs missing profiles and lets authenticated users safely ensure their
-- own profile exists during login.

begin;

insert into public.profiles (id, display_name, role)
select
  users.id,
  coalesce(
    nullif(trim(users.raw_user_meta_data ->> 'display_name'), ''),
    split_part(users.email, '@', 1)
  ),
  'student'
from auth.users as users
on conflict (id) do nothing;

create or replace function public.ensure_own_profile()
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  profile public.profiles;
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required';
  end if;

  insert into public.profiles (id, display_name, role)
  values (
    (select auth.uid()),
    split_part(coalesce((select auth.jwt() ->> 'email'), ''), '@', 1),
    'student'
  )
  on conflict (id) do nothing;

  select * into profile
  from public.profiles
  where id = (select auth.uid());

  return profile;
end;
$$;

revoke all on function public.ensure_own_profile() from public;
grant execute on function public.ensure_own_profile() to authenticated;

commit;

-- Make the new RPC available immediately through the Supabase REST API.
notify pgrst, 'reload schema';

-- Run once in the Supabase SQL Editor. Only teachers may read account emails.
create or replace function public.class_student_emails()
returns table (id uuid, email text)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_teacher() then
    raise exception 'Teacher access required' using errcode = '42501';
  end if;
  return query
    select p.id, lower(trim(u.email))
    from public.profiles p
    join auth.users u on u.id = p.id
    where p.role = 'student';
end;
$$;

revoke all on function public.class_student_emails() from public, anon;
grant execute on function public.class_student_emails() to authenticated;

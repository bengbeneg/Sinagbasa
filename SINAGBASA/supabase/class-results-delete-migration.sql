-- Apply after assessment-logs-migration.sql in the Supabase SQL Editor.
create or replace function public.delete_class_results(p_attempt_ids uuid[])
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare deleted_count integer;
begin
  if not public.is_teacher() then
    raise exception 'Teacher access required' using errcode = '42501';
  end if;
  if coalesce(cardinality(p_attempt_ids), 0) = 0 then
    return 0;
  end if;
  delete from public.exam_attempts a
  where a.id = any(p_attempt_ids)
    and exists (select 1 from public.profiles p where p.id = a.user_id and p.role = 'student');
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.delete_class_results(uuid[]) from public, anon;
grant execute on function public.delete_class_results(uuid[]) to authenticated;

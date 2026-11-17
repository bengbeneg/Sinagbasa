-- Run once after assessment-logs-migration.sql was previously installed.
begin;
alter table public.activity_logs add column if not exists finished_at timestamptz;
alter table public.activity_logs alter column started_at drop not null;
alter table public.activity_logs drop constraint if exists activity_logs_event_type_check;
alter table public.activity_logs add constraint activity_logs_event_type_check check (event_type in ('login','logout','page_view'));

create or replace function public.record_activity(p_event text,p_page text,p_started_at timestamptz,p_duration integer)
returns void language plpgsql security definer set search_path = '' as $$
begin
  insert into public.activity_logs(user_id,event_type,page,started_at,finished_at,duration_seconds)
  values(
    auth.uid(),p_event,left(coalesce(p_page,'unknown'),160),case when p_event='logout' then null else coalesce(p_started_at,now()) end,
    case when p_event in ('page_view','logout') then now() else null end,
    greatest(0,coalesce(p_duration,0))
  );
end $$;
revoke all on function public.record_activity(text,text,timestamptz,integer) from public;
grant execute on function public.record_activity(text,text,timestamptz,integer) to authenticated;
commit;
notify pgrst, 'reload schema';

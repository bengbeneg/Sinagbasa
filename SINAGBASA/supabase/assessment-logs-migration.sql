-- One-time migration for assessments, class results, and activity logs.
begin;

create table if not exists public.exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exam_type text not null check (exam_type in ('pre','post')),
  language text not null check (language in ('en','fil')),
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  answers jsonb not null default '{}'::jsonb,
  score integer,
  total_items integer,
  submit_reason text check (submit_reason in ('completed','timeout','exit','navigation')),
  unique (user_id, exam_type)
);

create table if not exists public.activity_logs (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null check (event_type in ('login','logout','page_view')),
  page text not null,
  started_at timestamptz,
  finished_at timestamptz,
  duration_seconds integer not null default 0 check (duration_seconds >= 0)
);
create index if not exists activity_logs_started_idx on public.activity_logs(started_at desc);
create index if not exists activity_logs_user_idx on public.activity_logs(user_id, started_at desc);

alter table public.exam_attempts enable row level security;
alter table public.activity_logs enable row level security;
grant select on public.exam_attempts to authenticated;
grant select on public.activity_logs to authenticated;

create policy "Students read own attempts and teachers read all" on public.exam_attempts
for select to authenticated using (user_id = (select auth.uid()) or (select public.is_teacher()));
create policy "Users read own logs and teachers read all" on public.activity_logs
for select to authenticated using (user_id = (select auth.uid()) or (select public.is_teacher()));
create policy "Teachers read student profiles" on public.profiles
for select to authenticated using ((select public.is_teacher()));

create or replace function public.begin_exam(p_exam_type text, p_language text)
returns public.exam_attempts language plpgsql security definer set search_path = '' as $$
declare result public.exam_attempts;
begin
  if p_exam_type not in ('pre','post') or p_language not in ('en','fil') then raise exception 'Invalid exam'; end if;
  if p_exam_type = 'post' and not exists (select 1 from public.exam_attempts where user_id=auth.uid() and exam_type='pre' and submitted_at is not null) then raise exception 'Complete the pre-test first'; end if;
  insert into public.exam_attempts(user_id,exam_type,language) values(auth.uid(),p_exam_type,p_language)
  on conflict(user_id,exam_type) do nothing returning * into result;
  if result.id is null then select * into result from public.exam_attempts where user_id=auth.uid() and exam_type=p_exam_type; end if;
  return result;
end $$;

create or replace function public.submit_exam(p_exam_type text,p_answers jsonb,p_score integer,p_total integer,p_reason text)
returns public.exam_attempts language plpgsql security definer set search_path = '' as $$
declare result public.exam_attempts;
begin
  update public.exam_attempts set submitted_at=now(), duration_seconds=greatest(0,extract(epoch from now()-started_at)::integer), answers=coalesce(p_answers,'{}'::jsonb), score=p_score,total_items=p_total,submit_reason=p_reason
  where user_id=auth.uid() and exam_type=p_exam_type and submitted_at is null returning * into result;
  if result.id is null then raise exception 'Exam is already submitted or was not started'; end if;
  return result;
end $$;

create or replace function public.record_activity(p_event text,p_page text,p_started_at timestamptz,p_duration integer)
returns void language plpgsql security definer set search_path = '' as $$
begin
  insert into public.activity_logs(user_id,event_type,page,started_at,finished_at,duration_seconds)
  values(auth.uid(),p_event,left(coalesce(p_page,'unknown'),160),case when p_event='logout' then null else coalesce(p_started_at,now()) end,case when p_event in ('page_view','logout') then now() else null end,greatest(0,coalesce(p_duration,0)));
end $$;

revoke all on function public.begin_exam(text,text),public.submit_exam(text,jsonb,integer,integer,text),public.record_activity(text,text,timestamptz,integer) from public;
grant execute on function public.begin_exam(text,text),public.submit_exam(text,jsonb,integer,integer,text),public.record_activity(text,text,timestamptz,integer) to authenticated;
commit;
notify pgrst, 'reload schema';

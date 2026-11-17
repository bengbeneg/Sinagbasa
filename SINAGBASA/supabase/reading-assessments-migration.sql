-- Run after assessment-logs-migration.sql. Existing attempts are retained.
begin;
alter table public.exam_attempts drop constraint if exists exam_attempts_exam_type_check;
alter table public.exam_attempts add constraint exam_attempts_exam_type_check
  check (exam_type in ('pre','post','pre_reading','post_reading'));
alter table public.exam_attempts add column if not exists deadline_at timestamptz;
update public.exam_attempts set deadline_at=started_at+interval '60 minutes' where deadline_at is null;
alter table public.exam_attempts alter column deadline_at set not null;
alter table public.exam_attempts alter column deadline_at set default (now()+interval '60 minutes');

-- No browser grants: authoritative answer keys are read only by these RPCs.
create table if not exists public.assessment_keys (
  exam_type text primary key, language text not null, seconds integer not null,
  answer_key jsonb not null
);
alter table public.assessment_keys enable row level security;
revoke all on public.assessment_keys from public, anon, authenticated;
-- Seed assessment_keys privately using generate-assessment-migration.cjs.
-- No correct-answer arrays belong in this public repository.

create or replace function public.submit_exam(p_exam_type text,p_answers jsonb,p_score integer,p_total integer,p_reason text)
returns public.exam_attempts language plpgsql security definer set search_path='' as $$
declare result public.exam_attempts; keys jsonb; submitted_answers jsonb; points integer; total integer;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  select * into result from public.exam_attempts where user_id=auth.uid() and exam_type=p_exam_type for update;
  if result.id is null then raise exception 'Assessment has not been started'; end if;
  if result.submitted_at is not null then return result; end if;
  if p_reason is null or p_reason not in ('completed','timeout','exit','navigation') then raise exception 'Invalid submission reason'; end if;
  select answer_key into keys from public.assessment_keys where exam_type=p_exam_type;
  if keys is null then raise exception 'Assessment content unavailable'; end if;
  if p_answers is null or jsonb_typeof(p_answers)<>'object' then raise exception 'Invalid answers'; end if;
  -- After the deadline only the answers already saved to the server are graded.
  submitted_answers=case when now()>=result.deadline_at then result.answers else p_answers end;
  select count(*),
    count(*) filter(where value='-1'::jsonb or (value<>'null'::jsonb and submitted_answers->((ordinality-1)::text)=value))
    into total,points from jsonb_array_elements(keys) with ordinality;
  -- -1 awards one point to everyone, including unanswered invalid source items.
  -- Missing source keys never remove items or lower the maximum score.
  -- Preserve the submission and its full total; await an approved key to grade.
  if exists(select 1 from jsonb_array_elements(keys) where value='null'::jsonb) then points=null; end if;
  update public.exam_attempts set
    answers=submitted_answers,score=points,total_items=total,
    submitted_at=least(now(),deadline_at),
    duration_seconds=greatest(0,extract(epoch from least(now(),deadline_at)-started_at)::integer),
    submit_reason=case when now()>=deadline_at then 'timeout' else p_reason end
    where id=result.id returning * into result;
  return result;
end $$;

create or replace function public.expire_own_exams()
returns void language plpgsql security definer set search_path='' as $$
declare attempt record;
begin
  for attempt in select * from public.exam_attempts where user_id=auth.uid() and submitted_at is null and deadline_at<=now()
  loop
    perform public.submit_exam(attempt.exam_type,attempt.answers,0,0,'timeout');
  end loop;
end $$;

create or replace function public.begin_exam(p_exam_type text,p_language text)
returns public.exam_attempts language plpgsql security definer set search_path='' as $$
declare result public.exam_attempts; config public.assessment_keys; prerequisite text;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  select * into config from public.assessment_keys where exam_type=p_exam_type and language=p_language;
  if config.exam_type is null then raise exception 'Invalid assessment or language'; end if;
  perform public.expire_own_exams();
  prerequisite=case p_exam_type when 'post' then 'pre' when 'post_reading' then 'pre_reading' else null end;
  if prerequisite is not null and not exists(select 1 from public.exam_attempts where user_id=auth.uid() and exam_type=prerequisite and submitted_at is not null) then
    raise exception 'Complete the corresponding pre-assessment first';
  end if;
  insert into public.exam_attempts(user_id,exam_type,language,deadline_at)
    values(auth.uid(),p_exam_type,p_language,now()+make_interval(secs=>config.seconds))
    on conflict(user_id,exam_type) do nothing;
  select * into result from public.exam_attempts where user_id=auth.uid() and exam_type=p_exam_type;
  return result;
end $$;

create or replace function public.save_exam_answers(p_exam_type text,p_answers jsonb)
returns void language plpgsql security definer set search_path='' as $$
declare result public.exam_attempts;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if p_answers is null or jsonb_typeof(p_answers)<>'object' then raise exception 'Invalid answers'; end if;
  select * into result from public.exam_attempts where user_id=auth.uid() and exam_type=p_exam_type for update;
  if result.id is null then raise exception 'Assessment has not been started'; end if;
  if result.submitted_at is not null then return; end if;
  if now()>=result.deadline_at then
    perform public.submit_exam(p_exam_type,result.answers,0,0,'timeout'); return;
  end if;
  update public.exam_attempts set answers=p_answers where id=result.id;
end $$;

revoke all on function public.save_exam_answers(text,jsonb),public.expire_own_exams() from public;
grant execute on function public.save_exam_answers(text,jsonb),public.expire_own_exams() to authenticated;
revoke all on function public.begin_exam(text,text),public.submit_exam(text,jsonb,integer,integer,text) from public;
grant execute on function public.begin_exam(text,text),public.submit_exam(text,jsonb,integer,integer,text) to authenticated;
-- Repair legacy placeholder totals from the original browser submissions.
-- Preserve submitted answers and timestamps; valid scored attempts are untouched.
update public.exam_attempts a set
  total_items=jsonb_array_length(k.answer_key),
  score=(select count(*) from jsonb_array_elements(k.answer_key) with ordinality as key(value,ordinality)
    where key.value='-1'::jsonb or (key.value<>'null'::jsonb and a.answers->((key.ordinality-1)::text)=key.value))
from public.assessment_keys k
where a.exam_type=k.exam_type and a.submitted_at is not null and coalesce(a.total_items,0)=0;
commit;
notify pgrst, 'reload schema';

-- Run in a staging Supabase SQL Editor after all migrations.
-- Uses synthetic accounts and rolls back all fixtures. Any failure aborts.
begin;
insert into auth.users(id,email,raw_user_meta_data) values
 ('90000000-0000-4000-8000-000000000001','acl-student-a@example.invalid','{}'),
 ('90000000-0000-4000-8000-000000000002','acl-student-b@example.invalid','{}'),
 ('90000000-0000-4000-8000-000000000003','acl-teacher-a@example.invalid','{}'),
 ('90000000-0000-4000-8000-000000000004','acl-teacher-b@example.invalid','{}');
update public.profiles set role='teacher'
where id in ('90000000-0000-4000-8000-000000000003','90000000-0000-4000-8000-000000000004');
insert into public.exam_attempts(user_id,exam_type,language) values
 ('90000000-0000-4000-8000-000000000001','pre','en'),
 ('90000000-0000-4000-8000-000000000002','pre','en');
insert into public.content_items(author_id,kind,title_en,title_fil,body_en,body_fil,published) values
 ('90000000-0000-4000-8000-000000000003','material','ACL draft','ACL draft','Private','Private',false);

set local role authenticated;
select set_config('request.jwt.claims','{"sub":"90000000-0000-4000-8000-000000000001","role":"authenticated"}',true);
do $$
begin
  if exists(select 1 from public.exam_attempts where user_id='90000000-0000-4000-8000-000000000002') then
    raise exception 'BOLA: student can read another student attempt';
  end if;
  if not exists(select 1 from public.exam_attempts where user_id=auth.uid()) then
    raise exception 'Own attempt is not readable';
  end if;
  if exists(select 1 from public.content_items where title_en='ACL draft') then
    raise exception 'Student can read draft content';
  end if;
  begin
    perform public.save_exam_answers('pre','{"30":0}'::jsonb);
    raise exception 'Out-of-range answer accepted';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.save_exam_answers('pre','{"0":"1"}'::jsonb);
    raise exception 'String answer accepted';
  exception when invalid_parameter_value then null; end;
  begin
    update public.profiles set display_name=repeat('x',101) where id=auth.uid();
    raise exception 'Oversized display name accepted';
  exception when invalid_parameter_value then null; end;
  begin
    update public.profiles set role='teacher' where id=auth.uid();
    raise exception 'Student can change their role';
  exception when insufficient_privilege then null; end;
  begin
    perform public.class_student_emails();
    raise exception 'Student can read class email directory';
  exception when insufficient_privilege then null; end;
  begin
    perform public.delete_class_results(array[]::uuid[]);
    raise exception 'Student can call teacher delete function';
  exception when insufficient_privilege then null; end;
  begin
    update public.exam_attempts set score=30 where user_id=auth.uid();
    raise exception 'Student can directly forge scores';
  exception when insufficient_privilege then null; end;
end $$;

select set_config('request.jwt.claims','{"sub":"90000000-0000-4000-8000-000000000004","role":"authenticated"}',true);
do $$
declare affected integer;
begin
  update public.content_items set published=true where title_en='ACL draft';
  get diagnostics affected=row_count;
  if affected<>0 then raise exception 'Teacher can edit another author content'; end if;
  begin
    insert into public.content_items(author_id,kind,title_en,title_fil,body_en,body_fil,published,file_path)
    values(auth.uid(),'material','ACL stolen file','ACL','x','x',true,
      '90000000-0000-4000-8000-000000000003/private.pdf');
    raise exception 'Teacher can publish another author attachment path';
  exception when check_violation then null; end;
  if not exists(select 1 from public.class_student_emails() where id='90000000-0000-4000-8000-000000000001') then
    raise exception 'Teacher cannot access authorized class directory';
  end if;
  begin
    insert into public.content_items(author_id,kind,title_en,title_fil,body_en,body_fil,resource_url)
    values(auth.uid(),'material','Invalid link','Invalid','x','x','javascript:alert(1)');
    raise exception 'Unsafe resource URL accepted';
  exception when invalid_parameter_value then null; end;
  insert into public.content_items(author_id,kind,title_en,title_fil,body_en,body_fil)
  values(auth.uid(),'material','O''Brien; DROP TABLE profiles; --','Valid','Plain text','Plain text');
  if not exists(select 1 from public.profiles where id=auth.uid()) then
    raise exception 'SQL-like content was executed instead of stored as text';
  end if;
end $$;

set local role anon;
select set_config('request.jwt.claims','{"role":"anon"}',true);
do $$
begin
  begin
    perform public.class_student_emails();
    raise exception 'Anonymous caller can read class emails';
  exception when insufficient_privilege then null; end;
  begin
    perform public.delete_class_results(array[]::uuid[]);
    raise exception 'Anonymous caller can delete class results';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;

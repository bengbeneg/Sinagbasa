-- SINAGBASA authentication, progress, roles, and teacher content.
-- Run this once in the Supabase SQL Editor as the project owner.

begin;

create type public.app_role as enum ('student', 'teacher');
create type public.content_kind as enum ('lesson', 'material', 'story');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  role public.app_role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.student_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  kind public.content_kind not null,
  title_en text not null,
  title_fil text not null,
  body_en text not null,
  body_fil text not null,
  resource_url text,
  file_path text,
  file_name text,
  file_type text,
  file_size bigint check (file_size is null or (file_size > 0 and file_size <= 10485760)),
  game_config jsonb,
  constraint content_attachment_owner_check check (file_path is null or split_part(file_path, '/', 1) = author_id::text),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index content_items_kind_published_idx
  on public.content_items(kind, published, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger progress_set_updated_at
before update on public.student_progress
for each row execute function public.set_updated_at();

create trigger content_set_updated_at
before update on public.content_items
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1)),
    'student'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Repair accounts created before the profile trigger existed. This function is
-- intentionally limited to the signed-in user's own id and always assigns the
-- student role, so it cannot be used for privilege escalation.
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

create or replace function public.is_teacher()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'teacher'
  );
$$;

revoke all on function public.is_teacher() from public;
grant execute on function public.is_teacher() to authenticated;

alter table public.profiles enable row level security;
alter table public.student_progress enable row level security;
alter table public.content_items enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.student_progress from anon, authenticated;
revoke all on table public.content_items from anon, authenticated;

grant select on table public.profiles to authenticated;
grant update(display_name) on table public.profiles to authenticated;
grant select, insert, update, delete on table public.student_progress to authenticated;
grant select, insert, update, delete on table public.content_items to authenticated;

create policy "Users read their own profile"
on public.profiles for select to authenticated
using ((select auth.uid()) = id);

create policy "Users update their own display name"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Users read their own progress"
on public.student_progress for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users create their own progress"
on public.student_progress for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users update their own progress"
on public.student_progress for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users delete their own progress"
on public.student_progress for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "Students read published content and teachers read all"
on public.content_items for select to authenticated
using (published or (select public.is_teacher()));

create policy "Teachers create content"
on public.content_items for insert to authenticated
with check ((select public.is_teacher()) and author_id = (select auth.uid()));

create policy "Teachers update their own content"
on public.content_items for update to authenticated
using ((select public.is_teacher()) and author_id = (select auth.uid()))
with check ((select public.is_teacher()) and author_id = (select auth.uid()));

create policy "Teachers delete their own content"
on public.content_items for delete to authenticated
using ((select public.is_teacher()) and author_id = (select auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'teacher-materials',
  'teacher-materials',
  false,
  10485760,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Published content attachments are readable"
on storage.objects for select to authenticated
using (
  bucket_id = 'teacher-materials'
  and exists (
    select 1 from public.content_items
    where content_items.file_path = storage.objects.name
      and ((content_items.published and split_part(storage.objects.name, '/', 1) = content_items.author_id::text) or (select public.is_teacher()))
  )
);

create policy "Teachers upload their own attachments"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'teacher-materials'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (select public.is_teacher())
);

create policy "Teachers delete their own attachments"
on storage.objects for delete to authenticated
using (
  bucket_id = 'teacher-materials'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (select public.is_teacher())
);

-- Promote a verified account after replacing the email address:
-- update public.profiles
-- set role = 'teacher'
-- where id = (select id from auth.users where email = 'teacher@example.com');

commit;

-- Make newly created functions available immediately through PostgREST.
notify pgrst, 'reload schema';


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

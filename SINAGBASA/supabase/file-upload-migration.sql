-- Run once in the Supabase SQL Editor for an existing SINAGBASA database.

begin;

alter table public.content_items
  add column if not exists file_path text,
  add column if not exists file_name text,
  add column if not exists file_type text,
  add column if not exists file_size bigint;

alter table public.content_items
  drop constraint if exists content_items_file_size_check;

alter table public.content_items
  add constraint content_items_file_size_check
  check (file_size is null or (file_size > 0 and file_size <= 10485760));

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

drop policy if exists "Published content attachments are readable" on storage.objects;
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

drop policy if exists "Teachers upload their own attachments" on storage.objects;
create policy "Teachers upload their own attachments"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'teacher-materials'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (select public.is_teacher())
);

drop policy if exists "Teachers delete their own attachments" on storage.objects;
create policy "Teachers delete their own attachments"
on storage.objects for delete to authenticated
using (
  bucket_id = 'teacher-materials'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (select public.is_teacher())
);

commit;

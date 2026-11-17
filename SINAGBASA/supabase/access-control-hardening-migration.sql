-- Apply after schema.sql and the attachment migration. No records are deleted.
begin;

-- Prevent publishing another author's private attachment by copying its path.
alter table public.content_items
  drop constraint if exists content_attachment_owner_check;
alter table public.content_items
  add constraint content_attachment_owner_check
  check (file_path is null or split_part(file_path, '/', 1) = author_id::text)
  not valid;

-- Also block any pre-existing invalid references from granting student access.
drop policy if exists "Published content attachments are readable" on storage.objects;
create policy "Published content attachments are readable"
on storage.objects for select to authenticated
using (
  bucket_id = 'teacher-materials'
  and exists (
    select 1 from public.content_items
    where content_items.file_path = storage.objects.name
      and (
        (content_items.published and split_part(storage.objects.name, '/', 1) = content_items.author_id::text)
        or (select public.is_teacher())
      )
  )
);

commit;
notify pgrst, 'reload schema';

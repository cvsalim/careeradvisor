-- Storage buckets used by the app: client photos/avatars and client documents.

insert into storage.buckets (id, name, public)
values ('client-avatars', 'client-avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('client-documents', 'client-documents', false)
on conflict (id) do nothing;

create policy "authenticated users manage client-avatars"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'client-avatars')
  with check (bucket_id = 'client-avatars');

create policy "public can read client-avatars"
  on storage.objects for select
  to anon
  using (bucket_id = 'client-avatars');

create policy "authenticated users manage client-documents"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'client-documents')
  with check (bucket_id = 'client-documents');

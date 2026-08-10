-- Fix publish: allow admin revision inserts and harden publish_content RPC.

create policy "Admin inserts revisions"
on public.content_revisions for insert to authenticated
with check (public.is_admin());

create or replace function public.publish_content(entry_id uuid)
returns public.content_entries
language plpgsql
security definer
set search_path = ''
as $$
declare
  result public.content_entries;
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  update public.content_entries
  set published_data = draft_data,
      status = 'published'::public.content_status,
      published_at = now()
  where id = entry_id
  returning * into result;

  if result.id is null then
    raise exception 'Content entry not found';
  end if;

  insert into public.content_revisions
    (content_id, revision, data, action, editor_id)
  values
    (result.id, result.revision, result.published_data, 'publish', auth.uid());

  return result;
end;
$$;

revoke all on function public.publish_content(uuid) from public;
grant execute on function public.publish_content(uuid) to authenticated;

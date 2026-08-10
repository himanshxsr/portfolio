create extension if not exists pgcrypto;

create type public.content_status as enum ('draft', 'published', 'archived');
create type public.message_status as enum ('new', 'read', 'replied', 'archived');

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  singleton_key boolean not null default true unique,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create table public.content_entries (
  id uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type ~ '^[a-z][a-z0-9_-]{1,63}$'),
  slug text not null check (slug ~ '^[a-z0-9][a-z0-9-]{0,127}$'),
  draft_data jsonb not null default '{}'::jsonb,
  published_data jsonb,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  revision integer not null default 1,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (content_type, slug)
);

create index content_entries_type_order_idx
  on public.content_entries (content_type, sort_order, created_at);
create index content_entries_published_idx
  on public.content_entries (content_type, status)
  where status = 'published';

create table public.content_revisions (
  id bigint generated always as identity primary key,
  content_id uuid not null references public.content_entries(id) on delete cascade,
  revision integer not null,
  data jsonb not null,
  action text not null check (action in ('save', 'publish', 'unpublish', 'restore')),
  editor_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index content_revisions_content_idx
  on public.content_revisions (content_id, revision desc);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  public_url text not null,
  filename text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes between 1 and 10485760),
  width integer,
  height integer,
  alt_text text not null default '',
  caption text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  message text not null check (char_length(message) between 1 and 5000),
  status public.message_status not null default 'new',
  delivery_status text not null default 'pending'
    check (delivery_status in ('pending', 'sent', 'failed')),
  delivery_error text,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index contact_messages_status_created_idx
  on public.contact_messages (status, created_at desc);

create table public.page_views (
  id bigint generated always as identity primary key,
  path text not null check (char_length(path) between 1 and 512),
  referrer_host text check (char_length(referrer_host) <= 255),
  device_class text not null default 'unknown'
    check (device_class in ('desktop', 'mobile', 'tablet', 'bot', 'unknown')),
  country_code text check (country_code ~ '^[A-Z]{2}$'),
  session_hash text,
  viewed_at timestamptz not null default now()
);

create index page_views_viewed_at_idx on public.page_views (viewed_at desc);
create index page_views_path_viewed_idx on public.page_views (path, viewed_at desc);

create table public.rate_limits (
  key_hash text primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 1
);

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

create trigger content_entries_updated_at
before update on public.content_entries
for each row execute function public.set_updated_at();

create trigger contact_messages_updated_at
before update on public.contact_messages
for each row execute function public.set_updated_at();

create or replace function public.snapshot_content_revision()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' and new.draft_data is distinct from old.draft_data then
    new.revision = old.revision + 1;
    insert into public.content_revisions
      (content_id, revision, data, action, editor_id)
    values
      (new.id, new.revision, new.draft_data, 'save', auth.uid());
  end if;
  return new;
end;
$$;

create trigger content_entries_revision
before update on public.content_entries
for each row execute function public.snapshot_content_revision();

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

create or replace function public.check_rate_limit(
  input_key_hash text,
  window_seconds integer default 60,
  max_requests integer default 5
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  allowed boolean;
begin
  insert into public.rate_limits as limits
    (key_hash, window_started_at, request_count)
  values
    (input_key_hash, now(), 1)
  on conflict (key_hash) do update
  set window_started_at = case
        when limits.window_started_at < now() - make_interval(secs => window_seconds)
        then now()
        else limits.window_started_at
      end,
      request_count = case
        when limits.window_started_at < now() - make_interval(secs => window_seconds)
        then 1
        else limits.request_count + 1
      end
  returning request_count <= max_requests into allowed;

  return allowed;
end;
$$;

create or replace function public.track_page_view(
  input_path text,
  input_referrer_host text default null,
  input_device_class text default 'unknown',
  input_country_code text default null,
  input_session_hash text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.page_views
    (path, referrer_host, device_class, country_code, session_hash)
  values
    (
      left(input_path, 512),
      nullif(left(coalesce(input_referrer_host, ''), 255), ''),
      case when input_device_class in ('desktop', 'mobile', 'tablet', 'bot')
        then input_device_class else 'unknown' end,
      case when input_country_code ~ '^[A-Z]{2}$' then input_country_code else null end,
      nullif(left(coalesce(input_session_hash, ''), 128), '')
    );
end;
$$;

create or replace view public.published_content
with (security_invoker = false)
as
select
  id,
  content_type,
  slug,
  published_data as data,
  sort_order,
  published_at,
  updated_at
from public.content_entries
where status = 'published' and published_data is not null;

alter table public.admin_users enable row level security;
alter table public.content_entries enable row level security;
alter table public.content_revisions enable row level security;
alter table public.media_assets enable row level security;
alter table public.contact_messages enable row level security;
alter table public.page_views enable row level security;
alter table public.rate_limits enable row level security;

create policy "Admin reads admin membership"
on public.admin_users for select to authenticated
using (user_id = auth.uid());

create policy "Admin manages content"
on public.content_entries for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admin reads revisions"
on public.content_revisions for select to authenticated
using (public.is_admin());

create policy "Admin inserts revisions"
on public.content_revisions for insert to authenticated
with check (public.is_admin());

create policy "Admin manages media metadata"
on public.media_assets for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admin manages messages"
on public.contact_messages for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admin reads analytics"
on public.page_views for select to authenticated
using (public.is_admin());

revoke all on public.content_entries from anon;
revoke all on public.content_revisions from anon;
revoke all on public.admin_users from anon;
revoke all on public.contact_messages from anon;
revoke all on public.page_views from anon;
revoke all on public.rate_limits from anon, authenticated;
grant select on public.published_content to anon, authenticated;
grant execute on function public.track_page_view(text, text, text, text, text) to anon, authenticated;
grant execute on function public.check_rate_limit(text, integer, integer) to service_role;
grant execute on function public.publish_content(uuid) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-assets',
  'portfolio-assets',
  true,
  10485760,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'application/pdf'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Admin uploads portfolio assets"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'portfolio-assets'
  and public.is_admin()
);

create policy "Admin updates portfolio assets"
on storage.objects for update to authenticated
using (bucket_id = 'portfolio-assets' and public.is_admin())
with check (bucket_id = 'portfolio-assets' and public.is_admin());

create policy "Admin deletes portfolio assets"
on storage.objects for delete to authenticated
using (bucket_id = 'portfolio-assets' and public.is_admin());

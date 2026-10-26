-- ============================================================
-- Tradeza: adapt existing tables to the master-prompt schema
-- (businesses / opportunities / profiles) without duplicating.
-- ============================================================

-- ---------- BUSINESSES ----------
alter table public.businesses rename column tagline to short_description;
alter table public.businesses rename column website to website_url;
alter table public.businesses rename column email to public_email;
alter table public.businesses add column if not exists public_phone text;

do $$
declare c record;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.businesses'::regclass and contype = 'c'
  loop
    execute format('alter table public.businesses drop constraint %I', c.conname);
  end loop;
end $$;
alter table public.businesses alter column status set default 'draft';
update public.businesses set status = 'published' where status = 'active';
alter table public.businesses add constraint businesses_status_check
  check (status in ('draft', 'published'));

-- ---------- OPPORTUNITIES ----------
alter table public.opportunities rename column international to is_international;
alter table public.opportunities drop column if exists location;
alter table public.opportunities add column if not exists country text;
alter table public.opportunities add column if not exists city text;
alter table public.opportunities add column if not exists public_email text;
alter table public.opportunities add column if not exists public_phone text;

do $$
declare c record;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.opportunities'::regclass and contype = 'c'
  loop
    execute format('alter table public.opportunities drop constraint %I', c.conname);
  end loop;
end $$;
alter table public.opportunities alter column status set default 'draft';
alter table public.opportunities add constraint opportunities_type_check
  check (type in ('supplier_needed', 'buyer_needed', 'distributor_wanted', 'partnership'));
alter table public.opportunities add constraint opportunities_status_check
  check (status in ('draft', 'published', 'closed'));

-- ---------- INDEXES ----------
create index if not exists businesses_owner_id_idx on public.businesses (owner_id);
create index if not exists businesses_status_idx on public.businesses (status);
create index if not exists businesses_category_id_idx on public.businesses (category_id);
create index if not exists businesses_country_idx on public.businesses (country);
create index if not exists opportunities_owner_id_idx on public.opportunities (owner_id);
create index if not exists opportunities_status_idx on public.opportunities (status);
create index if not exists opportunities_type_idx on public.opportunities (type);
create index if not exists opportunities_country_idx on public.opportunities (country);

create extension if not exists pg_trgm;
create index if not exists businesses_search_idx on public.businesses
  using gin ((name || ' ' || coalesce(short_description, '') || ' ' || coalesce(description, '') || ' ' || coalesce(city, '') || ' ' || coalesce(country, '')) gin_trgm_ops);
create index if not exists opportunities_search_idx on public.opportunities
  using gin ((title || ' ' || coalesce(description, '') || ' ' || coalesce(country, '') || ' ' || coalesce(city, '')) gin_trgm_ops);

-- ---------- RLS: tighten policies ----------
drop policy if exists "Active businesses are viewable by everyone" on public.businesses;
drop policy if exists "Open opportunities are viewable by everyone" on public.opportunities;
drop policy if exists "Users can insert own business" on public.businesses;
drop policy if exists "Users can update own business" on public.businesses;
drop policy if exists "Users can delete own business" on public.businesses;
drop policy if exists "Users can insert own opportunity" on public.opportunities;
drop policy if exists "Users can update own opportunity" on public.opportunities;
drop policy if exists "Users can delete own opportunity" on public.opportunities;

create policy "Published businesses are publicly viewable"
  on public.businesses for select to public using (status = 'published');
create policy "Users can view own businesses"
  on public.businesses for select to authenticated using (auth.uid() = owner_id);
create policy "Users can insert own business"
  on public.businesses for insert to authenticated with check (auth.uid() = owner_id);
create policy "Users can update own business"
  on public.businesses for update to authenticated
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "Users can delete own business"
  on public.businesses for delete to authenticated using (auth.uid() = owner_id);

create policy "Published opportunities are publicly viewable"
  on public.opportunities for select to public using (status = 'published');
create policy "Users can view own opportunities"
  on public.opportunities for select to authenticated using (auth.uid() = owner_id);
create policy "Users can insert own opportunity"
  on public.opportunities for insert to authenticated with check (auth.uid() = owner_id);
create policy "Users can update own opportunity"
  on public.opportunities for update to authenticated
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "Users can delete own opportunity"
  on public.opportunities for delete to authenticated using (auth.uid() = owner_id);

-- ---------- PROFILES: safe public projection ----------
create or replace view public.profiles_public
as
select id, full_name, avatar_url from public.profiles;
grant select on public.profiles_public to anon, authenticated;

-- ---------- PROFILES: auto-create on first sign-in ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    updated_at = now();
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

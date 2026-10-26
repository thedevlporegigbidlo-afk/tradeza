-- ============================================================
-- Tradeza core schema (fresh install for project pavvbewhgxnjzcinwtno)
-- Captures the FINAL state previously built on the legacy project:
-- profiles / categories / businesses / opportunities + RLS,
-- triggers, indexes, search, auth trigger, seed categories.
-- Supersedes the legacy "align" migration (already folded in).
-- ============================================================

create extension if not exists pg_trgm;

-- ---------- shared helper ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path to ''
as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- PROFILES ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  language text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_language_check check (language in ('en', 'hi'))
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select to public using (auth.uid() = id);
create policy "profiles_insert_own"
  on public.profiles for insert to public with check (auth.uid() = id);
create policy "profiles_update_own"
  on public.profiles for update to public
  using (auth.uid() = id) with check (auth.uid() = id);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------- CATEGORIES ----------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  icon text,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

drop policy if exists "Categories are viewable by everyone" on public.categories;
create policy "Categories are viewable by everyone"
  on public.categories for select to public using (true);

-- ---------- BUSINESSES ----------
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  category_id uuid references public.categories (id) on delete set null,
  city text,
  country text,
  website_url text,
  public_email text,
  public_phone text,
  logo_url text,
  verified boolean not null default false,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint businesses_status_check check (status in ('draft', 'published'))
);

alter table public.businesses enable row level security;

create index if not exists businesses_owner_id_idx on public.businesses (owner_id);
create index if not exists businesses_status_idx on public.businesses (status);
create index if not exists businesses_category_id_idx on public.businesses (category_id);
create index if not exists businesses_country_idx on public.businesses (country);
create index if not exists businesses_search_idx on public.businesses
  using gin ((name || ' ' || coalesce(short_description, '') || ' ' || coalesce(description, '') || ' ' || coalesce(city, '') || ' ' || coalesce(country, '')) gin_trgm_ops);

drop policy if exists "Published businesses are publicly viewable" on public.businesses;
drop policy if exists "Users can view own businesses" on public.businesses;
drop policy if exists "Users can insert own business" on public.businesses;
drop policy if exists "Users can update own business" on public.businesses;
drop policy if exists "Users can delete own business" on public.businesses;
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

drop trigger if exists businesses_updated_at on public.businesses;
create trigger businesses_updated_at
  before update on public.businesses
  for each row execute function public.set_updated_at();

-- ---------- OPPORTUNITIES ----------
create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  business_id uuid references public.businesses (id) on delete cascade,
  title text not null,
  type text not null,
  description text,
  is_international boolean not null default false,
  country text,
  city text,
  public_email text,
  public_phone text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint opportunities_type_check
    check (type in ('supplier_needed', 'buyer_needed', 'distributor_wanted', 'partnership')),
  constraint opportunities_status_check
    check (status in ('draft', 'published', 'closed'))
);

alter table public.opportunities enable row level security;

create index if not exists opportunities_owner_id_idx on public.opportunities (owner_id);
create index if not exists opportunities_status_idx on public.opportunities (status);
create index if not exists opportunities_type_idx on public.opportunities (type);
create index if not exists opportunities_country_idx on public.opportunities (country);
create index if not exists opportunities_search_idx on public.opportunities
  using gin ((title || ' ' || coalesce(description, '') || ' ' || coalesce(country, '') || ' ' || coalesce(city, '')) gin_trgm_ops);

drop policy if exists "Published opportunities are publicly viewable" on public.opportunities;
drop policy if exists "Users can view own opportunities" on public.opportunities;
drop policy if exists "Users can insert own opportunity" on public.opportunities;
drop policy if exists "Users can update own opportunity" on public.opportunities;
drop policy if exists "Users can delete own opportunity" on public.opportunities;
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

drop trigger if exists opportunities_updated_at on public.opportunities;
create trigger opportunities_updated_at
  before update on public.opportunities
  for each row execute function public.set_updated_at();

-- ---------- PUBLIC PROFILE PROJECTION (security invoker) ----------
create or replace view public.profiles_public
with (security_invoker = on)
as
select id, full_name, avatar_url from public.profiles;
grant select on public.profiles_public to anon, authenticated;

-- ---------- AUTO-CREATE PROFILE ON FIRST SIGN-IN ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to ''
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

-- ---------- SEED CATEGORIES ----------
insert into public.categories (id, name, slug, description, icon) values
  ('7438820c-37b3-437a-9464-14b682895f64', 'Trading & Wholesale', 'trading-wholesale', 'Buying, selling, import/export, and wholesale products.', 'storefront'),
  ('a0d7d4a6-79cb-4c6a-912d-6b9d820b0432', 'Distribution & Supply', 'distribution-supply', 'Suppliers, distributors, stockists, dealers, and sourcing.', 'local_shipping'),
  ('59331dfe-f226-4796-bbed-515179135af6', 'Manufacturing & Products', 'manufacturing-products', 'Manufacturers, product makers, OEM/ODM, and raw materials.', 'precision_manufacturing'),
  ('964e70d9-4af6-4a76-8391-06709b63df1a', 'IT & Digital Services', 'it-digital-services', 'Websites, software, marketing, design, and digital services.', 'terminal'),
  ('5236c16b-83e3-4238-8938-c141165c9d89', 'Business Services & Partnerships', 'business-services-partnerships', 'Business support, reselling, collaborations, and partnerships.', 'handshake')
on conflict (id) do nothing;

-- ============================================================
-- Security + search hardening
-- 1. Owners must not be able to grant themselves the verified badge.
-- 2. Replace expression trigram indexes with per-column trigram
--    indexes that the actual `ilike` filters can use.
-- ============================================================

-- ---------- 1. verified badge is staff/service-role only ----------
create or replace function public.businesses_guard_verified()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- auth.uid() is null for the service role and for direct database access,
  -- so only end users are constrained here.
  if auth.uid() is not null then
    if tg_op = 'INSERT' then
      new.verified := false;
    elsif new.verified is distinct from old.verified then
      new.verified := old.verified;
    end if;
  end if;
  return new;
end $$;

drop trigger if exists businesses_guard_verified on public.businesses;
create trigger businesses_guard_verified
  before insert or update on public.businesses
  for each row execute function public.businesses_guard_verified();

-- ---------- 2. usable trigram indexes for directory search ----------
drop index if exists public.businesses_search_idx;
create index if not exists businesses_name_trgm_idx
  on public.businesses using gin (name gin_trgm_ops);
create index if not exists businesses_short_description_trgm_idx
  on public.businesses using gin (short_description gin_trgm_ops);
create index if not exists businesses_description_trgm_idx
  on public.businesses using gin (description gin_trgm_ops);
create index if not exists businesses_city_trgm_idx
  on public.businesses using gin (city gin_trgm_ops);
create index if not exists businesses_country_trgm_idx
  on public.businesses using gin (country gin_trgm_ops);

drop index if exists public.opportunities_search_idx;
create index if not exists opportunities_title_trgm_idx
  on public.opportunities using gin (title gin_trgm_ops);
create index if not exists opportunities_description_trgm_idx
  on public.opportunities using gin (description gin_trgm_ops);
create index if not exists opportunities_city_trgm_idx
  on public.opportunities using gin (city gin_trgm_ops);
create index if not exists opportunities_country_trgm_idx
  on public.opportunities using gin (country gin_trgm_ops);

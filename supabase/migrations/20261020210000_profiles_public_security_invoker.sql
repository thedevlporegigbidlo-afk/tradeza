-- ============================================================
-- Fix: recreate profiles_public as a security-invoker view so
-- it enforces the querying user's RLS (advisor lint 0010).
-- The view only exposes intended public fields.
-- ============================================================

create or replace view public.profiles_public
with (security_invoker = on)
as
select id, full_name, avatar_url from public.profiles;

grant select on public.profiles_public to anon, authenticated;

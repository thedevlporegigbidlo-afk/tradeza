-- ============================================================
-- Advisor hardening
-- 1. Trigger helpers must not be callable through the API.
-- 2. Index the opportunities.business_id foreign key.
-- 3. Use (select auth.uid()) so RLS predicates are evaluated once
--    per statement (Supabase perf advisor: auth_rls_initplan).
-- 4. Merge overlapping permissive SELECT policies into one.
-- ============================================================

-- ---------- 1. trigger functions are not RPC endpoints ----------
revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon, authenticated;
revoke all on function public.businesses_guard_verified() from public;
revoke all on function public.businesses_guard_verified() from anon, authenticated;
revoke all on function public.set_updated_at() from public;
revoke all on function public.set_updated_at() from anon, authenticated;

-- ---------- 2. foreign key index ----------
create index if not exists opportunities_business_id_idx
  on public.opportunities (business_id);

-- ---------- 3. business policies ----------
drop policy if exists "Published businesses are publicly viewable" on public.businesses;
drop policy if exists "Users can view own businesses" on public.businesses;
drop policy if exists "Users can insert own business" on public.businesses;
drop policy if exists "Users can update own business" on public.businesses;
drop policy if exists "Users can delete own business" on public.businesses;

create policy "Businesses are viewable when published or owned"
  on public.businesses for select to public
  using (status = 'published' or (select auth.uid()) = owner_id);
create policy "Users can insert own business"
  on public.businesses for insert to authenticated
  with check ((select auth.uid()) = owner_id);
create policy "Users can update own business"
  on public.businesses for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);
create policy "Users can delete own business"
  on public.businesses for delete to authenticated
  using ((select auth.uid()) = owner_id);

-- ---------- 4. opportunity policies ----------
drop policy if exists "Published opportunities are publicly viewable" on public.opportunities;
drop policy if exists "Users can view own opportunities" on public.opportunities;
drop policy if exists "Users can insert own opportunity" on public.opportunities;
drop policy if exists "Users can update own opportunity" on public.opportunities;
drop policy if exists "Users can delete own opportunity" on public.opportunities;

create policy "Opportunities are viewable when published or owned"
  on public.opportunities for select to public
  using (status = 'published' or (select auth.uid()) = owner_id);
create policy "Users can insert own opportunity"
  on public.opportunities for insert to authenticated
  with check ((select auth.uid()) = owner_id);
create policy "Users can update own opportunity"
  on public.opportunities for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);
create policy "Users can delete own opportunity"
  on public.opportunities for delete to authenticated
  using ((select auth.uid()) = owner_id);

-- ---------- 5. profile policies ----------
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_select_own"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy "profiles_insert_own"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);
create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

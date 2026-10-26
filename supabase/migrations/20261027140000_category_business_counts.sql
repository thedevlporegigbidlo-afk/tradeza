-- Published-business counts per category, for the homepage category grid.
-- security_invoker keeps the caller's RLS in force, so unknown callers only
-- ever see counts derived from published rows.

create or replace view public.category_business_counts
with (security_invoker = true)
as
select
  c.id as category_id,
  count(b.id)::int as business_count
from public.categories c
left join public.businesses b
  on b.category_id = c.id
 and b.status = 'published'
group by c.id;

revoke all on public.category_business_counts from anon, authenticated;
grant select on public.category_business_counts to anon, authenticated;

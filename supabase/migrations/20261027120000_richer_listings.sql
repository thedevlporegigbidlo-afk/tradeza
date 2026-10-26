-- ============================================================
-- Rich listings: WhatsApp-style business profiles
-- 1. Business profile fields people actually ask for in a
--    trade group: type of business, WhatsApp, products, price
--    range, MOQ, service areas, year established, photo gallery.
-- 2. Opportunity fields: quantity, budget, deadline + more types.
-- 3. More categories so people can find each other faster.
-- 4. Public storage bucket for logos and photos with owner-scoped
--    write policies.
-- ============================================================

-- ---------- 1. businesses: richer profile ----------
alter table public.businesses
  add column if not exists business_type text,
  add column if not exists whatsapp text,
  add column if not exists contact_name text,
  add column if not exists designation text,
  add column if not exists products text,
  add column if not exists price_range text,
  add column if not exists moq text,
  add column if not exists service_areas text,
  add column if not exists established_year integer,
  add column if not exists gallery_urls text[] not null default '{}';

alter table public.businesses
  drop constraint if exists businesses_business_type_check,
  add constraint businesses_business_type_check check (
    business_type is null or business_type in (
      'manufacturer',
      'wholesaler',
      'distributor',
      'retailer',
      'trader',
      'exporter',
      'importer',
      'service_provider',
      'consultant',
      'other'
    )
  ),
  drop constraint if exists businesses_established_year_check,
  add constraint businesses_established_year_check check (
    established_year is null or established_year between 1900 and 2100
  ),
  drop constraint if exists businesses_gallery_urls_check,
  add constraint businesses_gallery_urls_check check (
    cardinality(gallery_urls) <= 8
  );

create index if not exists businesses_business_type_idx
  on public.businesses (business_type);
create index if not exists businesses_verified_idx
  on public.businesses (verified) where verified;
create index if not exists businesses_products_trgm_idx
  on public.businesses using gin (products gin_trgm_ops);
create index if not exists businesses_service_areas_trgm_idx
  on public.businesses using gin (service_areas gin_trgm_ops);
create index if not exists businesses_moq_trgm_idx
  on public.businesses using gin (moq gin_trgm_ops);

-- ---------- 2. opportunities: quantity / budget / deadline ----------
alter table public.opportunities
  add column if not exists quantity text,
  add column if not exists budget text,
  add column if not exists deadline date,
  add column if not exists whatsapp text,
  add column if not exists contact_name text;

alter table public.opportunities
  drop constraint if exists opportunities_type_check,
  add constraint opportunities_type_check check (
    type in (
      'supplier_needed',
      'buyer_needed',
      'distributor_wanted',
      'partnership',
      'service_needed',
      'service_offered',
      'job',
      'investment',
      'property',
      'event'
    )
  );

create index if not exists opportunities_deadline_idx
  on public.opportunities (deadline);

-- ---------- 3. extra categories ----------
insert into public.categories (id, name, slug, description, icon) values
  (
    'c1a7f3e2-0b41-4d7e-9a63-8f2c5d1e7a01',
    'Travel & Visa',
    'travel-visa',
    'Tours, ticketing, visa consultants, and travel packages.',
    'flight'
  ),
  (
    'c1a7f3e2-0b41-4d7e-9a63-8f2c5d1e7a02',
    'Food & Agro',
    'food-agro',
    'Rice, spices, groceries, dairy, farms, and food processing.',
    'agriculture'
  ),
  (
    'c1a7f3e2-0b41-4d7e-9a63-8f2c5d1e7a03',
    'Textiles & Apparel',
    'textiles-apparel',
    'Fabrics, garments, uniforms, and made-to-order clothing.',
    'checkroom'
  ),
  (
    'c1a7f3e2-0b41-4d7e-9a63-8f2c5d1e7a04',
    'Gems & Jewellery',
    'gems-jewellery',
    'Gemstones, jewellery, and Jaipur-style wholesale manufacturing.',
    'diamond'
  ),
  (
    'c1a7f3e2-0b41-4d7e-9a63-8f2c5d1e7a05',
    'Construction & Interiors',
    'construction-interiors',
    'Builders, interior designers, hardware, paints, and materials.',
    'construction'
  ),
  (
    'c1a7f3e2-0b41-4d7e-9a63-8f2c5d1e7a06',
    'Logistics & Transport',
    'logistics-transport',
    'Courier, freight, shipping, customs, and last-mile delivery.',
    'route'
  ),
  (
    'c1a7f3e2-0b41-4d7e-9a63-8f2c5d1e7a07',
    'Packaging & Printing',
    'packaging-printing',
    'Boxes, labels, custom packaging, and printing services.',
    'inventory_2'
  ),
  (
    'c1a7f3e2-0b41-4d7e-9a63-8f2c5d1e7a08',
    'Machinery & Equipment',
    'machinery-equipment',
    'Industrial machines, tools, spares, and equipment dealers.',
    'engineering'
  ),
  (
    'c1a7f3e2-0b41-4d7e-9a63-8f2c5d1e7a09',
    'Marketing & Creative',
    'marketing-creative',
    'Ads, branding, design, content, and social media services.',
    'campaign'
  ),
  (
    'c1a7f3e2-0b41-4d7e-9a63-8f2c5d1e7a10',
    'Property & Real Estate',
    'property-real-estate',
    'Plots, flats, rentals, commercial spaces, and brokers.',
    'home_work'
  ),
  (
    'c1a7f3e2-0b41-4d7e-9a63-8f2c5d1e7a11',
    'Education & Training',
    'education-training',
    'Schools, courses, skilling, and career guidance.',
    'school'
  ),
  (
    'c1a7f3e2-0b41-4d7e-9a63-8f2c5d1e7a12',
    'Finance & Compliance',
    'finance-compliance',
    'Loans, insurance, accounting, tax, and legal compliance.',
    'account_balance'
  ),
  (
    'c1a7f3e2-0b41-4d7e-9a63-8f2c5d1e7a13',
    'Events & Communities',
    'events-communities',
    'Expos, meetups, exhibitions, and community gatherings.',
    'event'
  )
on conflict (id) do nothing;

-- ---------- 4. public media bucket ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'business-media',
  'business-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Business media is publicly readable" on storage.objects;
create policy "Business media is publicly readable"
  on storage.objects for select to public
  using (bucket_id = 'business-media');

drop policy if exists "Users can upload own business media" on storage.objects;
create policy "Users can upload own business media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'business-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update own business media" on storage.objects;
create policy "Users can update own business media"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'business-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'business-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete own business media" on storage.objects;
create policy "Users can delete own business media"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'business-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  business_id uuid references public.businesses (id) on delete set null,
  dodo_payment_id text unique,
  dodo_checkout_id text,
  product_id text,
  amount integer not null default 49,
  currency text not null default 'INR',
  status text not null default 'pending' check (status in ('pending','succeeded','failed','refunded','cancelled')),
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payments_user_id_idx on public.payments (user_id);
create index if not exists payments_dodo_payment_id_idx on public.payments (dodo_payment_id);
create index if not exists payments_status_idx on public.payments (status);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_payments_updated_at on public.payments;
create trigger set_payments_updated_at before update on public.payments for each row execute function public.set_updated_at();

alter table public.payments enable row level security;

drop policy if exists "Users can view own payments" on public.payments;
create policy "Users can view own payments" on public.payments for select using (auth.uid() = user_id);

drop policy if exists "Service role can manage payments" on public.payments;
create policy "Service role can manage payments" on public.payments for all using (auth.role() = 'service_role');

alter table public.profiles add column if not exists paid_at timestamptz;
alter table public.profiles add column if not exists has_paid_listing boolean not null default false;

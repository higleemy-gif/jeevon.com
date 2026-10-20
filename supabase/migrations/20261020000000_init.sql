-- ============================================================================
-- Jeevon — initial schema
--
-- Run this whole file once against your local / self-hosted Supabase instance.
--   Option A (Supabase CLI):  supabase db reset        # applies migrations
--   Option B (Studio):        paste into SQL Editor -> Run
--   Option C (psql):          psql "$DATABASE_URL" -f supabase/migrations/20261020000000_init.sql
--
-- Safe to re-run: everything is guarded with IF NOT EXISTS / ON CONFLICT.
-- ============================================================================

-- gen_random_uuid() is built into Postgres 13+, but pgcrypto keeps this
-- portable to older local images.
create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- products: powers the product grid and the order-form dropdown
-- ----------------------------------------------------------------------------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text    not null unique,
  description text,
  category    text    not null check (category in ('Skincare', 'Healthcare')),
  price       numeric(10, 2),            -- NULL = "Price on request"; set your real prices here
  image_url   text,                      -- NULL = app shows a built-in illustrated placeholder
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists products_active_idx on public.products (is_active);

-- ----------------------------------------------------------------------------
-- orders: one row per submitted order form
-- ----------------------------------------------------------------------------
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  full_name        text    not null,
  phone            text    not null,
  email            text,                 -- optional
  address          text    not null,
  product_name     text    not null,
  product_category text,
  quantity         int     not null default 1 check (quantity > 0),
  notes            text,
  status           text    not null default 'new'
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

-- ----------------------------------------------------------------------------
-- Row Level Security
--
-- The browser only ever holds the anon key, so the rules are deliberately tight:
--   products -> anyone may READ active products.
--   orders   -> anyone may INSERT an order, nobody may read/update/delete it.
--
-- Because there is no SELECT policy on orders, the client must insert WITHOUT
-- asking for the row back (do not chain `.select()` after `.insert()`).
-- Read your orders from Studio, or with the service-role key on a server.
-- ----------------------------------------------------------------------------
alter table public.products enable row level security;
alter table public.orders   enable row level security;

drop policy if exists "Active products are publicly readable" on public.products;
create policy "Active products are publicly readable"
  on public.products
  for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Anyone can place an order" on public.orders;
create policy "Anyone can place an order"
  on public.orders
  for insert
  to anon, authenticated
  with check (true);

-- ----------------------------------------------------------------------------
-- Seed: 6 sample products (3 skincare, 3 healthcare)
--
-- Replace names / descriptions / prices / image_url with your real catalogue.
-- `price` is intentionally left NULL so nothing is hardcoded — the UI renders
-- "Price on request" until you fill it in, e.g.
--     update public.products set price = 749.00 where name = 'Calm Barrier Serum';
-- ----------------------------------------------------------------------------
insert into public.products (name, description, category, price, image_url)
values
  (
    'Calm Barrier Serum',
    'A lightweight niacinamide + ceramide serum that calms redness and rebuilds a tired skin barrier.',
    'Skincare',
    null,
    null
  ),
  (
    'Dew Hydrating Moisturiser',
    'Oil-free gel-cream with hyaluronic acid for 24-hour comfort. Sits beautifully under sunscreen.',
    'Skincare',
    null,
    null
  ),
  (
    'Everyday Mineral Sunscreen SPF 50',
    'Broad-spectrum mineral protection with zero white cast. Fragrance-free and reef-safe.',
    'Skincare',
    null,
    null
  ),
  (
    'Daily Immunity Complex',
    'Vitamin C, zinc and elderberry in one capsule to support everyday immune health.',
    'Healthcare',
    null,
    null
  ),
  (
    'Omega-3 Clarity Capsules',
    'Cold-pressed, mercury-tested fish oil for heart, joint and cognitive support.',
    'Healthcare',
    null,
    null
  ),
  (
    'Restful Sleep Magnesium',
    'Gentle magnesium glycinate blend that helps you wind down without next-day grogginess.',
    'Healthcare',
    null,
    null
  )
on conflict (name) do nothing;

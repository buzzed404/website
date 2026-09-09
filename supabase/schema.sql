-- BUZZED.404 — Supabase schema, RLS policies, storage bucket, and seed data.
-- Run this once in Supabase Dashboard → SQL Editor → New Query → Run.
-- Safe to re-run: seed inserts use ON CONFLICT DO NOTHING.

-- =========================================================================
-- profiles — one row per auth.users account, holds the customer/admin role.
-- Created before is_admin() below, since that function reads this table.
-- =========================================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  role text not null default 'customer',
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- =========================================================================
-- Helper: is_admin() — used by RLS policies below. security definer lets it
-- read `profiles` on the caller's behalf without recursing through RLS.
-- =========================================================================
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles policies (defined after is_admin() exists)
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Admins can view all profiles" on profiles
  for select using (is_admin());

create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- =========================================================================
-- Auto-create a profile row whenever someone signs up, server-side — this
-- avoids relying on the client having an active session at insert time
-- (which fails if email confirmation is required, or due to timing).
-- =========================================================================
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (new.id, new.email, new.raw_user_meta_data ->> 'name', 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =========================================================================
-- products
-- =========================================================================
create table if not exists products (
  id text primary key,
  sku text not null,
  name text not null,
  category text not null,
  price integer not null,
  compare_at_price integer,
  colors text[] not null default '{}',
  sizes text[] not null default '{}',
  rating numeric(2,1) not null default 0,
  review_count integer not null default 0,
  is_new boolean not null default false,
  is_featured boolean not null default false,
  stock integer not null default 0,
  description text,
  details text[] not null default '{}',
  image text,
  created_at timestamptz not null default now()
);

alter table products enable row level security;

create policy "Public can view products" on products
  for select using (true);

create policy "Admins can insert products" on products
  for insert with check (is_admin());

create policy "Admins can update products" on products
  for update using (is_admin());

create policy "Admins can delete products" on products
  for delete using (is_admin());

-- =========================================================================
-- reviews — open insert (guest reviews are allowed today, matching the
-- existing UX where an unauthenticated visitor can leave a review).
-- =========================================================================
create table if not exists reviews (
  id text primary key,
  product_id text not null references products(id) on delete cascade,
  author text not null,
  rating integer not null,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table reviews enable row level security;

create policy "Public can view reviews" on reviews
  for select using (true);

create policy "Anyone can add a review" on reviews
  for insert with check (true);

-- =========================================================================
-- orders — guest checkout is supported (no login required at /checkout), so
-- insert is open. SELECT is also public: order confirmation pages must be
-- readable right after a guest places an order (no session to scope to),
-- and no sensitive payment data is ever stored here — just shipping/order
-- details. A larger store would want a tighter, token-based scheme instead.
-- =========================================================================
create table if not exists orders (
  id text primary key,
  customer_name text not null,
  email text not null,
  status text not null default 'Pending',
  total integer not null,
  items jsonb not null default '[]',
  created_at timestamptz not null default now()
);

alter table orders enable row level security;

create policy "Anyone can place an order" on orders
  for insert with check (true);

create policy "Public can view orders" on orders
  for select using (true);

create policy "Admins can update orders" on orders
  for update using (is_admin());

-- =========================================================================
-- Storage: product-images bucket (public read, admin-only write)
-- =========================================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can view product images" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "Admins can upload product images" on storage.objects
  for insert with check (bucket_id = 'product-images' and is_admin());

create policy "Admins can update product images" on storage.objects
  for update using (bucket_id = 'product-images' and is_admin());

create policy "Admins can delete product images" on storage.objects
  for delete using (bucket_id = 'product-images' and is_admin());

-- =========================================================================
-- Seed data — the current mock catalog, so the store isn't empty on day one.
-- =========================================================================
insert into products (id, sku, name, category, price, compare_at_price, colors, sizes, rating, review_count, is_new, is_featured, stock, description, details) values
('p001','BZ-HD-001','Corrupted File Hoodie','Hoodies',2999,3599,ARRAY['Black','Olive'],ARRAY['S','M','L','XL','XXL'],4.6,128,true,true,42,'Heavyweight oversized hoodie with a brushed fleece interior. Screen-printed glitch graphic across the back, woven BUZZ.404 neck label.',ARRAY['400 GSM cotton fleece','Oversized unisex fit','Dropped shoulder seams','Ribbed cuffs & hem','Machine wash cold']),
('p002','BZ-TS-002','Error 404 Tee','Tees',1299,null,ARRAY['Black','White'],ARRAY['XS','S','M','L','XL'],4.8,214,false,true,88,'Premium combed cotton tee with the signature ERROR 404 chest print. Breathable, pre-shrunk, built for daily rotation.',ARRAY['220 GSM combed cotton','Regular unisex fit','Reinforced collar','Pre-shrunk fabric']),
('p003','BZ-SW-003','System Status Sweatshirt','Sweatshirts',2499,2999,ARRAY['Black','Charcoal'],ARRAY['S','M','L','XL'],4.5,76,false,false,30,'Crewneck sweatshirt with terminal-style graphics and a clean mint accent hem stripe. Soft-brushed inside for everyday comfort.',ARRAY['320 GSM cotton blend','Relaxed fit','Set-in sleeves','Ribbed collar & hem']),
('p004','BZ-CG-004','Buffer Cargo Pants','Bottoms',3299,null,ARRAY['Black','Olive'],ARRAY['28','30','32','34','36'],4.3,52,true,false,24,'Tapered cargo pants with reinforced utility pockets and an adjustable drawcord waist. Built for movement.',ARRAY['Ripstop cotton blend','Tapered leg','6-pocket utility layout','Adjustable waist']),
('p005','BZ-TS-005','Normality Not Found Tee','Tees',1399,null,ARRAY['Black'],ARRAY['S','M','L','XL','XXL'],4.7,96,false,true,60,'Statement tee inspired by the brand''s launch drop, oversized fit with a bold back print.',ARRAY['230 GSM cotton','Oversized fit','Boxy silhouette','Screen-printed back graphic']),
('p006','BZ-HD-006','Loading... Zip Hoodie','Hoodies',3499,3999,ARRAY['Black','White'],ARRAY['S','M','L','XL'],4.4,61,false,false,18,'Full-zip hoodie with a raised progress-bar graphic and kangaroo pocket. An everyday layering essential.',ARRAY['380 GSM fleece','Two-way YKK zip','Kangaroo pocket','Adjustable hood drawstring']),
('p007','BZ-CP-007','Glitch Snapback Cap','Accessories',899,null,ARRAY['Black'],ARRAY['One Size'],4.5,34,false,false,70,'Structured snapback with an embroidered BUZZ.404 mark and adjustable strap.',ARRAY['Cotton twill','Embroidered logo','Adjustable snap closure']),
('p008','BZ-BT-008','Recovery Track Pants','Bottoms',2199,null,ARRAY['Black','Charcoal'],ARRAY['S','M','L','XL'],4.2,41,true,false,33,'Tapered track pants with side piping and zippered ankle cuffs. Built for comfort without losing the edge.',ARRAY['Brushed poly-cotton','Tapered fit','Zippered ankle cuffs','Elastic drawcord waist']),
('p009','BZ-TS-009','Drop 001 Tee','Tees',1499,1799,ARRAY['Black','Olive'],ARRAY['S','M','L','XL'],4.9,187,true,true,55,'The flagship Drop 001 graphic tee. Limited run, heavyweight cotton, bold brush-stroke print across the chest.',ARRAY['250 GSM cotton','Boxy oversized fit','Limited run print','Reinforced shoulder seams']),
('p010','BZ-SW-010','Unknown Status Crewneck','Sweatshirts',2699,null,ARRAY['Black','White'],ARRAY['S','M','L','XL','XXL'],4.4,58,false,false,27,'Minimal crewneck with a small chest wordmark and dropped hem. Clean enough for anywhere, loud enough to notice.',ARRAY['300 GSM fleece','Dropped hem','Ribbed cuffs','Chest wordmark embroidery']),
('p011','BZ-BG-011','Payload Tote Bag','Accessories',799,null,ARRAY['Black'],ARRAY['One Size'],4.6,29,false,false,90,'Heavy canvas tote with reinforced handles and the BUZZ.404 wordmark printed front and center.',ARRAY['12oz canvas','Reinforced stitched handles','Internal slip pocket']),
('p012','BZ-HD-012','Misfit Oversized Hoodie','Hoodies',3199,3799,ARRAY['Olive','Black'],ARRAY['S','M','L','XL','XXL'],4.7,143,false,true,20,'"Made for misfits" oversized hoodie, garment-dyed for a lived-in look with a soft brushed interior.',ARRAY['420 GSM garment-dyed fleece','Oversized fit','Dropped shoulders','Double-layer hood'])
on conflict (id) do nothing;

insert into reviews (id, product_id, author, rating, title, body, created_at) values
('r001','p001','Aarav K.',5,'Insanely comfortable','The fit is exactly as described, oversized but not sloppy. Fabric feels premium and the print hasn''t cracked after multiple washes.','2026-08-14'),
('r002','p001','Meera S.',4,'Great hoodie, runs slightly large','Sized down and it fits perfectly now. Would recommend checking the size chart first.','2026-07-30'),
('r003','p002','Rohan D.',5,'My new everyday tee','Soft, breathable, and the print quality is excellent. Ordered a second one in white.','2026-08-02'),
('r004','p002','Ishita P.',5,'Perfect fit','True to size and the fabric feels premium for the price point.','2026-06-19'),
('r005','p003','Kabir M.',4,'Solid everyday sweatshirt','Warm without being bulky. The mint stripe detail is a nice touch.','2026-05-27'),
('r006','p004','Ananya T.',4,'Functional and stylish','Pockets are actually usable, not just for show. Fabric has a nice weight to it.','2026-08-09'),
('r007','p005','Vivaan R.',5,'Statement piece','Gets compliments every time I wear it. Print is bold and well placed.','2026-07-11'),
('r008','p009','Diya N.',5,'Worth the hype','Limited drop pieces are always a gamble but this one delivered. Heavyweight cotton, great fit.','2026-08-20'),
('r009','p009','Aditya B.',5,'Best tee I own','The brush stroke print is even better in person.','2026-08-05'),
('r010','p012','Sara J.',4,'Cozy and unique','Garment dye gives it a nice faded look. Runs true to oversized sizing.','2026-06-30')
on conflict (id) do nothing;

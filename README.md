# BUZZED.404 — Website

Front-end for the BUZZED.404 streetwear shop. Built with React + Vite, React Router and Framer Motion, backed by a real **Supabase** project (Postgres database, authentication, and file storage). Cart and wishlist stay client-side (`localStorage`) by design.

## Getting Started

1. Copy `.env.example` to `.env` and fill in your Supabase project's URL and anon key (Project Settings → API in the Supabase dashboard).
2. In the Supabase dashboard, go to **SQL Editor** and run the contents of `supabase/schema.sql` once — it creates every table, Row Level Security policy, the `product-images` storage bucket, and seeds the starter catalog.
3. In **Authentication → Providers → Email**, turn off "Confirm email" for a frictionless signup flow (customers are signed in immediately after registering, matching the app's UX).

```bash
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

```bash
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```

## Account Access

- **Customer account**: register at `/account` with a real email + password (6+ characters).
- **Admin dashboard**: sign up as a customer first, then in the Supabase dashboard's **Table Editor**, open the `profiles` table and change that row's `role` from `customer` to `admin`. Sign in at `/admin/login` with the same credentials.

There's no separate admin-provisioning flow by design — this one-time manual step is the simplest way to create the first admin account.

## Project Structure

```
src/
├── assets/images/     Brand teaser art (reused for hero/brand-story sections)
├── components/
│   ├── layout/        Header, mobile menu, footer, newsletter
│   ├── ui/            Buttons, badges, form fields, modal, icons, star rating
│   ├── product/       Product card/grid, filters, gallery, reviews
│   └── cart/          Cart & wishlist drawers, cart line items
├── context/           React Context: Auth, Cart, Wishlist, Toast
├── lib/               supabaseClient.js — the Supabase client instance
├── services/          Data-access layer, backed by Supabase (see supabase/schema.sql)
├── hooks/             useProducts, useMediaQuery
├── pages/
│   ├── customer/      Home, Shop, Product, Cart, Wishlist, Checkout, Account, etc.
│   └── admin/         Admin login, dashboard, product CRUD, order management
└── utils/             Formatting, validation, shared constants
supabase/
└── schema.sql         Tables, RLS policies, storage bucket, and seed data
```

## What's Still Mocked

- **Payments**: the Checkout "Payment" step collects card fields for demo purposes only and doesn't process anything — swap it for a real gateway (Stripe, Razorpay, etc.) before taking real orders.
- **Product photography**: products without an uploaded image fall back to a generated placeholder icon (`components/product/ProductVisual.jsx`) — upload real photos via the admin product form to replace them.

## Security Notes

- The Supabase anon/public key in `.env` is meant to be public — it's safe in client-side code because every table is protected by Row Level Security (see `supabase/schema.sql`). Never put the `service_role` key here or in any client code.
- Product reviews and guest checkout are intentionally open (no login required), matching a typical storefront's UX — see the RLS policy comments in `supabase/schema.sql` for the exact access rules per table.

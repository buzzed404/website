# BUZZED.404 — Website

Static front-end for the BUZZED.404 streetwear shop. Built with React + Vite, React Router and Framer Motion. No backend yet — all data (products, orders, reviews, sessions, cart, wishlist) is seeded from local mock data and persisted to `localStorage`, structured so a real backend can be swapped in later with minimal changes.

## Getting Started

```bash
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

```bash
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```

## Demo Access

- **Customer account**: use `/account` — any email/password signs you in (no real auth yet).
- **Admin dashboard**: go to `/admin/login` and sign in with:
  - Email: `admin@buzzed404.com`
  - Password: `admin123`

This is intentionally insecure and for prototype/demo purposes only.

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
├── services/          Data-access layer (see below) — the seam for a future backend
├── data/              Seed/mock JSON (products, reviews, orders)
├── hooks/             useProducts, useMediaQuery
├── pages/
│   ├── customer/      Home, Shop, Product, Cart, Wishlist, Checkout, Account, etc.
│   └── admin/         Admin login, dashboard, product CRUD, order management
└── utils/             Formatting, validation, shared constants
```

## Adding a Real Backend Later

Every read/write goes through `src/services/*.js` (`productService`, `orderService`,
`reviewService`, `authService`), and each function already returns a `Promise` and is
called from components via `await`/`.then()`. To connect a real backend:

1. Replace the internals of each service function with `fetch()`/SDK calls to your API —
   keep the same function names and return shapes so no component code needs to change.
2. Swap `authService`'s mock session logic for real authentication (JWT/session cookies).
   `AuthContext` already expects an async `{ role, email, name }` session object.
3. Replace the "Payment" step in `pages/customer/Checkout.jsx` with a real payment
   gateway integration (Stripe, Razorpay, etc.) — it currently only collects and
   displays card fields without processing anything.
4. Remove the `localStorage` seeding in each service (`storage.js` wrapper) once a real
   database is in place.

## Notes

- Product imagery is placeholder (styled category icons), since only brand teaser
  photography exists — swap `components/product/ProductVisual.jsx` and
  `ImageGallery.jsx` for real photos when available.
- The admin area has no real access control — it's a client-side demo gate only.

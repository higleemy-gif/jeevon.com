# Jeevon — Skincare & Healthcare Landing Page

A single-page, mobile-first landing page with a product ordering flow.
Orders are written straight to a self-hosted / local **Supabase** instance.

**Stack:** React 19 + Vite 8 · Tailwind CSS v4 · `@supabase/supabase-js` v2

---

## 1. Install

```bash
npm install
```

## 2. WhatsApp number

Already set to **917205903961** (+91 72059 03961) in `src/config/site.js`.
Every order submitted through the form lands in that chat.

To change it, either edit `WHATSAPP_NUMBER` there or override it in `.env.local`:

```ini
VITE_WHATSAPP_NUMBER=919876543210
```

**Digits only, country code first, no `+`, spaces, dashes or brackets.**
`+91 98765 43210` becomes `919876543210`.

## 3. Set the environment variables

```bash
# Windows PowerShell
Copy-Item .env.example .env.local

# macOS / Linux
cp .env.example .env.local
```

Then edit `.env.local`:

```ini
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<your local anon key>

# Optional — price formatting only
VITE_CURRENCY=INR
VITE_LOCALE=en-IN
```

If you use the Supabase CLI, `supabase status` prints both the API URL and the
anon key. Use the **anon** key — never the `service_role` key in a frontend app.

> Vite reads env files at startup, so **restart the dev server** after editing
> `.env.local`.

## 4. Create the tables

Run [`supabase/migrations/20261020000000_init.sql`](supabase/migrations/20261020000000_init.sql).
It creates both tables, enables RLS with the right policies, and seeds the 6
sample products. It is safe to re-run.

Pick whichever is easiest:

```bash
# Supabase CLI — applies everything in supabase/migrations
supabase db reset

# or psql
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -f supabase/migrations/20261020000000_init.sql
```

Or open **Studio → SQL Editor**, paste the file contents, and hit Run.

## 5. Start the dev server

```bash
npm run dev          # http://localhost:5173
npm run build        # production build to dist/
npm run preview      # serve the production build
```

---

## Deploy to Cloudflare

The build output in `dist/` is plain static files — HTML, CSS, JS. No server,
no Node runtime needed in production.

### Push to GitHub first

```bash
git add .
git commit -m "Jeevon landing page"
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

`.gitignore` already keeps `node_modules/`, `dist/` and every `.env*.local`
file out of the repo.

### Option A — Cloudflare Pages (simplest, auto-deploys on push)

In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to
Git**, pick the repo, then set:

| Setting                | Value           |
| ---------------------- | --------------- |
| Framework preset       | `Vite`          |
| Build command          | `npm run build` |
| Build output directory | `dist`          |
| Root directory         | _(leave blank)_ |

Node version comes from `.nvmrc` (22). If a build ever picks the wrong one, add
a build-time variable `NODE_VERSION = 22`.

Every push to `main` redeploys. Pull requests get their own preview URL.

### Option B — Workers with static assets (`wrangler`)

`wrangler.jsonc` is already configured, so from your machine:

```bash
npx wrangler login
npm run deploy          # vite build && wrangler deploy
```

Cloudflare now points new projects at Workers rather than Pages. For a static
site like this either is fine; Pages wins on the zero-config Git workflow,
Workers wins if you later add API routes in the same project.

### Environment variables on Cloudflare

**None are required.** The WhatsApp number is committed in
`src/config/site.js`, so a fresh clone builds and works.

Two things to understand before you add any:

1. **Vite inlines `VITE_*` variables at build time**, not at runtime. They must
   be set as *build* variables in Cloudflare, and a rebuild is needed for a
   change to take effect. Anything prefixed `VITE_` ends up readable in the
   JS bundle — fine for the Supabase anon key, which is public by design.
   **Never** put the `service_role` key in a `VITE_` variable.
2. **Do not copy your local Supabase URL up there.** `http://127.0.0.1:54321`
   is your own machine; Cloudflare's build and your visitors' browsers cannot
   reach it. A page served over HTTPS also cannot call an `http://` endpoint —
   browsers block it as mixed content.

So for launch, leave `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` unset. The
site degrades exactly as designed: the grid serves the six products from
`src/data/products.js`, and orders still reach you on WhatsApp. Nothing breaks.

When you want the live site writing to Supabase, your instance needs a public
HTTPS URL (a tunnel, a VPS with a certificate, or Supabase Cloud). Then add
both variables in Cloudflare and redeploy.

### After the first deploy

- Add your custom domain under the project's **Custom domains** tab.
- Fill in `og:url` and `og:image` in `index.html` so shared links show a
  preview card — handy given orders arrive over WhatsApp.
- Response headers and caching live in `public/_headers`. HSTS and a CSP are
  in there, commented out, with notes on enabling them safely.
- Update the footer contact details in `src/config/site.js` — `CONTACT` is
  still placeholder text (`+91 00000 00000`, `hello@yourbrand.com`) and will
  show as-is on the live site.

---

## What the SQL does

| Table      | Purpose                                                    |
| ---------- | ---------------------------------------------------------- |
| `products` | Powers the product grid and the order-form dropdown.       |
| `orders`   | One row per submitted order form.                          |

**`orders`** columns: `id` (uuid pk, `gen_random_uuid()`), `created_at`
(timestamptz, `now()`), `full_name`, `phone`, `email`, `address`,
`product_name`, `product_category`, `quantity` (int, default 1), `notes`,
`status` (text, default `'new'`).

The form collects name, phone, address, product and quantity. `email` and
`notes` stay in the table as nullable columns — handy if you re-add those
fields later — but nothing is written to them today.

**`products`** columns: `id`, `name`, `description`, `category`
(`Skincare` | `Healthcare`), `price` (numeric), `image_url`, `is_active`
(default `true`), `created_at`.

### Row Level Security

The browser only ever holds the public anon key, so the policies are tight:

- `products` — **SELECT** allowed for everyone, limited to `is_active = true`.
- `orders` — **INSERT** allowed for everyone. No SELECT / UPDATE / DELETE.

That last part is deliberate: visitors can place an order but nobody can read
anyone else's. It has one implication in code — the client inserts **without**
chaining `.select()`, because asking for the row back would need SELECT rights.
Read orders from Studio, or server-side with the `service_role` key.

---

## Making it yours

| What                     | Where                                                                     |
| ------------------------ | ------------------------------------------------------------------------- |
| Brand name, tagline      | `src/config/site.js`                                                      |
| Flat price               | `src/config/site.js` → `DEFAULT_UNIT_PRICE`                               |
| WhatsApp number          | `.env.local` → `VITE_WHATSAPP_NUMBER`, or `src/config/site.js`            |
| WhatsApp message layout  | `src/lib/whatsapp.js` → `buildOrderMessage`                               |
| Phone, email, address    | `src/config/site.js` → `CONTACT`                                          |
| Social links             | `src/config/site.js` → `SOCIALS`                                          |
| Colours, fonts, shadows  | `src/index.css` → the `@theme` block                                      |
| Heading / body typeface  | `index.html` (Google Fonts link) + `--font-serif` / `--font-sans`         |
| Products                 | the `products` table — or `src/data/products.js` for the offline fallback  |
| Benefits copy            | `src/components/Benefits.jsx` → `BENEFITS`                                |

### Prices

Every product sells at one flat price, `DEFAULT_UNIT_PRICE` in
`src/config/site.js` (currently **2999**, rendered as ₹2,999). Change that one
number to reprice the whole catalogue.

A price set on an individual `products` row always wins over the flat price, so
you can go per-product whenever you like:

```sql
update public.products set price = 749.00 where name = 'Calm Barrier Serum';
```

The currency and number format come from `VITE_CURRENCY` / `VITE_LOCALE`.
Whole numbers drop the trailing `.00`.

### Product images

`image_url` is `NULL` in the seed data, so each card draws a built-in SVG
illustration. Point it at any URL — a CDN, Supabase Storage, or a file you drop
in `public/` (e.g. `/products/serum.jpg`) — and the real photo takes over.

---

## How it fits together

```
src/
  App.jsx                 # section order + the grid ⇄ form selection link
  config/site.js          # brand & contact copy
  data/products.js        # offline fallback catalogue
  hooks/
    useProducts.js        # reads the products table, falls back locally
    useReveal.js          # IntersectionObserver scroll reveal
  lib/
    supabase.js           # client, or null when env vars are missing
    format.js             # currency / price formatting
  components/
    Header.jsx            # sticky nav + mobile menu
    Hero.jsx  HeroVisual.jsx
    Products.jsx  ProductCard.jsx  ProductImage.jsx
    Benefits.jsx
    OrderForm.jsx         # validation + the Supabase insert
    Footer.jsx
    Reveal.jsx  icons.jsx
```

**Ordering flow:** clicking **Order** on a card lifts that product name into
`App`, scrolls to `#order`, moves focus to the section heading, and pre-selects
the product in the dropdown. On submit the form validates client-side, saves a
copy to `public.orders` if Supabase is reachable, then redirects to WhatsApp
with the order written out and ready to send.

### The WhatsApp hand-off

The button reads **Join Now** — WhatsApp is the delivery mechanism, not
something the visitor is asked to opt into. The message layout lives in
`src/lib/whatsapp.js`; edit `buildOrderMessage` to change the wording. It
arrives looking like this:

```
*🌿 New order · Jeevon*

*Name:* Ananya Sharma
*Phone:* +91 98765 43210

*Product:* Calm Barrier Serum
*Category:* Skincare
*Quantity:* 2
*Unit price:* ₹2,999
*Total:* ₹5,998

*Delivery address:*
Flat 4B, Rose Villa, MG Road
Pune, Maharashtra 411001

_Placed via the Jeevon website · 20 Oct 2026, 2:41 pm_
```

WhatsApp renders `*text*` as bold and `_text_` as italic, which is where the
formatting comes from.

Two deliberate choices in `OrderForm.jsx`:

- **The Supabase save can fail without blocking the order.** WhatsApp is what
  you actually rely on, so a database hiccup is logged to the console and the
  redirect happens anyway. The form also works with no Supabase at all.
- **The redirect uses same-tab navigation**, which popup blockers don't touch.
  The success panel still renders a real "Open WhatsApp" link as a fallback.

## Accessibility & motion notes

- Every control has a real `<label>`; errors are linked via `aria-describedby`
  and `aria-invalid`, and submit failures land focus on the first bad field.
- Status messages sit in an `aria-live` region; errors use `role="alert"`.
- One consistent, visible focus ring; a skip link is the first tab stop; the
  mobile menu reports `aria-expanded` and closes on <kbd>Esc</kbd>.
- All animation is disabled under `prefers-reduced-motion: reduce`, and content
  is never hidden behind an animation that cannot run.

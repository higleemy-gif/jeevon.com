/**
 * Local product catalogue — the offline fallback.
 *
 * The app reads products from the Supabase `products` table first (see
 * `useProducts`). This array is only used when Supabase is unconfigured or
 * unreachable, so the landing page is never blank. Keep it roughly in sync
 * with the seed data in `supabase/migrations/20261020000000_init.sql`.
 *
 * `price: null` renders as "Price on request" — set a number to show a price.
 * `image_url: null` renders the built-in illustrated placeholder — set a URL
 * (or a file in /public, e.g. '/products/serum.jpg') to show a real photo.
 */
export const FALLBACK_PRODUCTS = [
  {
    id: 'calm-barrier-serum',
    name: 'Calm Barrier Serum',
    description:
      'A lightweight niacinamide + ceramide serum that calms redness and rebuilds a tired skin barrier.',
    category: 'Skincare',
    price: null,
    image_url: null,
  },
  {
    id: 'dew-hydrating-moisturiser',
    name: 'Dew Hydrating Moisturiser',
    description:
      'Oil-free gel-cream with hyaluronic acid for 24-hour comfort. Sits beautifully under sunscreen.',
    category: 'Skincare',
    price: null,
    image_url: null,
  },
  {
    id: 'everyday-mineral-sunscreen',
    name: 'Everyday Mineral Sunscreen SPF 50',
    description:
      'Broad-spectrum mineral protection with zero white cast. Fragrance-free and reef-safe.',
    category: 'Skincare',
    price: null,
    image_url: null,
  },
  {
    id: 'daily-immunity-complex',
    name: 'Daily Immunity Complex',
    description:
      'Vitamin C, zinc and elderberry in one capsule to support everyday immune health.',
    category: 'Healthcare',
    price: null,
    image_url: null,
  },
  {
    id: 'omega-3-clarity-capsules',
    name: 'Omega-3 Clarity Capsules',
    description:
      'Cold-pressed, mercury-tested fish oil for heart, joint and cognitive support.',
    category: 'Healthcare',
    price: null,
    image_url: null,
  },
  {
    id: 'restful-sleep-magnesium',
    name: 'Restful Sleep Magnesium',
    description:
      'Gentle magnesium glycinate blend that helps you wind down without next-day grogginess.',
    category: 'Healthcare',
    price: null,
    image_url: null,
  },
]

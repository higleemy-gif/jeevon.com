/**
 * Brand + contact copy in one place.
 * Replace these placeholders with your real details — nothing else needs editing.
 */
export const BRAND = {
  name: 'Jeevon',
  tagline: 'Clean skincare. Honest healthcare.',
  description:
    'Dermatologist-safe formulas and everyday health essentials, sourced genuine and delivered to your door.',
}

/**
 * Pricing.
 *
 * Every product currently sells at one flat price. This is the single place to
 * change it. If you ever want per-product pricing instead, set `price` on the
 * row in the `products` table — a product's own price always wins over this.
 */
export const DEFAULT_UNIT_PRICE = 2999

/* -------------------------------------------------------------------------- */
/* WhatsApp — where order notifications are sent                              */
/* -------------------------------------------------------------------------- */

/**
 * The number that receives every order.
 *
 * Rules: digits only, country code first, no `+`, spaces, dashes or brackets.
 *   +91 98765 43210  ->  '919876543210'
 *   +1 (415) 555-0132 ->  '14155550132'
 *
 * You can also set it without editing this file, via `.env.local`:
 *   VITE_WHATSAPP_NUMBER=919876543210
 */
const WHATSAPP_PLACEHOLDER = '910000000000'

// 7205903961 with India's country code 91 -> +91 72059 03961
export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, '') || '917205903961'

/** False while the number above is still the untouched placeholder. */
export const isWhatsAppConfigured =
  WHATSAPP_NUMBER.length >= 8 && WHATSAPP_NUMBER !== WHATSAPP_PLACEHOLDER

export const CONTACT = {
  phone: '+91 00000 00000',
  phoneHref: 'tel:+910000000000',
  email: 'hello@yourbrand.com',
  emailHref: 'mailto:hello@yourbrand.com',
  address: 'Kasturinagar, Rayagada, Odisha',
  hours: 'Mon–Sat, 10am – 7pm',
}

export const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com/yourbrand', icon: 'instagram' },
  { label: 'Facebook', href: 'https://facebook.com/yourbrand', icon: 'facebook' },
  { label: 'WhatsApp', href: `https://wa.me/${WHATSAPP_NUMBER}`, icon: 'whatsapp' },
]

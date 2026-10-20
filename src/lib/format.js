import { DEFAULT_UNIT_PRICE } from '../config/site'

/**
 * Currency + price helpers.
 *
 * Currency and locale come from env so you can switch markets without touching
 * code. The amount itself comes from `getUnitPrice` below.
 *
 *   VITE_CURRENCY=INR
 *   VITE_LOCALE=en-IN
 */
const CURRENCY = import.meta.env.VITE_CURRENCY?.trim() || 'INR'
const LOCALE = import.meta.env.VITE_LOCALE?.trim() || 'en-IN'

/** Shown only if a product has no price and no flat price is configured. */
export const PRICE_PLACEHOLDER = 'Price on request'

/**
 * The price of a single unit of a product.
 *
 * A price set on the product row wins; otherwise everything falls back to the
 * flat `DEFAULT_UNIT_PRICE` from `src/config/site.js`.
 *
 * @param {{price?: number|string|null}|null|undefined} product
 * @returns {number|null}
 */
export function getUnitPrice(product) {
  const own = product?.price
  if (own !== null && own !== undefined && own !== '') {
    const amount = Number(own)
    if (Number.isFinite(amount)) return amount
  }
  return Number.isFinite(DEFAULT_UNIT_PRICE) ? DEFAULT_UNIT_PRICE : null
}

/**
 * Format a price for display, e.g. 2999 -> "₹2,999" and 749.5 -> "₹749.50".
 * Whole numbers drop the trailing ".00".
 *
 * @param {number|string|null|undefined} value
 * @returns {string}
 */
export function formatPrice(value) {
  if (value === null || value === undefined || value === '') return PRICE_PLACEHOLDER

  const amount = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(amount)) return PRICE_PLACEHOLDER

  const fractionDigits = Number.isInteger(amount) ? 0 : 2

  try {
    return new Intl.NumberFormat(LOCALE, {
      style: 'currency',
      currency: CURRENCY,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(amount)
  } catch {
    // Unknown currency code — fall back to a plain number.
    return `${CURRENCY} ${amount.toFixed(fractionDigits)}`
  }
}

/** Convenience: the formatted unit price for a product. */
export function formatUnitPrice(product) {
  return formatPrice(getUnitPrice(product))
}

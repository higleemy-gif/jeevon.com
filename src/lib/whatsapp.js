import { WHATSAPP_NUMBER } from '../config/site'
import { formatPrice } from './format'

/**
 * Builds the WhatsApp message and deep link for a submitted order.
 *
 * WhatsApp renders a tiny subset of markdown in message bodies:
 *   *bold*   _italic_   ~strike~   ```monospace```
 * Line breaks survive as long as the text is URL-encoded, which
 * `encodeURIComponent` handles (newline -> %0A).
 */

/**
 * Format the order as a message.
 *
 * @param {object} order
 * @param {string} order.fullName
 * @param {string} order.phone
 * @param {string} order.address
 * @param {string} order.productName
 * @param {string|null} [order.productCategory]
 * @param {number} order.quantity
 * @param {number|null} [order.unitPrice]
 * @param {string} [order.brandName]
 * @returns {string} Plain text, not yet encoded.
 */
export function buildOrderMessage({
  fullName,
  phone,
  address,
  productName,
  productCategory,
  quantity,
  unitPrice,
  brandName = 'Jeevon',
}) {
  const lines = [`*🌿 New order · ${brandName}*`, '']

  // --- Customer ---
  lines.push(`*Name:* ${fullName}`)
  lines.push(`*Phone:* ${phone}`)
  lines.push('')

  // --- Product ---
  lines.push(`*Product:* ${productName}`)
  if (productCategory) lines.push(`*Category:* ${productCategory}`)
  lines.push(`*Quantity:* ${quantity}`)

  // --- Money (only when a price is known) ---
  if (unitPrice !== null && unitPrice !== undefined && Number.isFinite(unitPrice)) {
    lines.push(`*Unit price:* ${formatPrice(unitPrice)}`)
    lines.push(`*Total:* ${formatPrice(unitPrice * quantity)}`)
  }
  lines.push('')

  // --- Delivery ---
  lines.push('*Delivery address:*')
  lines.push(address)
  lines.push('')

  // --- Footer ---
  const stamp = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  lines.push(`_Placed via the ${brandName} website · ${stamp}_`)

  return lines.join('\n')
}

/**
 * Build the wa.me deep link. Works on mobile (opens the app) and desktop
 * (opens WhatsApp Web or the desktop client).
 *
 * @param {string} message Plain text message body.
 * @param {string} [number] Digits-only number with country code.
 * @returns {string}
 */
export function buildWhatsAppUrl(message, number = WHATSAPP_NUMBER) {
  const digits = String(number).replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

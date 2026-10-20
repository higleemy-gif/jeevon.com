import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Reveal from './Reveal'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { formatPrice, getUnitPrice, PRICE_PLACEHOLDER } from '../lib/format'
import { buildOrderMessage, buildWhatsAppUrl } from '../lib/whatsapp'
import { BRAND, isWhatsAppConfigured } from '../config/site'
import { AlertIcon, CheckCircleIcon, SpinnerIcon, WhatsAppIcon } from './icons'

const EMPTY_FORM = {
  fullName: '',
  phone: '',
  address: '',
  productName: '',
  quantity: '1',
}

const MAX_QUANTITY = 99

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

// Deliberately permissive: accepts +91 98765 43210, (022) 1234-5678, etc.
// The rule that matters is "between 7 and 15 digits" (ITU E.164 max).
const PHONE_SHAPE = /^\+?[\d\s\-().]{7,22}$/

/**
 * Validate the whole form at once.
 * @returns {Record<string, string>} field name -> error message (empty when valid)
 */
function validate(values) {
  const errors = {}

  if (!values.fullName.trim()) {
    errors.fullName = 'Please enter your full name.'
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = 'That name looks too short.'
  }

  const digits = values.phone.replace(/\D/g, '')
  if (!values.phone.trim()) {
    errors.phone = 'Please enter a phone number so we can confirm your order.'
  } else if (!PHONE_SHAPE.test(values.phone.trim()) || digits.length < 7 || digits.length > 15) {
    errors.phone = 'Enter a valid phone number (7–15 digits).'
  }

  if (!values.address.trim()) {
    errors.address = 'Please enter the delivery address.'
  } else if (values.address.trim().length < 10) {
    errors.address = 'Please include house/flat, street and city.'
  }

  if (!values.productName) {
    errors.productName = 'Please choose a product.'
  }

  const quantity = Number(values.quantity)
  if (!values.quantity || !Number.isInteger(quantity) || quantity < 1) {
    errors.quantity = 'Quantity must be at least 1.'
  } else if (quantity > MAX_QUANTITY) {
    errors.quantity = `For orders above ${MAX_QUANTITY} units, please contact us directly.`
  }

  return errors
}

/* -------------------------------------------------------------------------- */
/* Field primitives                                                           */
/* -------------------------------------------------------------------------- */

const CONTROL_CLASSES =
  'w-full rounded-2xl border bg-ivory px-4 py-3 text-base text-ink placeholder:text-muted/70 transition-colors duration-200 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-600'

/** Label + control + inline error, wired up with aria-describedby. */
function Field({ id, label, error, hint, optional, children, className = '' }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline gap-2 text-sm font-medium text-ink">
        {label}
        {optional ? (
          <span className="text-xs font-normal text-muted">optional</span>
        ) : (
          <span className="text-sage-600" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-xs text-blush-500">
          <AlertIcon className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Order form                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Order form. Validates locally, then inserts a row into `public.orders`.
 *
 * @param {object} props
 * @param {Array} props.products              Catalogue for the dropdown.
 * @param {string|null} props.selectedProductName Product chosen from a card, if any.
 * @param {(name: string) => void} props.onProductChange Keeps the grid's "Selected" badge in sync.
 */
export default function OrderForm({ products, selectedProductName, onProductChange }) {
  const uid = useId()
  const fieldId = (name) => `${uid}-${name}`

  const [values, setValues] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [success, setSuccess] = useState(false)
  // Kept after submit so the success panel can offer a manual "Open WhatsApp"
  // link if the automatic redirect was blocked or the user came back.
  const [whatsAppUrl, setWhatsAppUrl] = useState(null)
  const formRef = useRef(null)

  // Mirror a product chosen from the grid into the dropdown.
  useEffect(() => {
    if (!selectedProductName) return
    setValues((prev) => ({ ...prev, productName: selectedProductName }))
    setErrors((prev) => ({ ...prev, productName: undefined }))
  }, [selectedProductName])

  // Group the dropdown by category for easier scanning.
  const groupedProducts = useMemo(() => {
    const groups = new Map()
    for (const product of products) {
      const key = product.category || 'Other'
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(product)
    }
    return [...groups.entries()]
  }, [products])

  const activeProduct = useMemo(
    () => products.find((product) => product.name === values.productName) ?? null,
    [products, values.productName],
  )

  function handleChange(event) {
    const { name, value } = event.target

    setValues((prev) => ({ ...prev, [name]: value }))
    // Clear this field's error as soon as the user starts fixing it.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
    setSubmitError(null)
    setSuccess(false)

    if (name === 'productName') onProductChange?.(value)
  }

  /** Move focus to the first field with an error so keyboard users land on it. */
  function focusFirstError(nextErrors) {
    const firstKey = Object.keys(EMPTY_FORM).find((key) => nextErrors[key])
    if (!firstKey) return
    formRef.current?.querySelector(`[name="${firstKey}"]`)?.focus()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError(null)
    setSuccess(false)

    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors)
      return
    }

    // Without a destination number the order would vanish into a dead chat,
    // so refuse rather than pretend it worked.
    if (!isWhatsAppConfigured) {
      setSubmitError(
        'WhatsApp ordering is not set up yet. Add WHATSAPP_NUMBER in src/config/site.js (or VITE_WHATSAPP_NUMBER in .env.local) and restart the dev server.',
      )
      return
    }

    setSubmitting(true)

    const order = {
      fullName: values.fullName.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      productName: values.productName,
      productCategory: activeProduct?.category ?? null,
      quantity: Number(values.quantity),
      unitPrice: activeProduct ? getUnitPrice(activeProduct) : null,
      brandName: BRAND.name,
    }

    // Keep a copy in Supabase when it is available, but treat it as a nice-to-have:
    // the WhatsApp hand-off is what the customer and the shop actually rely on, so a
    // database hiccup must never block it. Failures are logged for debugging.
    if (isSupabaseConfigured) {
      try {
        // No `.select()` here — RLS allows INSERT but not SELECT, so asking for
        // the row back would 403. `email` and `notes` columns stay NULL: the
        // form no longer collects them.
        const { error } = await supabase.from('orders').insert({
          full_name: order.fullName,
          phone: order.phone,
          address: order.address,
          product_name: order.productName,
          product_category: order.productCategory,
          quantity: order.quantity,
        })
        if (error) throw error
      } catch (error) {
        console.error('[Jeevon] Could not save the order to Supabase:', error)
      }
    }

    // Hand off to WhatsApp with the details pre-filled.
    const url = buildWhatsAppUrl(buildOrderMessage(order))

    setWhatsAppUrl(url)
    setSuccess(true)
    setValues(EMPTY_FORM)
    setErrors({})
    onProductChange?.('')
    setSubmitting(false)

    // Same-tab navigation, so it is never caught by a popup blocker. The
    // success panel also renders a manual link as a belt-and-braces fallback.
    window.location.href = url
  }

  // Pricing shown next to the dropdown and in the summary block below it.
  const unitPrice = activeProduct ? getUnitPrice(activeProduct) : null
  const unitPriceLabel = unitPrice !== null ? formatPrice(unitPrice) : null
  const orderQuantity = Number(values.quantity) || 0
  const totalLabel =
    unitPrice !== null && orderQuantity > 0 ? formatPrice(unitPrice * orderQuantity) : null

  return (
    <section
      id="order"
      className="scroll-mt-32 border-t border-sand/60 bg-cream/40 py-20 sm:py-24"
    >
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal
            as="p"
            className="text-xs font-semibold tracking-[0.18em] text-sage-600 uppercase"
          >
            Place your order
          </Reveal>
          {/* tabIndex -1 so "Order" buttons can move focus here without a visible tab stop */}
          <Reveal
            as="h2"
            delay={60}
            id="order-heading"
            tabIndex={-1}
            className="mt-4 text-4xl sm:text-5xl"
          >
            Tell us where to send it
          </Reveal>
          <Reveal as="p" delay={120} className="mt-4 text-lg leading-relaxed text-ink-soft">
            No account needed. Share a few details and our team will confirm your order and
            payment with you.
          </Reveal>
        </div>

        <Reveal
          delay={160}
          className="mx-auto mt-12 max-w-3xl rounded-[2rem] border border-sand/80 bg-ivory p-6 shadow-soft sm:p-10"
        >
          {/* Status region: announced to screen readers on submit */}
          <div aria-live="polite" className="empty:hidden">
            {success && (
              <div className="mb-8 rounded-2xl border border-sage-200 bg-sage-50 px-4 py-4 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="mt-0.5 size-5 shrink-0 text-sage-600" />
                  <p className="text-sage-800">
                    <strong className="font-semibold">Thanks! Your order has been received</strong>{' '}
                    — we&rsquo;re opening a chat so you can confirm it with our team.
                  </p>
                </div>

                {/* Fallback: a real anchor, so it works even if the auto-redirect didn't. */}
                {whatsAppUrl && (
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-4 ml-8 inline-flex items-center gap-2 rounded-full bg-sage-600 px-5 py-2.5 text-sm font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-sage-700"
                  >
                    <WhatsAppIcon className="size-4" />
                    Continue to chat
                  </a>
                )}
              </div>
            )}
            {submitError && (
              <div
                role="alert"
                className="mb-8 flex items-start gap-3 rounded-2xl border border-blush-200 bg-blush-50 px-4 py-4 text-sm"
              >
                <AlertIcon className="mt-0.5 size-5 shrink-0 text-blush-500" />
                <p className="text-ink-soft">{submitError}</p>
              </div>
            )}
          </div>

          <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
            {/* Full name */}
            <Field id={fieldId('fullName')} label="Full name" error={errors.fullName}>
              <input
                id={fieldId('fullName')}
                name="fullName"
                type="text"
                value={values.fullName}
                onChange={handleChange}
                autoComplete="name"
                placeholder="Ananya Sharma"
                required
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? `${fieldId('fullName')}-error` : undefined}
                className={`${CONTROL_CLASSES} ${
                  errors.fullName ? 'border-blush-300' : 'border-sand hover:border-sage-300'
                }`}
              />
            </Field>

            {/* Phone */}
            <Field
              id={fieldId('phone')}
              label="Phone number"
              error={errors.phone}
              hint="We'll call or WhatsApp to confirm."
            >
              <input
                id={fieldId('phone')}
                name="phone"
                type="tel"
                inputMode="tel"
                value={values.phone}
                onChange={handleChange}
                autoComplete="tel"
                placeholder="+91 98765 43210"
                required
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={
                  errors.phone ? `${fieldId('phone')}-error` : `${fieldId('phone')}-hint`
                }
                className={`${CONTROL_CLASSES} ${
                  errors.phone ? 'border-blush-300' : 'border-sand hover:border-sage-300'
                }`}
              />
            </Field>

            {/* Address */}
            <Field
              id={fieldId('address')}
              label="Delivery address"
              error={errors.address}
              className="sm:col-span-2"
            >
              <textarea
                id={fieldId('address')}
                name="address"
                rows={3}
                value={values.address}
                onChange={handleChange}
                autoComplete="street-address"
                placeholder="Flat / house no, street, landmark, city, state, PIN code"
                required
                aria-invalid={Boolean(errors.address)}
                aria-describedby={errors.address ? `${fieldId('address')}-error` : undefined}
                className={`${CONTROL_CLASSES} resize-y ${
                  errors.address ? 'border-blush-300' : 'border-sand hover:border-sage-300'
                }`}
              />
            </Field>

            {/* Product */}
            <Field
              id={fieldId('productName')}
              label="Product"
              error={errors.productName}
              hint={
                unitPriceLabel && unitPriceLabel !== PRICE_PLACEHOLDER
                  ? `Unit price ${unitPriceLabel}`
                  : undefined
              }
            >
              <select
                id={fieldId('productName')}
                name="productName"
                value={values.productName}
                onChange={handleChange}
                required
                aria-invalid={Boolean(errors.productName)}
                aria-describedby={
                  errors.productName ? `${fieldId('productName')}-error` : undefined
                }
                className={`${CONTROL_CLASSES} appearance-none bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-11 ${
                  errors.productName ? 'border-blush-300' : 'border-sand hover:border-sage-300'
                }`}
                style={{
                  // Inline chevron so the select matches the inputs across browsers.
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237c8377' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                }}
              >
                <option value="">Select a product…</option>
                {groupedProducts.map(([category, items]) => (
                  <optgroup key={category} label={category}>
                    {items.map((product) => (
                      <option key={product.id ?? product.name} value={product.name}>
                        {product.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </Field>

            {/* Quantity */}
            <Field id={fieldId('quantity')} label="Quantity" error={errors.quantity}>
              <input
                id={fieldId('quantity')}
                name="quantity"
                type="number"
                inputMode="numeric"
                min="1"
                max={MAX_QUANTITY}
                step="1"
                value={values.quantity}
                onChange={handleChange}
                required
                aria-invalid={Boolean(errors.quantity)}
                aria-describedby={errors.quantity ? `${fieldId('quantity')}-error` : undefined}
                className={`${CONTROL_CLASSES} ${
                  errors.quantity ? 'border-blush-300' : 'border-sand hover:border-sage-300'
                }`}
              />
            </Field>

            {/* Live price summary — appears once a product is chosen */}
            {activeProduct && unitPrice !== null && (
              <div
                aria-live="polite"
                className="sm:col-span-2 rounded-2xl border border-sage-200 bg-sage-50 px-5 py-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="text-sm font-medium text-ink">{activeProduct.name}</p>
                  <p className="text-2xl font-semibold text-sage-700">{unitPriceLabel}</p>
                </div>
                {orderQuantity > 1 && (
                  <p className="mt-2 border-t border-sage-200 pt-2 text-sm text-ink-soft">
                    {unitPriceLabel} × {orderQuantity} ={' '}
                    <strong className="font-semibold text-ink">{totalLabel}</strong>
                  </p>
                )}
              </div>
            )}

            {/* Submit */}
            <div className="mt-2 flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-muted sm:max-w-xs">
                By joining, you agree to be contacted about this order. We never share your
                details.
              </p>

              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sage-600 px-8 py-3.5 text-base font-semibold text-ivory shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-sage-700 hover:shadow-lift disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-sage-400 disabled:shadow-none"
              >
                {submitting ? (
                  <>
                    <SpinnerIcon className="size-5" />
                    Joining…
                  </>
                ) : (
                  'Join Now'
                )}
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

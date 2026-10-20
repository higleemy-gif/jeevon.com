import ProductImage from './ProductImage'
import { formatUnitPrice, PRICE_PLACEHOLDER } from '../lib/format'
import { ArrowRightIcon, CheckCircleIcon } from './icons'

/** Sage for skincare, blush for healthcare — keeps the tags instantly scannable. */
const CATEGORY_STYLES = {
  Skincare: 'bg-sage-100 text-sage-700 ring-sage-200',
  Healthcare: 'bg-blush-100 text-blush-500 ring-blush-200',
}

/**
 * One product in the grid.
 *
 * @param {object} props
 * @param {{id: string, name: string, description?: string, category: string, price?: number|null, image_url?: string|null}} props.product
 * @param {number} props.index       Position in the grid (varies placeholder art + stagger).
 * @param {boolean} props.isSelected Whether this product is the one in the order form.
 * @param {(product: object) => void} props.onSelect
 */
export default function ProductCard({ product, index, isSelected, onSelect }) {
  const price = formatUnitPrice(product)
  const hasPrice = price !== PRICE_PLACEHOLDER
  const tagStyle = CATEGORY_STYLES[product.category] ?? 'bg-cream text-ink-soft ring-sand'

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border bg-ivory transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${
        isSelected
          ? 'border-sage-400 shadow-lift ring-1 ring-sage-300'
          : 'border-sand/80 shadow-soft'
      }`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-cream">
        <div className="size-full transition-transform duration-500 group-hover:scale-[1.04]">
          <ProductImage product={product} index={index} />
        </div>

        <span
          className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${tagStyle}`}
        >
          {product.category}
        </span>

        {isSelected && (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-sage-600 px-3 py-1 text-xs font-semibold text-ivory">
            <CheckCircleIcon className="size-3.5" />
            Selected
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl leading-snug">{product.name}</h3>

        {product.description && (
          <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-soft">
            {product.description}
          </p>
        )}

        <div className="mt-6 flex items-end justify-between gap-4">
          {/* Price comes from the products table — edit it there, not in code. */}
          <p className={hasPrice ? 'text-lg font-semibold text-ink' : 'text-sm text-muted italic'}>
            {price}
          </p>

          <button
            type="button"
            onClick={() => onSelect(product)}
            aria-label={`Order ${product.name} — select it in the order form`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-sage-600 px-5 py-2.5 text-sm font-semibold text-ivory transition-all duration-300 hover:bg-sage-700 hover:shadow-soft"
          >
            {isSelected ? 'Selected' : 'Order'}
            <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </article>
  )
}

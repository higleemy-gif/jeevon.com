/**
 * Product visual.
 *
 * If a product has an `image_url` we render it. Otherwise we draw a soft,
 * on-brand SVG illustration so the grid looks finished before you upload real
 * photography. Drop your photos in /public (e.g. /products/serum.jpg) or point
 * `image_url` at a CDN / Supabase Storage URL and these go away automatically.
 */

/** Three illustrated silhouettes, picked deterministically per card. */
const SHAPES = ['dropper', 'jar', 'capsules']

/** Accent pairs so adjacent cards don't look identical. */
const TINTS = [
  { from: '#e3eadf', to: '#c7d6c2', object: '#577256', cap: '#374835' }, // sage
  { from: '#f8e8e1', to: '#f0d2c6', object: '#c4796a', cap: '#8f4f42' }, // blush
  { from: '#f5f1ea', to: '#e9e2d6', object: '#6e8a6c', cap: '#2b382a' }, // sand
]

function Dropper({ object, cap }) {
  return (
    <g>
      <rect x="78" y="74" width="44" height="86" rx="12" fill={object} opacity="0.92" />
      <rect x="90" y="56" width="20" height="22" rx="4" fill={cap} />
      <rect x="86" y="46" width="28" height="12" rx="6" fill={cap} />
      {/* label */}
      <rect x="86" y="100" width="28" height="36" rx="4" fill="#fcfaf7" opacity="0.85" />
      <path d="M93 112h14M93 120h10" stroke={object} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  )
}

function Jar({ object, cap }) {
  return (
    <g>
      <rect x="66" y="96" width="68" height="62" rx="16" fill={object} opacity="0.92" />
      <rect x="60" y="78" width="80" height="24" rx="10" fill={cap} />
      <rect x="82" y="118" width="36" height="26" rx="4" fill="#fcfaf7" opacity="0.85" />
      <path d="M90 128h20M90 136h13" stroke={object} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  )
}

function Capsules({ object, cap }) {
  return (
    <g>
      <rect x="72" y="80" width="56" height="80" rx="14" fill={object} opacity="0.92" />
      <rect x="86" y="62" width="28" height="20" rx="5" fill={cap} />
      <rect x="82" y="104" width="36" height="40" rx="4" fill="#fcfaf7" opacity="0.85" />
      <circle cx="94" cy="118" r="4.5" fill={object} />
      <circle cx="107" cy="118" r="4.5" fill={object} />
      <path d="M90 132h20" stroke={object} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  )
}

const SHAPE_COMPONENTS = { dropper: Dropper, jar: Jar, capsules: Capsules }

/**
 * @param {object} props
 * @param {{name: string, image_url?: string|null}} props.product
 * @param {number} [props.index=0] Card position, used to vary the artwork.
 * @param {string} [props.className]
 */
export default function ProductImage({ product, index = 0, className = '' }) {
  if (product.image_url) {
    return (
      <img
        src={product.image_url}
        alt={product.name}
        loading="lazy"
        decoding="async"
        className={`size-full object-cover ${className}`}
      />
    )
  }

  const tint = TINTS[index % TINTS.length]
  const Shape = SHAPE_COMPONENTS[SHAPES[index % SHAPES.length]]
  const gradientId = `product-bg-${index}`

  return (
    <svg
      viewBox="0 0 200 200"
      className={`size-full ${className}`}
      role="img"
      aria-label={`${product.name} — placeholder illustration`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={tint.from} />
          <stop offset="100%" stopColor={tint.to} />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#${gradientId})`} />
      {/* soft halo behind the product */}
      <circle cx="100" cy="104" r="62" fill="#fcfaf7" opacity="0.45" />
      <Shape object={tint.object} cap={tint.cap} />
      {/* ground shadow */}
      <ellipse cx="100" cy="166" rx="42" ry="6" fill={tint.cap} opacity="0.14" />
    </svg>
  )
}

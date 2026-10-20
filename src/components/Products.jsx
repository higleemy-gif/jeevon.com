import ProductCard from './ProductCard'
import Reveal from './Reveal'

/** Placeholder cards shown while the Supabase query is in flight. */
function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-sand/80 bg-ivory shadow-soft">
      <div className="aspect-square animate-pulse bg-cream" />
      <div className="space-y-3 p-6">
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-cream" />
        <div className="h-3 w-full animate-pulse rounded-full bg-cream" />
        <div className="h-3 w-4/5 animate-pulse rounded-full bg-cream" />
        <div className="mt-4 h-10 w-full animate-pulse rounded-full bg-cream" />
      </div>
    </div>
  )
}

/**
 * Responsive product grid: 1 column on mobile, 2 on tablet, 3 on desktop.
 *
 * @param {object} props
 * @param {Array} props.products
 * @param {boolean} props.loading
 * @param {string|null} props.selectedProductName
 * @param {(product: object) => void} props.onSelectProduct
 */
export default function Products({ products, loading, selectedProductName, onSelectProduct }) {
  return (
    <section id="products" className="scroll-mt-24 border-t border-sand/60 bg-cream/40 py-20 sm:py-24">
      <div className="container-page">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <Reveal
            as="p"
            className="text-xs font-semibold tracking-[0.18em] text-sage-600 uppercase"
          >
            The range
          </Reveal>
          <Reveal as="h2" delay={60} className="mt-4 text-4xl sm:text-5xl">
            Everything in one calm routine
          </Reveal>
          <Reveal as="p" delay={120} className="mt-4 text-lg leading-relaxed text-ink-soft">
            Six essentials across skincare and healthcare. Pick one to pre-fill the order form —
            we will confirm every detail with you before dispatch.
          </Reveal>
        </div>

        {/* Grid */}
        <div className="mt-12 grid gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {loading
            ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
            : products.map((product, index) => (
                <Reveal key={product.id ?? product.name} delay={(index % 3) * 90} className="h-full">
                  <ProductCard
                    product={product}
                    index={index}
                    isSelected={selectedProductName === product.name}
                    onSelect={onSelectProduct}
                  />
                </Reveal>
              ))}
        </div>
      </div>
    </section>
  )
}

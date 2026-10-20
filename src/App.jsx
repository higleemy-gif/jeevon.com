import { useCallback, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Products from './components/Products'
import Benefits from './components/Benefits'
import OrderForm from './components/OrderForm'
import Footer from './components/Footer'
import { useProducts } from './hooks/useProducts'

export default function App() {
  const { products, loading } = useProducts()

  // The single source of truth linking the grid to the order form.
  const [selectedProductName, setSelectedProductName] = useState('')

  /**
   * Fired by a product card: remember the choice, scroll to the order section,
   * and move focus to its heading so keyboard/screen-reader users follow along.
   */
  const handleSelectProduct = useCallback((product) => {
    setSelectedProductName(product.name)

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    document.getElementById('order')?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })

    // preventScroll keeps the smooth scroll above from being cut short.
    document.getElementById('order-heading')?.focus({ preventScroll: true })
  }, [])

  return (
    <>
      {/* Skip link: first tab stop, visible only when focused */}
      <a
        href="#products"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-sage-600 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ivory"
      >
        Skip to products
      </a>

      <Header />

      <main>
        <Hero />

        <Products
          products={products}
          loading={loading}
          selectedProductName={selectedProductName}
          onSelectProduct={handleSelectProduct}
        />

        <Benefits />

        <OrderForm
          products={products}
          selectedProductName={selectedProductName}
          onProductChange={setSelectedProductName}
        />
      </main>

      <Footer />
    </>
  )
}

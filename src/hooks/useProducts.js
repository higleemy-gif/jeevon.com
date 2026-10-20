import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { FALLBACK_PRODUCTS } from '../data/products'

/**
 * Loads the catalogue from the Supabase `products` table.
 *
 * Strategy: read from the table (so you can edit products in Studio without a
 * redeploy), but never let a missing/unreachable backend blank out the page —
 * if the query fails we fall back to the local array silently. The returned
 * `usingFallback` / `error` values are available if you ever want to surface it.
 *
 * @returns {{products: Array, loading: boolean, usingFallback: boolean, error: string|null}}
 */
export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!isSupabaseConfigured) {
        if (!cancelled) {
          setProducts(FALLBACK_PRODUCTS)
          setUsingFallback(true)
          setError('Supabase env vars are not set.')
          setLoading(false)
        }
        return
      }

      const { data, error: queryError } = await supabase
        .from('products')
        .select('id, name, description, category, price, image_url')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true })

      if (cancelled) return

      if (queryError || !data?.length) {
        setProducts(FALLBACK_PRODUCTS)
        setUsingFallback(true)
        setError(
          queryError?.message ??
            'No active rows in the products table — showing sample products.',
        )
      } else {
        setProducts(data)
        setUsingFallback(false)
        setError(null)
      }

      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { products, loading, usingFallback, error }
}

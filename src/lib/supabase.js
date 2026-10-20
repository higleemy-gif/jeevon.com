import { createClient } from '@supabase/supabase-js'

/**
 * Supabase browser client.
 *
 * Point VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY at your local instance in
 * `.env.local` (see `.env.example`). Vite only exposes `VITE_`-prefixed vars to
 * the browser, which is exactly what we want: the anon key is public by design
 * and the real protection lives in the RLS policies in
 * `supabase/migrations/20261020000000_init.sql`.
 */
const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

/** True when both env vars are present, so the UI can degrade gracefully. */
export const isSupabaseConfigured = Boolean(url && anonKey)

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[Jeevon] Supabase is not configured. Copy .env.example to .env.local and ' +
      'set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart the dev server.',
  )
}

// `createClient` throws on an empty URL, so only build it when configured.
export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        // Public storefront: no sessions to keep or refresh.
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null

import { createClient } from '@supabase/supabase-js'

/**
 * Service-role Supabase client for privileged server-side operations.
 * NEVER expose this client to the browser. NEVER import it in client components.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  )
}

import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { env } from "@/lib/env"
import type { Database } from "@/lib/types/database"

export function createPublicClient() {
  return createSupabaseClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

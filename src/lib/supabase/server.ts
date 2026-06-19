import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

export function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error("Supabase environment variables are not configured")
  }

  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false },
  })
}

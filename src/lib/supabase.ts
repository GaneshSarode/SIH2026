import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * SUPABASE CLIENT
 * 
 * Uses the anon key (public, read-only via RLS).
 * If credentials are missing, returns null and the app falls back to mock data.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase: SupabaseClient | null = 
  (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder'))
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}

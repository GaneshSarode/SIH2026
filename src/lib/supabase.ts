import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * SUPABASE CLIENT
 * 
 * Uses the anon key (public, read-only via RLS).
 * If credentials are missing, returns null and the app falls back to mock data.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let client: SupabaseClient | null = null;
try {
  if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
    client = createClient(supabaseUrl, supabaseKey);
  }
} catch (e) {
  console.warn("Supabase initialization skipped: Invalid URL format");
}
export const supabase = client;

export function isSupabaseConfigured(): boolean {
  return false;
}

import { createClient } from '@supabase/supabase-js'

/**
 * SUPABASE SETUP INSTRUCTIONS
 * ---------------------------
 * 1. Create a project at https://supabase.com
 * 2. Get your Project URL and anon key from Project Settings -> API
 * 3. Create a `.env.local` file in the root of this project and add:
 * 
 * NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
 * NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
 * 
 * NOTE: If these variables are missing, the client will fall back to dummy values
 * to prevent crashes during the initial UI-only development phase.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://nsysvbhfzbomwglmhzus.supabase.co', import.meta.env.VITE_SUPABASE_KEY)

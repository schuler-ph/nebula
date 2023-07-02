import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://nsysvbhfzbomwglmhzus.supabase.co', process.env.SUPABASE_KEY!)
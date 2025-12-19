
import { createClient } from '@supabase/supabase-js';
import { getEnv } from '../utils/env';

const supabaseUrl = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_KEY') || getEnv('VITE_SUPABASE_KEY');

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️ AUTH_WARNING: Supabase credentials missing. Operating in MOCK_ONLY mode.");
}

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'ospi-auth-session'
      }
    })
  : null;

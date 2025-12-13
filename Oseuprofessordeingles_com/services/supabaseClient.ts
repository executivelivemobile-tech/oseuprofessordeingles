
import { createClient } from '@supabase/supabase-js';
import { getEnv } from '../utils/env';

const supabaseUrl = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_KEY') || getEnv('VITE_SUPABASE_KEY');

let client: any = null;

if (supabaseUrl && supabaseKey) {
    try {
        client = createClient(supabaseUrl, supabaseKey);
    } catch (error) {
        console.error("Failed to initialize Supabase client:", error);
    }
} else {
    console.warn("Supabase credentials missing. App running in Mock Mode.");
}

export const supabase = client;

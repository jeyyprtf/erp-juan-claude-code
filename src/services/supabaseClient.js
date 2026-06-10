import { createClient } from '@supabase/supabase-js';

const getSupabaseUrl = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!envUrl) return '';
  // If running in browser and pointing directly to the hosted Supabase domain,
  // route via same-origin proxy to bypass ISP network blocks.
  if (typeof window !== 'undefined' && envUrl.includes('supabase.co')) {
    return window.location.origin + '/supabase';
  }
  return envUrl;
};

const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

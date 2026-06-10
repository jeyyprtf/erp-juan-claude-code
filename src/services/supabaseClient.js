import { createClient } from '@supabase/supabase-js';

const getSupabaseUrl = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!envUrl) return '';
  // If running in browser and pointing directly to the hosted Supabase domain,
  // route via same-origin proxy to bypass ISP network blocks.
  if (typeof window !== 'undefined' && envUrl.includes('supabase.co')) {
    return window.location.origin + '/db';
  }
  return envUrl;
};

const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const customFetch = (url, options) => {
  let targetUrl = url;
  if (typeof window !== 'undefined' && typeof url === 'string') {
    // Obfuscate standard sub-paths to bypass browser adblockers and privacy filters
    targetUrl = url
      .replace('/auth/v1/', '/a/')
      .replace('/rest/v1/', '/r/');
  }
  return fetch(targetUrl, options);
};

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: customFetch
      }
    }) 
  : null;

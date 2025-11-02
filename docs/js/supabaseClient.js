// js/supabaseClient.js  (PURE JS, no <script> tags)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

if (!window.ENV_SUPABASE_URL || !window.ENV_SUPABASE_ANON_KEY) {
  console.warn('Set ENV_SUPABASE_URL and ENV_SUPABASE_ANON_KEY before loading supabaseClient.js');
}

window.supabase = createClient(
  window.ENV_SUPABASE_URL,
  window.ENV_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true } }
);



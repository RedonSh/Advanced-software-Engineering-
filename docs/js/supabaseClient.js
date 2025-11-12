// supabaseClient.js
// Tiny UMD loader + client init. Set ENV in each HTML before including this file:
//   window.ENV_SUPABASE_URL = 'https://bhqeasmtrdfqncliipki.supabase.co/';
//   window.ENV_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJocWVhc210cmRmcW5jbGlpcGtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzQ4NzgsImV4cCI6MjA3NzY1MDg3OH0.249y8yGBYKgcvnoKkdTft94Mu74kbO_Ioso2HFrTFpg';

(function () {
  if (!window.ENV_SUPABASE_URL || !window.ENV_SUPABASE_KEY) {
    console.warn('[supabase] ENV not set; cloud features disabled (fallback to local).');
    return;
  }
  if (window.supabase && window.supabase.createClient) {
    window.supabase = window.supabase.createClient(
      window.ENV_SUPABASE_URL,
      window.ENV_SUPABASE_KEY,
      { auth: { persistSession: true, autoRefreshToken: true } }
    );
    return;
  }
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';
  s.onload = () => {
    window.supabase = window.supabase.createClient(
      window.ENV_SUPABASE_URL,
      window.ENV_SUPABASE_KEY,
      { auth: { persistSession: true, autoRefreshToken: true } }
    );
  };
  document.head.appendChild(s);
})();

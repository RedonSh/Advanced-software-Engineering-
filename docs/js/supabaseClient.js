<script>
// Create a single Supabase client that pages can share.
// Set these BEFORE loading this file (in a small inline script) or hardcode here.
window.ENV_SUPABASE_URL  = window.ENV_SUPABASE_URL  || ''; // e.g. 'https://xxxx.supabase.co'
window.ENV_SUPABASE_KEY  = window.ENV_SUPABASE_KEY  || ''; // anon public key

;(function(){
  if (!window.ENV_SUPABASE_URL || !window.ENV_SUPABASE_KEY) {
    console.warn('[supabase] ENV not set; site will use local seed fallback.');
    return;
  }
  // Minimal / esm-less loader
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';
  s.onload = () => {
    window.supabase = window.supabase || window.supabase.createClient(
      window.ENV_SUPABASE_URL,
      window.ENV_SUPABASE_KEY,
      { auth: { persistSession: true, autoRefreshToken: true } }
    );
  };
  document.head.appendChild(s);
})();
</script>

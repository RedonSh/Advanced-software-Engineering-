/* =========================================================================
   common.js — core helpers for RecipeSite
   - Recipes: Supabase
   - Favourites: localStorage + (if logged in) Supabase "user_favorites"
   - Pantry: localStorage (for now)
   ========================================================================= */

const $$  = (s, c=document)=>c.querySelector(s);
const onReady = (fn)=>document.readyState!=='loading'
  ? fn() : document.addEventListener('DOMContentLoaded', fn);

/* -------------------------------------------------------------------------
   FAVOURITES (local + per-user in Supabase)
   ------------------------------------------------------------------------- */

const FAV_KEY = 'fav_recipes';     // localStorage key
let currentUserId = null;          // Supabase auth user id
let authSyncStarted = false;

/** Read favourite IDs from localStorage as a Set<string> */
function getFavSet() {
  const raw = localStorage.getItem(FAV_KEY) || '[]';
  try {
    return new Set(JSON.parse(raw).map(String));
  } catch {
    return new Set();
  }
}

/** Save favourite IDs to localStorage */
function saveFavSet(set) {
  localStorage.setItem(FAV_KEY, JSON.stringify([...set]));
}

/**
 * Toggle favourite locally and (if logged in) in Supabase "user_favorites".
 * Returns: boolean = new favourited state.
 */
async function toggleFav(recipeId) {
  const id = String(recipeId);
  const favs = getFavSet();
  const wasFav = favs.has(id);

  // Toggle local state first for instant UI feedback
  if (wasFav) favs.delete(id);
  else favs.add(id);
  saveFavSet(favs);

  // Sync with Supabase if user is logged in
  if (currentUserId && window.supabase && supabase.from) {
    try {
      if (wasFav) {
        // Remove from remote
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', currentUserId)
          .eq('recipe_id', id);
      } else {
        // Add to remote (avoid duplicates with unique constraint)
        await supabase
          .from('user_favorites')
          .upsert(
            { user_id: currentUserId, recipe_id: id },
            { onConflict: 'user_id,recipe_id', ignoreDuplicates: true }
          );
      }
    } catch (e) {
      console.warn('[favorites] remote sync failed:', e?.message || e);
      // We do NOT undo the local change – UI should still feel responsive
    }
  }

  return !wasFav;
}

/**
 * Called when auth state changes.
 * - Sets currentUserId
 * - If logging in, syncs favourites between localStorage and Supabase.
 */
function setCurrentUser(user) {
  const newId = user?.id || null;
  if (newId === currentUserId) return; // nothing to do

  currentUserId = newId;

  if (currentUserId) {
    // User just logged in or session restored → sync favourites
    syncFavouritesFromRemote().catch(err => {
      console.warn('[favorites] syncFavouritesFromRemote error:', err?.message || err);
    });
  }
}

/**
 * Sync favourites when a user logs in:
 * 1. Load remote favourites from Supabase
 * 2. Merge with local favourites
 * 3. Save merged set to localStorage
 * 4. Upsert any local-only favourites back to Supabase
 */
async function syncFavouritesFromRemote() {
  if (!currentUserId || !window.supabase || !supabase.from) return;

  // 1. Fetch remote IDs
  const { data, error } = await supabase
    .from('user_favorites')
    .select('recipe_id')
    .eq('user_id', currentUserId);

  if (error) {
    console.warn('[favorites] fetch remote error:', error.message);
    return;
  }

  const remoteSet = new Set((data || []).map(row => String(row.recipe_id)));
  const localSet  = getFavSet();

  // 2. Merge
  const merged = new Set([...localSet, ...remoteSet]);
  saveFavSet(merged);

  // 3. Upsert any local-only into Supabase
  const toInsert = [...merged].filter(id => !remoteSet.has(id));
  if (toInsert.length) {
    try {
      await supabase
        .from('user_favorites')
        .upsert(
          toInsert.map(id => ({
            user_id: currentUserId,
            recipe_id: id
          })),
          { onConflict: 'user_id,recipe_id', ignoreDuplicates: true }
        );
    } catch (e) {
      console.warn('[favorites] upsert merged error:', e?.message || e);
    }
  }
}

/**
 * Initialise auth listener once, so we know which user is logged in and can
 * sync favourites for them.
 *
 * This runs on ANY page that:
 *  - includes Supabase
 *  - and loads this common.js
 */
function initAuthFavouriteSync() {
  if (authSyncStarted) return;
  if (!window.supabase || !supabase.auth) {
    // Supabase not ready yet; try again shortly
    setTimeout(initAuthFavouriteSync, 150);
    return;
  }

  authSyncStarted = true;

  // Initial user (if already logged in)
  supabase.auth.getUser()
    .then(({ data, error }) => {
      if (error) {
        console.warn('[favorites] getUser error:', error.message);
        return;
      }
      if (data?.user) {
        // Logged-in session on page load
        setCurrentUser(data.user);
      }
    })
    .catch(e => console.warn('[favorites] getUser catch:', e?.message || e));

  // React to auth changes
  supabase.auth.onAuthStateChange((event, session) => {
    const user = session?.user || null;

    if (event === 'SIGNED_OUT') {
      // User explicitly logged out → clear user + local favourites
      currentUserId = null;
      saveFavSet(new Set());     // 👈 wipes fav_recipes in localStorage
      return;
    }

    // For sign-in / token refresh / initial session with user
    if (user) {
      setCurrentUser(user);
    }
  });
}


/* Start auth-favourites sync as soon as this file runs */
initAuthFavouriteSync();

/* -------------------------------------------------------------------------
   PANTRY (local only, for now)
   ------------------------------------------------------------------------- */

function pantryList() {
  return JSON.parse(localStorage.getItem('pantry') || '[]');
}
function pantryAdd(item) {
  const p = pantryList();
  p.push(item);
  localStorage.setItem('pantry', JSON.stringify(p));
}
function pantryUpdate(i, item) {
  const p = pantryList();
  p[i] = item;
  localStorage.setItem('pantry', JSON.stringify(p));
}
function pantryDelete(i) {
  const p = pantryList();
  p.splice(i, 1);
  localStorage.setItem('pantry', JSON.stringify(p));
}

/* -------------------------------------------------------------------------
   Supabase recipe helpers
   ------------------------------------------------------------------------- */

function assertClient() {
  if (!window.supabase) {
    throw new Error('Supabase client not present. Ensure ENV URL/KEY and SDK load order.');
  }
  if (!window.ENV_SUPABASE_URL || !window.ENV_SUPABASE_KEY) {
    throw new Error('ENV_SUPABASE_URL/ENV_SUPABASE_KEY missing.');
  }
}

async function dbListRecipes() {
  assertClient();
  const { data, error } = await supabase
    .from('recipes')
    .select(
      'id, title, category, ingredients, steps, image, ' +
      'calories, protein, carbs, fat, created_at'
    )
    .order('created_at', { ascending: false });
  if (error) throw new Error('DB listRecipes: ' + error.message);
  return data || [];
}

async function dbGetRecipeById(id) {
  assertClient();
  const { data, error } = await supabase
    .from('recipes')
    .select(
      'id, title, category, ingredients, steps, image, ' +
      'calories, protein, carbs, fat'
    )
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error('DB getRecipeById: ' + error.message);
  return data || null;
}

async function dbListCategories() {
  assertClient();
  const { data, error } = await supabase
    .from('recipes')
    .select('category');
  if (error) throw new Error('DB listCategories: ' + error.message);
  const set = new Set((data || []).map(r => r.category).filter(Boolean));
  return [...set];
}

/* -------------------------------------------------------------------------
   Expose public API on window.RecipeSite
   ------------------------------------------------------------------------- */
window.RecipeSite = {
  // favourites
  getFavSet,
  toggleFav,

  // pantry (LOCAL ONLY for now)
  pantryList,
  pantryAdd,
  pantryUpdate,
  pantryDelete,

  // recipes (DB-only)
  listRecipes: async () => {
    const rows = await dbListRecipes();
    return rows; // may be []
  },
  getRecipeById: async (id) => {
    return await dbGetRecipeById(id); // may be null
  },
  listCategories: async () => {
    return await dbListCategories();  // may be []
  }
};

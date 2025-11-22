/* =========================================================================
   common.js — core helpers for RecipeSite
   - Recipes: Supabase
   - Favourites: localStorage + (if logged in) Supabase "user_favorites"
   - Pantry: localStorage + (if logged in) Supabase "pantry"
   - Add Recipe: Supabase insert
   ========================================================================= */

const $$  = (s, c=document)=>c.querySelector(s);
const onReady = (fn)=>document.readyState!=='loading'
  ? fn() : document.addEventListener('DOMContentLoaded', fn);

/* -------------------------------------------------------------------------
   AUTH SHARED STATE
   ------------------------------------------------------------------------- */

let currentUserId = null;      // Supabase auth user id
let authSyncStarted = false;   // ensure we only hook auth once

/* -------------------------------------------------------------------------
   FAVOURITES (local + per-user)
   ------------------------------------------------------------------------- */

const FAV_KEY    = 'fav_recipes';
const PANTRY_KEY = 'pantry';

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

  // Local first
  if (wasFav) favs.delete(id);
  else favs.add(id);
  saveFavSet(favs);

  // Remote sync
  if (currentUserId && window.supabase && supabase.from) {
    try {
      if (wasFav) {
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', currentUserId)
          .eq('recipe_id', id);
      } else {
        await supabase
          .from('user_favorites')
          .upsert(
            { user_id: currentUserId, recipe_id: id },
            { onConflict: 'user_id,recipe_id', ignoreDuplicates: true }
          );
      }
    } catch (e) {
      console.warn('[favorites] remote sync failed:', e?.message || e);
    }
  }

  return !wasFav;
}

/* -------------------------------------------------------------------------
   PANTRY (local + per-user via "pantry" table)
   ------------------------------------------------------------------------- */

/**
 * Pantry item shape stored locally:
 * { id?: string|null, name: string, quantity: string, expiry?: string|null }
 */

function getPantryLocal() {
  const raw = localStorage.getItem(PANTRY_KEY) || '[]';
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function savePantryLocal(items) {
  localStorage.setItem(PANTRY_KEY, JSON.stringify(items || []));
}

/** Sync pantry from Supabase into localStorage for the current user */
async function syncPantryFromRemote() {
  if (!currentUserId || !window.supabase || !supabase.from) return;

  const { data, error } = await supabase
    .from('pantry')
    .select('id, user_id, name, quantity, expiry')
    .eq('user_id', currentUserId)
    .order('name', { ascending: true });

  if (error) {
    console.warn('[pantry] fetch remote error:', error.message);
    return;
  }

  const list = (data || []).map(row => ({
    id: row.id,
    name: row.name || '',
    quantity: row.quantity || '',
    expiry: row.expiry || null
  }));

  savePantryLocal(list);
}

/** Public pantry list used by UI (always from local view) */
function pantryList() {
  return getPantryLocal();
}

/** Add pantry item locally, and if logged in also to Supabase "pantry" */
function pantryAdd(item) {
  const items = getPantryLocal();
  const newItem = {
    id      : null,
    name    : item.name,
    quantity: item.quantity,
    expiry  : item.expiry || null
  };
  const index = items.length;
  items.push(newItem);
  savePantryLocal(items);

  if (currentUserId && window.supabase && supabase.from) {
    supabase
      .from('pantry')
      .insert({
        user_id : currentUserId,
        name    : newItem.name,
        quantity: newItem.quantity,
        expiry  : newItem.expiry
      })
      .select('id, name, quantity, expiry')
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          console.warn('[pantry] remote add error:', error?.message || error);
          return;
        }
        const latest = getPantryLocal();
        if (index < latest.length) {
          latest[index] = {
            id      : data.id,
            name    : data.name || newItem.name,
            quantity: data.quantity || newItem.quantity,
            expiry  : data.expiry || newItem.expiry
          };
          savePantryLocal(latest);
        }
      })
      .catch(e => console.warn('[pantry] remote add catch:', e?.message || e));
  }
}

/** Update pantry item at index i, locally and (if possible) remotely */
function pantryUpdate(i, item) {
  const items = getPantryLocal();
  if (i < 0 || i >= items.length) return;

  const existing = items[i];
  const updated = {
    ...existing,
    name    : item.name,
    quantity: item.quantity,
    expiry  : item.expiry || null
  };

  items[i] = updated;
  savePantryLocal(items);

  if (
    currentUserId &&
    existing &&
    existing.id &&
    window.supabase &&
    supabase.from
  ) {
    supabase
      .from('pantry')
      .update({
        name    : updated.name,
        quantity: updated.quantity,
        expiry  : updated.expiry
      })
      .eq('id', existing.id)
      .then(({ error }) => {
        if (error) console.warn('[pantry] remote update error:', error.message);
      })
      .catch(e => console.warn('[pantry] remote update catch:', e?.message || e));
  }
}

/** Delete pantry item at index i, locally and (if possible) remotely */
function pantryDelete(i) {
  const items = getPantryLocal();
  if (i < 0 || i >= items.length) return;

  const existing = items[i];
  items.splice(i, 1);
  savePantryLocal(items);

  if (
    currentUserId &&
    existing &&
    existing.id &&
    window.supabase &&
    supabase.from
  ) {
    supabase
      .from('pantry')
      .delete()
      .eq('id', existing.id)
      .then(({ error }) => {
        if (error) console.warn('[pantry] remote delete error:', error.message);
      })
      .catch(e => console.warn('[pantry] remote delete catch:', e?.message || e));
  }
}

/* -------------------------------------------------------------------------
   AUTH → sync favourites + pantry
   ------------------------------------------------------------------------- */

function setCurrentUser(user) {
  const newId = user?.id || null;
  if (newId === currentUserId) return;

  currentUserId = newId;

  if (currentUserId) {
    // User logged in / session restored
    syncFavouritesFromRemote().catch(err => {
      console.warn('[favorites] syncFavouritesFromRemote error:', err?.message || err);
    });
    syncPantryFromRemote().catch(err => {
      console.warn('[pantry] syncPantryFromRemote error:', err?.message || err);
    });
  }
}

/**
 * Sync favourites when a user logs in:
 * 1. Load remote favourites from Supabase
 * 2. Merge with local favourites
 * 3. Save merged set locally
 * 4. Upsert any local-only favourites back to Supabase
 */
async function syncFavouritesFromRemote() {
  if (!currentUserId || !window.supabase || !supabase.from) return;

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

  const merged = new Set([...localSet, ...remoteSet]);
  saveFavSet(merged);

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

/** Initialise auth listener once */
function initAuthFavouriteSync() {
  if (authSyncStarted) return;
  if (!window.supabase || !supabase.auth) {
    setTimeout(initAuthFavouriteSync, 150);
    return;
  }

  authSyncStarted = true;

  supabase.auth.getUser()
    .then(({ data, error }) => {
      if (error) {
        console.warn('[favorites] getUser error:', error.message);
        return;
      }
      if (data?.user) setCurrentUser(data.user);
    })
    .catch(e => console.warn('[favorites] getUser catch:', e?.message || e));

  supabase.auth.onAuthStateChange((event, session) => {
    const user = session?.user || null;

    if (event === 'SIGNED_OUT') {
      currentUserId = null;
      saveFavSet(new Set());
      savePantryLocal([]);
      return;
    }

    if (user) setCurrentUser(user);
  });
}

initAuthFavouriteSync();

/* -------------------------------------------------------------------------
   Supabase recipe helpers
   ------------------------------------------------------------------------- */

function assertClient() {
  if (!window.supabase) {
    throw new Error('Supabase client not present. Check HTML includes.');
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

async function dbAddRecipe(recipeData) {
  assertClient();
  const { data, error } = await supabase
    .from('recipes')
    .insert([recipeData])
    .select();
  if (error) throw new Error(error.message);
  return data ? data[0] : null;
}

/* -------------------------------------------------------------------------
   Expose public API on window.RecipeSite
   ------------------------------------------------------------------------- */

window.RecipeSite = {
  // favourites
  getFavSet,
  toggleFav,

  // pantry
  pantryList,
  pantryAdd,
  pantryUpdate,
  pantryDelete,

  // recipes
  listRecipes : () => dbListRecipes(),
  getRecipeById: (id) => dbGetRecipeById(id),
  listCategories: () => dbListCategories(),
  addRecipe: (d) => dbAddRecipe(d)
};

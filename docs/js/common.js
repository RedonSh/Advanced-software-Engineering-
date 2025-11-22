/* =========================================================================
   common.js — Core helpers for RecipeSite
   ========================================================================= */

const $$  = (s, c=document)=>c.querySelector(s);
const onReady = (fn)=>document.readyState!=='loading'
  ? fn() : document.addEventListener('DOMContentLoaded', fn);

/* -------------------------------------------------------------------------
   1. FAVOURITES (Syncs with Supabase if logged in)
   ------------------------------------------------------------------------- */
const FAV_KEY = 'fav_recipes';
let currentUserId = null;
let authSyncStarted = false;

function getFavSet() {
  try { 
    return new Set(JSON.parse(localStorage.getItem(FAV_KEY)||'[]').map(String)); 
  } catch { 
    return new Set(); 
  }
}

function saveFavSet(set) { 
  localStorage.setItem(FAV_KEY, JSON.stringify([...set])); 
}

async function toggleFav(recipeId) {
  const id = String(recipeId);
  const favs = getFavSet();
  const wasFav = favs.has(id);

  // 1. Update Local (Instant UI update)
  if (wasFav) favs.delete(id); 
  else favs.add(id);
  saveFavSet(favs);

  // 2. Update Remote (Supabase)
  if (currentUserId && window.supabase && supabase.from) {
    try {
      if (wasFav) {
        await supabase.from('user_favorites')
          .delete()
          .eq('user_id', currentUserId)
          .eq('recipe_id', id);
      } else {
        await supabase.from('user_favorites')
          .upsert(
            { user_id: currentUserId, recipe_id: id }, 
            { onConflict: 'user_id,recipe_id', ignoreDuplicates: true }
          );
      }
    } catch (e) { 
      console.warn('Sync error', e); 
    }
  }
  return !wasFav;
}

// Auth Listener to sync favorites on login
function setCurrentUser(user) {
  const newId = user?.id || null;
  if (newId === currentUserId) return;
  
  currentUserId = newId;
  if (currentUserId) syncFavouritesFromRemote();
}

async function syncFavouritesFromRemote() {
  if (!currentUserId || !window.supabase) return;
  
  // Get remote favorites
  const { data } = await supabase.from('user_favorites')
    .select('recipe_id')
    .eq('user_id', currentUserId);
    
  const remoteSet = new Set((data || []).map(r => String(r.recipe_id)));
  const localSet = getFavSet();
  
  // Merge both
  const merged = new Set([...localSet, ...remoteSet]);
  saveFavSet(merged);
  
  // Upload any local ones that weren't in the cloud
  const toInsert = [...merged].filter(id => !remoteSet.has(id));
  if (toInsert.length) {
    await supabase.from('user_favorites')
      .upsert(
        toInsert.map(id => ({ user_id: currentUserId, recipe_id: id })), 
        { ignoreDuplicates: true }
      );
  }
}

function initAuthFavouriteSync() {
  // Wait for Supabase to load
  if (!window.supabase) { 
    setTimeout(initAuthFavouriteSync, 150); 
    return; 
  }
  if (authSyncStarted) return;
  
  authSyncStarted = true;
  
  // Check session now
  supabase.auth.getUser().then(({ data }) => setCurrentUser(data?.user)).catch(()=>{});
  
  // Listen for login/logout
  supabase.auth.onAuthStateChange((_e, session) => setCurrentUser(session?.user));
}
initAuthFavouriteSync();

/* -------------------------------------------------------------------------
   2. PANTRY (Local Storage Only)
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
   3. DATABASE HELPERS (Recipes)
   ------------------------------------------------------------------------- */
function assertClient() {
  if (!window.supabase || !window.ENV_SUPABASE_URL) {
    throw new Error('Supabase not initialized. Check your HTML includes.');
  }
}

async function dbListRecipes() {
  assertClient();
  const { data, error } = await supabase
    .from('recipes')
    .select('id, title, category, ingredients, steps, image, calories, protein, carbs, fat, created_at')
    .order('created_at', { ascending: false });
  
  if (error) throw new Error('DB listRecipes: ' + error.message);
  return data || [];
}

async function dbGetRecipeById(id) {
  assertClient();
  const { data, error } = await supabase
    .from('recipes')
    .select('id, title, category, ingredients, steps, image, calories, protein, carbs, fat')
    .eq('id', id)
    .maybeSingle();
    
  if (error) throw new Error('DB getRecipeById: ' + error.message);
  return data || null;
}

async function dbListCategories() {
  assertClient();
  const { data } = await supabase.from('recipes').select('category');
  const set = new Set((data||[]).map(r => r.category).filter(Boolean));
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
   4. EXPOSE PUBLIC API
   ------------------------------------------------------------------------- */
window.RecipeSite = {
  // Favourites
  getFavSet, toggleFav,
  
  // Pantry
  pantryList, pantryAdd, pantryUpdate, pantryDelete,
  
  // Database
  listRecipes: async () => await dbListRecipes(),
  getRecipeById: async (id) => await dbGetRecipeById(id),
  listCategories: async () => await dbListCategories(),
  addRecipe: async (d) => await dbAddRecipe(d)
};


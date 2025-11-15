/* =========================================================================
   common.js — DB-only core for RecipeSite (no seeds, no placeholder images)
   ========================================================================= */

const $$  = (s, c=document)=>c.querySelector(s);
const onReady = (fn)=>document.readyState!=='loading'
  ? fn() : document.addEventListener('DOMContentLoaded', fn);

/* ---------- Favourites + Pantry (local only) ---------- */
function getFavSet(){ const raw = localStorage.getItem('fav_recipes')||'[]'; return new Set(JSON.parse(raw)); }
function saveFavSet(set){ localStorage.setItem('fav_recipes', JSON.stringify([...set])); }
async function toggleFav(id){ const s=getFavSet(); s.has(id)?s.delete(id):s.add(id); saveFavSet(s); return s.has(id); }

function pantryList(){ return JSON.parse(localStorage.getItem('pantry')||'[]'); }
function pantryAdd(item){ const p=pantryList(); p.push(item); localStorage.setItem('pantry', JSON.stringify(p)); }
function pantryUpdate(i,item){ const p=pantryList(); p[i]=item; localStorage.setItem('pantry', JSON.stringify(p)); }
function pantryDelete(i){ const p=pantryList(); p.splice(i,1); localStorage.setItem('pantry', JSON.stringify(p)); }

/* ---------- Supabase helpers (strict, throw on issues) ---------- */
function assertClient() {
  if (!window.supabase) throw new Error('Supabase client not present. Ensure ENV URL/KEY and SDK load order.');
  if (!window.ENV_SUPABASE_URL || !window.ENV_SUPABASE_KEY) {
    throw new Error('ENV_SUPABASE_URL/ENV_SUPABASE_KEY missing.');
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
  const { data, error } = await supabase.from('recipes').select('category');
  if (error) throw new Error('DB listCategories: ' + error.message);
  // unique, keep 'All' at top if you add it in the UI
  const set = new Set((data||[]).map(r => r.category).filter(Boolean));
  return [...set];
}

/* ---------- Expose (no fallbacks) ---------- */
window.RecipeSite = {
  // favourites
  getFavSet, toggleFav,
  // pantry
  pantryList, pantryAdd, pantryUpdate, pantryDelete,
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

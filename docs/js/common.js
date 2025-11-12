// js/common.js — Supabase-backed reads with local seed fallback
(function(){
  const STORAGE = { user:'rs_user', favs: name => `rs_favs_${name}` };

  // ===== Local seed so site still works if cloud is misconfigured =====
  const RECIPES = [
    {
      id: 'seed-1',
      title: 'Lemon Herb Chicken',
      category: 'Dinner',
      ingredients: ['chicken breast','lemon','garlic','olive oil','thyme','salt','pepper'],
      steps: ['Marinate chicken in lemon/garlic/thyme 20 min.',
              'Sear 3–4 min per side.',
              'Bake 180°C for 10–12 min.',
              'Rest 3 min and serve.'],
      image: 'https://images.unsplash.com/photo-1604908176997-4310b86a8c8b?q=80&w=1200&auto=format&fit=crop',
      nutrition: { calories: 320, protein: 35, carbs: 4, fat: 18 }
    },
    {
      id: 'seed-2',
      title: 'Veggie Omelette',
      category: 'Breakfast',
      ingredients: ['eggs','capsicum','onion','spinach','cheese','salt','pepper','oil'],
      steps: ['Beat eggs and season.',
              'Sauté veg 2–3 min, add eggs.',
              'Cook until just set, fold and serve.'],
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200&auto=format&fit=crop',
      nutrition: { calories: 280, protein: 20, carbs: 6, fat: 20 }
    },
    {
      id: 'seed-3',
      title: 'Tofu Stir-Fry',
      category: 'Vegan',
      ingredients: ['firm tofu','broccoli','carrot','soy sauce','garlic','ginger','sesame oil'],
      steps: ['Press tofu and cube.',
              'Stir-fry veg 3–4 min.',
              'Add tofu + sauce, toss 2–3 min.'],
      image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=1200&auto=format&fit=crop',
      nutrition: { calories: 400, protein: 22, carbs: 30, fat: 20 }
    }
  ];
  const CATEGORIES = ['All','Breakfast','Lunch','Dinner','Dessert','Snack','Vegan','Vegetarian','Gluten-Free'];

  // Expose seed for other scripts to reference if DB fails
  window.__SEED = {
    listRecipes(){ return RECIPES; },
    getRecipeById(id){ return RECIPES.find(r=>String(r.id)===String(id)); },
    listCategories(){ return CATEGORIES; }
  };

  // ---------- Auth helpers ----------
  function getUser(){ try{ return JSON.parse(localStorage.getItem(STORAGE.user)); }catch{ return null; } }
  function setUser(u){ localStorage.setItem(STORAGE.user, JSON.stringify(u)); }
  async function logout(){ localStorage.removeItem(STORAGE.user); try{ await window.supabase?.auth?.signOut?.(); }catch{} }
  function requireLogin(){
    if (!getUser()){ location.href = 'index.html?next='+encodeURIComponent('recipes.html'+(location.hash||'#browse')); }
  }

  // ---------- Favourites (local for now) ----------
  function getFavSet(){
    const u=getUser(); if(!u) return new Set();
    try { return new Set(JSON.parse(localStorage.getItem(STORAGE.favs(u.name))||'[]')); }
    catch { return new Set(); }
  }
  function toggleFav(id){
    const u=getUser(); if(!u){ alert('Login first to save favourites.'); return; }
    const key=STORAGE.favs(u.name);
    const set=getFavSet();
    set.has(id)?set.delete(id):set.add(id);
    localStorage.setItem(key, JSON.stringify([...set]));
  }

  // ---------- Supabase reads ----------
  async function dbListRecipes(){
    if (!window.supabase) return null;
    const { data, error } = await supabase
      .from('recipes')
      .select('id, title, category, ingredients, steps, image, nutrition')
      .order('created_at', { ascending:false })
      .limit(500);
    if (error) { console.warn('[DB] listRecipes error:', error.message); return null; }
    return data;
  }

  async function dbGetRecipeById(id){
    if (!window.supabase) return null;
    const { data, error } = await supabase
      .from('recipes')
      .select('id, title, category, ingredients, steps, image, nutrition')
      .eq('id', id)
      .maybeSingle();
    if (error) { console.warn('[DB] getRecipeById error:', error.message); return null; }
    return data;
  }

  async function dbListCategories(){
    if (!window.supabase) return null;
    const { data, error } = await supabase
      .from('recipes')
      .select('category');
    if (error) { console.warn('[DB] listCategories error:', error.message); return null; }
    const set = new Set(data.map(d => d.category).filter(Boolean));
    return ['All', ...[...set].sort()];
  }

  // ---------- Public API (async) ----------
  async function listRecipes(){ return await dbListRecipes() || window.__SEED.listRecipes(); }
  async function getRecipeById(id){ return await dbGetRecipeById(id) || window.__SEED.getRecipeById(id); }
  async function listCategories(){ return await dbListCategories() || window.__SEED.listCategories(); }

  // ---------- expose ----------
  window.RecipeSite = {
    getUser, setUser, logout, requireLogin,
    getFavSet, toggleFav,
    listRecipes, getRecipeById, listCategories
  };
})();

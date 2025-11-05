// js/common.js — front-end data + utilities (no backend)
(function(){
  // ✅ Stay signed in check — restore user session from Supabase
  (async () => {
    const { data, error } = await supabase.auth.getUser();
    if (data?.user) {
      const username = data.user.email.split('@')[0];
      RecipeSite?.setUser?.({ name: username });
    }
  })();
  
  const STORAGE = { user:'rs_user', favs: name => `rs_favs_${name}` };

  const RECIPES = [
    { id:'r1', title:'Lemon Herb Chicken', category:'Dinner',
      ingredients:['chicken breast','lemon','garlic','olive oil','thyme','salt','pepper'],
      steps:['Marinate chicken 20 min.','Sear 3–4 min per side.','Bake 180°C 10–12 min.','Rest 3 min & serve.'],
      nutrition:{calories:320,protein:35,carbs:4,fat:18},
      image:'https://images.unsplash.com/photo-1604908176997-4310b86a8c8b?q=80&w=1200&auto=format&fit=crop'
    },
    { id:'r2', title:'Veggie Stir-fry Noodles', category:'Dinner',
      ingredients:['udon noodles','capsicum','broccoli','soy sauce','ginger','garlic','sesame oil'],
      steps:['Boil noodles.','Stir-fry vegetables.','Add sauce & toss.'],
      nutrition:{calories:410,protein:14,carbs:62,fat:12},
      image:'https://images.unsplash.com/photo-1625944529047-a47a578ebfc6?q=80&w=1200&auto=format&fit=crop'
    },
    { id:'r3', title:'Overnight Oats', category:'Breakfast',
      ingredients:['rolled oats','milk','chia seeds','honey','berries'],
      steps:['Mix all in a jar.','Chill overnight.','Top & serve.'],
      nutrition:{calories:280,protein:10,carbs:44,fat:7},
      image:'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1200&auto=format&fit=crop'
    },
    { id:'r4', title:'Avocado Toast', category:'Breakfast',
      ingredients:['sourdough','avocado','lemon','salt','pepper','chilli flakes'],
      steps:['Toast bread.','Mash avocado & spread.','Season & enjoy.'],
      nutrition:{calories:260,protein:6,carbs:28,fat:14},
      image:'https://images.unsplash.com/photo-1541516160071-7f9fcf3d6b0f?q=80&w=1200&auto=format&fit=crop'
    },
    { id:'r5', title:'Greek Salad', category:'Lunch',
      ingredients:['tomato','cucumber','red onion','feta','olives','oregano','olive oil'],
      steps:['Chop vegetables.','Toss with oil & oregano.','Top with feta & olives.'],
      nutrition:{calories:220,protein:7,carbs:10,fat:17},
      image:'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop'
    },
    { id:'r6', title:'Banana Pancakes', category:'Dessert',
      ingredients:['banana','egg','flour','milk','baking powder','maple syrup'],
      steps:['Mash banana.','Whisk batter.','Cook 2–3 min per side.'],
      nutrition:{calories:300,protein:8,carbs:52,fat:6},
      image:'https://images.unsplash.com/photo-1495216875107-c6c043eb703f?q=80&w=1200&auto=format&fit=crop'
    },
    { id:'r7', title:'Spaghetti Bolognese', category:'Dinner',
      ingredients:['spaghetti','beef mince','onion','garlic','tomato passata','olive oil','basil'],
      steps:['Brown mince with onion & garlic.','Add passata & simmer 15–20 min.','Boil pasta; toss with sauce.'],
      nutrition:{calories:540,protein:28,carbs:68,fat:16},
      image:'https://images.unsplash.com/photo-1603133872878-684f208fb86a?q=80&w=1200&auto=format&fit=crop'
    },
    { id:'r8', title:'Chickpea Coconut Curry', category:'Vegan',
      ingredients:['chickpeas','coconut milk','onion','garam masala','garlic','ginger','spinach'],
      steps:['Sauté onion, garlic, ginger.','Add spices, chickpeas, coconut milk.','Simmer 12 min; stir in spinach.'],
      nutrition:{calories:430,protein:15,carbs:38,fat:24},
      image:'https://images.unsplash.com/photo-1604908554027-54f7a6b69d3f?q=80&w=1200&auto=format&fit=crop'
    },
    { id:'r9', title:'Beef Tacos (Corn)', category:'Dinner',
      ingredients:['beef mince','taco seasoning','corn tortillas','lettuce','tomato','cheddar'],
      steps:['Cook beef with seasoning.','Warm tortillas.','Assemble with toppings.'],
      nutrition:{calories:480,protein:24,carbs:42,fat:22},
      image:'https://images.unsplash.com/photo-1601924582971-b0c5be3d5c8e?q=80&w=1200&auto=format&fit=crop'
    },
    { id:'r10', title:'Baked Salmon with Dill', category:'Dinner',
      ingredients:['salmon fillet','lemon','dill','olive oil','salt','pepper'],
      steps:['Season salmon.','Bake 200°C 10–12 min.','Finish with lemon & dill.'],
      nutrition:{calories:360,protein:30,carbs:0,fat:26},
      image:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop'
    },
    { id:'r11', title:'Caprese Sandwich', category:'Lunch',
      ingredients:['ciabatta','mozzarella','tomato','basil','balsamic glaze','olive oil'],
      steps:['Layer mozzarella & tomato.','Add basil, drizzle oil & balsamic.'],
      nutrition:{calories:420,protein:18,carbs:40,fat:20},
      image:'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200&auto=format&fit=crop'
    },
    { id:'r12', title:'Roasted Pumpkin Soup', category:'Lunch',
      ingredients:['pumpkin','onion','garlic','vegetable stock','cream','olive oil'],
      steps:['Roast pumpkin.','Blend with sautéed onion, garlic & stock.','Finish with cream.'],
      nutrition:{calories:300,protein:6,carbs:32,fat:16},
      image:'https://images.unsplash.com/photo-1604908553318-289a1b79cd13?q=80&w=1200&auto=format&fit=crop'
    },
    { id:'r13', title:'Fruit & Yogurt Parfait', category:'Breakfast',
      ingredients:['greek yogurt','berries','granola','honey'],
      steps:['Layer yogurt, berries, granola.','Drizzle honey.'],
      nutrition:{calories:260,protein:12,carbs:32,fat:8},
      image:'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=1200&auto=format&fit=crop'
    },
    { id:'r14', title:'Garlic Butter Shrimp', category:'Dinner',
      ingredients:['shrimp','garlic','butter','lemon','parsley','salt','pepper'],
      steps:['Sauté garlic in butter.','Add shrimp 2–3 min until pink.','Finish with lemon & parsley.'],
      nutrition:{calories:320,protein:28,carbs:2,fat:22},
      image:'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop'
    },
    { id:'r15', title:'Vegan Buddha Bowl', category:'Vegan',
      ingredients:['quinoa','roasted sweet potato','chickpeas','avocado','spinach','tahini dressing'],
      steps:['Cook quinoa.','Roast sweet potato & chickpeas.','Assemble bowl; drizzle tahini.'],
      nutrition:{calories:520,protein:17,carbs:64,fat:20},
      image:'https://images.unsplash.com/photo-1522184216315-dc2d766c31b1?q=80&w=1200&auto=format&fit=crop'
    },
    { id:'r16', title:'Blueberry Muffins', category:'Dessert',
      ingredients:['flour','sugar','baking powder','milk','egg','butter','blueberries'],
      steps:['Mix dry & wet separately.','Fold in berries.','Bake 190°C 18–22 min.'],
      nutrition:{calories:280,protein:5,carbs:42,fat:10},
      image:'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1200&auto=format&fit=crop'
    },
    { id:'r17', title:'Hummus & Veggie Plate', category:'Snack',
      ingredients:['hummus','carrot','cucumber','capsicum','pita (optional)'],
      steps:['Slice veg.','Serve with hummus.'],
      nutrition:{calories:220,protein:7,carbs:20,fat:12},
      image:'https://images.unsplash.com/photo-1546549039-49e0b361c08a?q=80&w=1200&auto=format&fit=crop'
    },
    { id:'r18', title:'Quinoa Feta Salad', category:'Lunch',
      ingredients:['quinoa','cherry tomatoes','cucumber','feta','parsley','lemon','olive oil'],
      steps:['Cook quinoa & cool.','Chop veg; toss with feta.','Dress with lemon & oil.'],
      nutrition:{calories:360,protein:12,carbs:42,fat:14},
      image:'https://images.unsplash.com/photo-1551183053-bf91a1b81141?q=80&w=1200&auto=format&fit=crop'
    }
  ];
  const CATEGORIES = ['All','Breakfast','Lunch','Dinner','Dessert','Snack','Vegan','Vegetarian','Gluten-Free'];

  // Auth
  function getUser(){ try{ return JSON.parse(localStorage.getItem(STORAGE.user)); }catch{ return null; } }
  function setUser(u){ localStorage.setItem(STORAGE.user, JSON.stringify(u)); }
  function logout(){ localStorage.removeItem(STORAGE.user); }
  function requireLogin(){
    if (!getUser()){ location.href = 'index.html?next='+encodeURIComponent('recipes.html'+(location.hash||'#browse')); }
  }

  // Favourites
  function getFavSet(){
    const u=getUser(); if(!u) return new Set();
    const raw=localStorage.getItem(STORAGE.favs(u.name))||'[]';
    try { return new Set(JSON.parse(raw)); } catch { return new Set(); }
  }
  function toggleFav(id){
    const u=getUser(); if(!u){ alert('Login first to save favourites.'); return; }
    const key=STORAGE.favs(u.name); const set=getFavSet();
    set.has(id)?set.delete(id):set.add(id);
    localStorage.setItem(key, JSON.stringify([...set]));
  }

  // Recipe APIs
  function listRecipes(){ return RECIPES; }
  function getRecipeById(id){ return RECIPES.find(r=>r.id===id); }
  function listCategories(){ return CATEGORIES; }

  // expose
  window.RecipeSite = { getUser,setUser,logout,requireLogin, getFavSet,toggleFav, listRecipes,getRecipeById,listCategories };
})();

# User stories – Iteration 2 (Shopping List, Save & Share, Nutrition & Healthy Swap)

---

## Priority

Note: priorities may change at different stages of the project.  
We keep all changes here for marking.

### Key Features – Estimates (Planning Poker) – Priority

(from the original planning session)

- Login Page – **1 day** – **Priority 1**
- Pantry Management – **3.6 days** – **Priority 2**
- Recipe Generator – **5.6 days** – **Priority 3**
- Nutrition Facts – **2.8 days** – **Priority 4**
- Save Favourite Recipes – **3.8 days** – **Priority 5**
- Shopping List – **3 days** – **Priority 6**
- Upload Your Own Recipes – **3.2 days** – **Priority 7**
- AI & Trust – **4 days** – **Priority 8**

### Iteration 2 focus

In **Iteration 2 (30/10/25 – 20/11/25)** we moved from just “having a working app” to **adding more value and usability** for the stakeholder by tackling:

- **Priority 6 – Shopping List** → upgraded to **Shopping List 2.0**  
- **Priority 5 – Save Favourite Recipes** → extended into **Save & Share**  
- **Priority 4 – Nutrition Facts** → implemented as nutrition summaries + health tags  

The **AI & Trust feature (Priority 8)** was deliberately **left for Iteration 3**, so that we could first stabilise the core flows around saving, sharing, and nutrition.

---

## Estimation

We used planning poker and relative sizing:

- Shopping List (originally): **3 days** – Priority 6  
- Save Favourite Recipes: **3.8 days** – Priority 5  
- Nutrition Facts: **2.8 days** – Priority 4  

Iteration 2 evolved these into:

- **Shopping List 2.0** (dedup, unit normalisation, aisle grouping, analytics) – about **4–5 days** total effort  
- **Save & Share** (save, unsave, deep links, RLS) – about **4–5 days**  
- **Nutrition & Healthy Swap (first version)** – about **3–4 days**  

Actual work also included:

- Backend schema design and RLS rules in Supabase  
- Analytics events wiring  
- Basic Healthy Swap logic and E2E testing  

So the **effective effort** for Iteration 2 user stories was higher than the raw initial planning poker numbers, but the priorities remained consistent.

---

## Assumptions (Iteration 2 specific)

- Users now have **some pantry data and recipes** already in the system from Iteration 1.  
- The stakeholder wants **more practical, day-to-day value**:
  - Smarter shopping lists (reduce over-buying, link to pantry).
  - Ability to save favourites and share with family/friends.
  - Nutrition info visible at a glance.
- AI explainability and deep “trust” features (Priority 8) can wait until:
  - Save/Share/Nutrition flows are stable.
  - Backend and RLS are solid.

---

## Description

### Description-v1 (before Iteration 2)

The app lets users log in, manage a pantry, and generate recipes from what they have. A basic shopping list and upload recipes feature exist, but they are not yet deeply connected to nutrition, saving, or sharing.

### Description-v2 (after Iteration 2)

After Iteration 2, the app:

- Provides a **Smart Shopping List 2.0** that:
  - Builds a list from selected recipes.
  - Deduplicates ingredients based on pantry inventory.
  - Normalises units and aggregates quantities.
  - Can be tracked with one-tap “Add to Cart” actions.
- Allows users to **Save & Unsave** recipes and lists, and:
  - View a **Favourites** section for quick access.
  - Generate **shareable deep links** (read-only, expiring) for recipes/lists.
- Shows **Nutrition Facts**:
  - Calories and macro breakdowns displayed on Recipe Details.
  - Health tags surfaced in Search and recipe cards (e.g., “High Protein”, “Low Sugar”).
- Introduces **Healthy Swap** as a first step:
  - Suggests alternative ingredients to improve nutrition.
  - Integrates into the existing recipe flow.

Deep AI & Trust features (clear explanations, feedback, guardrails) are planned for Iteration 3.

---

## Tasks – Iteration 2 User Stories (see chapter 4)

### Shopping List (Priority 6)

- As a user, I can create a shopping list from selected recipes, so that I know exactly what to buy.  
- As a user, I can see which ingredients I already have in my pantry, so that I don’t buy unnecessary items.  
- As a user, I want the shopping list to **merge duplicate items, normalise units, and aggregate quantities**, so that the list is practical to use in a real supermarket (e.g., “Tomatoes 800g” instead of 3 separate lines).  
- As a user, I want a **simple “Add to Cart” interaction** on each item, so that I can track progress while shopping.

### Save & Share (Priority 5 – Save Favourite Recipes)

- As a user, I can **save** my favourite recipes and lists, so that I can find them quickly later.  
- As a user, I can **unsave** items if I change my mind, so that my favourites stay clean and relevant.  
- As a user, I can **share a recipe or shopping list via a link** (read-only, expiring), so that friends or family can cook or shop from the same information.  
- As a user, I want shared links to be **safe and read-only**, so that others can view but not accidentally modify my data.

### Nutrition & Healthy Swap (Priority 4 – Nutrition Facts + first swaps)

- As a user, I can see **calories and macro information** (protein, carbs, fats) per serving, so that I can track my nutrition goals.  
- As a user, I can see **health tags** (e.g., “High Protein”, “Low Sugar”, “Vegetarian”) on recipe cards and in search filters, so that I can quickly find recipes that match my preferences.  
- As a user, I can see **suggested healthier ingredient swaps** (e.g., white rice → brown rice), so that I can improve my meals without needing expert knowledge.  
- As a user, I want these swaps to still **respect my dietary restrictions** (e.g., halal, vegan), so that I don’t get suggestions that I cannot actually use.

> Note: In Iteration 2, Healthy Swap is implemented functionally, but detailed AI explainability and feedback (full AI & Trust story) are reserved for Iteration 3.

---

# UI Design (Iteration 2)

- **Shopping List 2.0 UI**:
  - List grouped/aggregated view with item name, total quantity, and unit.
  - Checkboxes or “Add to Cart” style interaction for each item.
- **Save & Share UI**:
  - Favourite icon (e.g., heart/bookmark) on recipes and lists.
  - Favourites section showing saved items.
  - Share buttons that generate read-only links.
- **Nutrition & Healthy Swap UI**:
  - Nutrition summary panel on Recipe Details (calories + macros).
  - Health tags chips/badges on recipe cards and search results.
  - Inline Healthy Swap suggestions inside the recipe, with an option to apply a swap.

<img width="854" height="594" alt="image" src="https://github.com/user-attachments/assets/ea7865c2-0413-47cf-9edf-7aa25caf3994" />
<img width="854" height="641" alt="image" src="https://github.com/user-attachments/assets/8149ac88-0205-4610-a904-853ef76bec7d" />

---

# Completed (Iteration 2)

Insert screenshots / evidence for:

- **Shopping List 2.0**:
  - Before and after: old simple list vs new aggregated/normalised list.
- **Save & Share**:
  - Recipe with a favourite icon and then visible under “Favourites”.
  - A shared-link view (read-only) if available.
- **Nutrition & Healthy Swap**:
  - Recipe Details showing nutrition summary and health tags.
  - Example of a Healthy Swap suggestion applied to a recipe.

Also note in your report / captions:

- **AI & Trust (Priority 8)** is **not yet complete** in Iteration 2 – it is intentionally moved to Iteration 3.

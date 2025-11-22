# User story title: Auth & Profile, Pantry Management, Recipe Generation (Iteration 1)

---

## Priority

Note: priorities may change at different stages of the project.  
We keep all changes here for marking.

### Key Features – Estimates (Planning Poker) – Priority

- Login Page – **1 day** – **Priority 1**
- Pantry Management – **3.6 days** – **Priority 2**
- Recipe Generator – **5.6 days** – **Priority 3**
- Nutrition Facts – **2.8 days** – **Priority 4**
- Save Favourite Recipes – **3.8 days** – **Priority 5**
- Shopping List – **3 days** – **Priority 6**
- Upload Your Own Recipes – **3.2 days** – **Priority 7**
- AI & Trust – **4 days** – **Priority 8**

### Iteration 1 focus

In **Iteration 1 (8/10/25 – 29/10/25)** we tackled the highest-priority core features:

- **Priority 1 – Login Page (Auth & Profile)**
- **Priority 2 – Pantry Management**
- **Priority 3 – Recipe Generator**

These are the stories behind the first working version of the site:  
sign in → manage pantry → generate recipes from pantry.

---

## Estimation

We used planning poker to estimate relative effort:

- Login Page – **1 day**
- Pantry Management – **3.6 days**
- Recipe Generator – **5.6 days**

Total estimated effort for Iteration 1 user stories: **10.2 “days”** (relative sizing, not exact calendar days).

---

## Assumptions (if any)

- Learning time for Supabase, auth, and front-end patterns may add extra effort.
- Users will keep their pantry roughly up to date in the app.
- Users care about basic dietary preferences/restrictions and want to avoid waste.
- The first iteration focuses on **core flow**, not yet on advanced features (favourites, AI, detailed nutrition).

---

## Description


### Description-v1 (before Iteration 1)

The website will allow users to log in, store their pantry items, and generate recipes based on what they already have at home.

### Description-v2 (after Iteration 1 – matches current site)

The website provides a basic but working flow:

- A **Sign in** page (`/index.html`) where users enter email and password, with options to create an account or reset password.
- A **Discover/Generator** page (`/recipes.html`) with:
  - “Discover Recipes”: search bar, category filter, and sort (Recent / A–Z).
  - “Recipe Generator”: category dropdown, key-ingredient field, *Generate* and *Surprise Me* buttons.
- A **My Pantry** section on the same page:
  - “Add to Pantry” area with fields for *Name*, *Quantity*, *Expiry* and an info line:  
    “Tap a common ingredient or type your own, then adjust the quantity and expiry.”
- A basic **My Favourites** placeholder section (loading favourites) which will be completed in later iterations.

Iteration 1 implemented the working login, pantry, and recipe generation logic that underpins this UI.

---

## Tasks, see chapter 4

### Auth and Profile (Login Page – Priority 1)

- As a user, I can register and log in, so that my pantry, preferences, and saved recipes are secure and personalised.  
- As a user, I can see a clear **Sign in** page with email/password fields, and links like **Create an account** and **Forgot password?**, so that I can recover or create access easily.

### Pantry Management (Priority 2)

- As a user, I can add, edit, or remove pantry items with quantity, unit, and expiry date, so that I know what ingredients I have at home.  
- As a user, I can see instructions like *“Tap a common ingredient or type your own, then adjust the quantity and expiry”*, so adding items feels simple.  
- As a user, I want the app to highlight items that are expired or running low, so I avoid cooking failures and waste.  

### Recipe Generation (Priority 3)

- As a user, I can generate recipes based on my pantry items and dietary constraints, so that I can cook meals with what I have.  
- As a user, I want recipes to indicate preparation time, servings, and steps, so that I can plan efficiently.  
- As a user, I can use filters like **Category** and **Key Ingredient**, and buttons like **Generate** or **Surprise Me**, so I can quickly discover relevant recipes.  
- As a user, I want allergens flagged and dietary compliance enforced, so that I can safely follow my restrictions.  

*(Later iterations extend this with favourites, nutrition, shopping list, and AI & Trust.)*

---

# UI Design

- Many user stories are connected to a user interface.  
- Current UI (Iteration 1) includes:
  - Sign in page with email/password and action buttons.
  - Discover/Generator page with:
    - Discover Recipes section (search, category, sort, pagination).
    - Recipe Generator section (category, key ingredient, Generate, Surprise Me).
    - My Pantry section with Name/Quantity/Expiry inputs.

---

# Completed

<img width="443" height="552" alt="image" src="https://github.com/user-attachments/assets/2c29dd98-5084-487a-b85c-c83a356d8e40" />
<img width="278" height="562" alt="image" src="https://github.com/user-attachments/assets/11e7f8d1-183e-4833-84d0-8c516d867f57" />
<img width="860" height="575" alt="image" src="https://github.com/user-attachments/assets/37acdd36-3a4f-48ea-bbf7-ebb2ce1f61da" />


# Website Overview: RecipeSite

### Purpose:
RecipeSite is a web application where users can browse, save, and generate recipes. It has both a clean user interface and a cloud-connected backend using Supabase (for database, authentication, and storage).

## 1. System Architecture Overview
The Recipe Website uses a client-side architecture supported by a cloud Backend-as-a-Service (BaaS) provided by Supabase.
The system consists of:
- A static front-end (HTML/CSS/JS) hosted on GitHub Pages.
- A Supabase backend providing:
   - Authentication (email/password)
   - Real-time database (Postgres)
   - Image storage (Supabase Storage with public buckets)
- Session management
No custom server is required.

## 2. Front-End Design

### 2.1. Page Structure
#### a) index.html – Login Page
- Entry point for the website.
- Uses a clean login form.
- Handles:
   -  User login (Supabase Auth)
   - Auto sign-up if user doesn't exist
   - Redirecting authenticated users to recipes.html
- Styling from login.css.
#### b) recipes.html – Main Application Dashboard
- Core of the user experience.
- Displays recipe cards dynamically.
- Includes tab-based navigation:
   - Browse
   - Generator
   - Pantry
   - Favorites
   - Nutrition
- JavaScript populates recipes and handles UI switching
#### c) recipe-detail.html – Detailed View
- Displays a single recipe with:
   - Title
   - Image
   - Ingredients
   - steps
   - Nutrition Data
- Loads data based on ID passed in the URL.

### 2.2. JavaScript Architecture
#### a) supabaseClient.js
Responsiblefor:
- Connecting to Supabase
- Initializing the client:
   - window.supabase = createClient(URL, ANON_KEY);
- Making the client globally available.
This file is loaded first on every page so the rest of the code can call supabase.
#### b) common.js
This is the core controller for the site.

It handles:

#### 1. UI logic
- Rendering recipe cards
- Updating selected tabs
- Loading recipe details
- Search and filtering
- Updating the navigation bar
- Managing favourites in localStorage

#### 2. Authentication & State
- Uses:
   - supabase.auth.getUser()
  to restore the logged_in user on every page.
- Stores the usser locally using:
   - RecipeSite.setUser({ name: username });

#### 3. Persistent session ("Stay signed in")
- When the page loads, it check whether the user is already authenticated.
- If yes:
   - Loads the user
   - Updates UI
   - Loads favourites

#### 4. Optional future expansion
- Once database integration is added, this file will:
   - Fetch recipes from Postgres instead of local array
   - Save favourites to a cloud table instead of localStorage

### 2.3. CSS Design

#### base.css
- Global theme
- Colours, typography, layout rules
#### login.css
- Styles the login card
- Centers input fields
- Consistent button and form design
#### recipes.css
- Layout grid for recipes
- Card designs for each recipe
#### recipe.css
- Detailed view styling
- Ingredients lists, dividers, spacing
The separation ensures readability, maintainability, and easy updates.

## 3. Backend (Supabase) Design
supabase acts as the backend systemfor Authentication, Storage, and (future) Database.

### 3.1. Authentication
Uses Email + Password provider.

#### Features:
- Sign-in
- Automatic sign-up
- Token-based session s
- Session auto-refresh
- Session restore on page reload
- Secure JWT-based authentication
#### The workflow is:
1. User submits login form
2. Front-end calls:
   - supabase.auth.signInWithPassword()
3. If user does not exist → signUp is triggered
4. Supabase returns:
   - user info
   - access token
   - refresh token
5. Tokens are stored automatically by Supabase
6. User session persists across refreshes

### 3.2. Supabase Storage (Images)
A public bucket (recipe-images) stores the recipe thumbnails/photos.

The design:
- Public bucket → no authentication needed to view images
- Each file has a public URL
- Front-end stores these URLs inside recipe objects or database rows
- Recipe cards load images directly from Supabase CDN
This provides fast global image delivery.

### Database (Optional Enhancements)
While the current site uses a static RECIPES array inside common.js, the system is designed so that recipes can be stored in a Supabase Postgres table later.

A future recipes table may include:

| Column      | Type      | Description                 |
| ----------- | --------- | --------------------------- |
| id          | text/uuid | Recipe identifier           |
| title       | text      | Recipe name                 |
| category    | text      | Breakfast/Lunch/Dinner      |
| ingredients | json      | List of ingredients         |
| steps       | json      | Cooking instructions        |
| nutrition   | json      | Nutrition facts             |
| image_url   | text      | Public Supabase Storage URL |

Then frontend will use:
supabase.from('recipes').select('*')

## 4. Deployment Design
- Hosted on GitHub Pages under the docs/ directory.
- No server required.
- Supabase handles all cloud functions.
- Deployment flow:
   1. Developer pushes code to GitHub
   2. GitHub Pages auto-deploys
   3. Users access static website served from CDN
   4. JavaScript interacts with Supabase APIs live

## 5. Component Relationship Diagram (Text Version)

                 ┌─────────────────────────┐          
                 │     User’s Browser      │
                 │  HTML / CSS / JS (SPA)  │
                 └───────────┬────────────┘
                             │
                             ▼
                   ┌──────────────────┐
                   │ Supabase Client   │
                   │ (in supabaseClient.js) */
                   └──────────┬───────┘
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
 ┌─────────────┐     ┌────────────────┐     ┌────────────────┐
 │Auth System  │     │Database (SQL)  │     │Storage (Images)│
 │Email Login  │     │Recipes, Favs   │     │Images/Thumbnails│
 └─────────────┘     └────────────────┘     └────────────────┘

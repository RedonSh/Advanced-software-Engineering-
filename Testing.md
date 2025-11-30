# User Acceptance Testing (UAT)

> "System testing exercises the functionality of the system from front to back." — Head First Software Development, Ch 9

## Feature 1: User Authentication (Supabase)
- [Checked] **Happy Path**: User can sign up with a valid email/password.
- [Checked] **Happy Path**: User can log in and see "Hi, [Name]" in the header.
- [Checked] **Failure Case**: User tries to log in with the wrong password (should see an alert).
- [Checked] **State**: Refreshing the page keeps the user logged in (Session persistence).

## Feature 2: Recipe Management
- [Checked] **Happy Path**: Click "Add Recipe", fill title/ingredients, and submit. Verify recipe appears in "Browse".
- [Checked] **Boundary Case**: Submit "Add Recipe" form with empty fields (should validate and show error).
- [Checked] **Data Integrity**: Verify the `user_id` is correctly attached to the new recipe in Supabase.

## Feature 3: Pantry System
- [Checked] **Functionality**: Add an item (e.g., "Salt", "10g"). Verify it appears in the pantry grid.
- [Checked] **Persistence**: Close the browser tab and reopen it. "Salt" should still be visible (LocalStorage check).
- [Checked] **Sync**: Log in on Browser A and add an item. Log in on Browser B and verify the item appears (Supabase Sync).

## Feature 4: Favorites
- [Checked] **Functionality**: Click "Save" on a recipe card. Verify the button text changes to "✓ Saved".
- [Checked] **Filter**: Navigate to the "Favourites" tab. Verify only saved recipes appear.


## White-box Testing

This project uses a white-box testing mindset for the core JavaScript logic in `common.js` and the Supabase integration in `supabaseClient.js`.  
Because the application is a client-side web app, white-box testing focuses on **functions, branches, and internal state changes** rather than just the visible UI.

### Objectives

- Exercise each important **function** in `common.js` (e.g. user/session handling, recipe filtering, favourites).
- Exercise all critical **branches** and **error paths** in the login and Supabase-related code.
- Confirm that state stored in **localStorage** and via **Supabase Auth** behaves as expected.
- Ensure changes in one part of the code (e.g. favourites, session) don’t break other behaviour.

---

### Components Under White-box Test

1. **Supabase client initialisation (`supabaseClient.js`)**
   - Verify the client is created with the correct:
     - `supabaseUrl`
     - `anon key`
     - `auth` options (`persistSession`, `autoRefreshToken`)
   - Confirm `window.supabase` is defined and usable in the console and in `common.js`.

2. **User/session management (`common.js`)**
   - `RecipeSite.setUser(user)`
     - Sets the current user object.
     - Updates any UI elements that show the username (e.g. header badge).
     - Stores the user in `localStorage` under the correct key (`rs_user`).

   - Supabase session restore:
     ```js
     (async () => {
       const { data, error } = await supabase.auth.getUser();
       if (data?.user) {
         const username = data.user.email.split('@')[0];
         RecipeSite.setUser({ name: username });
       }
     })();
     ```
     White-box tests check that:
     - When Supabase returns a valid user, `setUser` is called and the UI shows the logged-in state.
     - When `data.user` is `null`, the app does not crash and stays in a logged-out state.
     - Error paths (e.g. network error) are handled gracefully (logged, not crashing).

3. **Login flow (`index.html` script)**
   - The login handler:
     ```js
     form.addEventListener('submit', async (e) => {
       e.preventDefault();
       const em = (email.value || '').trim();
       const pw = (pass.value  || '').trim();
       // ...
       let { error } = await supabase.auth.signInWithPassword({ email: em, password: pw });
       if (error && /invalid/i.test(error.message)) {
         ({ error } = await supabase.auth.signUp({ email: em, password: pw }));
       }
       // ...
     });
     ```
   - White-box tests cover:
     - **Empty inputs**: both email and password blank → shows an error and does *not* call Supabase.
     - **Valid existing user**: `signInWithPassword` succeeds → user is set and redirect occurs.
     - **New user**: `signInWithPassword` returns “invalid credentials” → `signUp` is called and then user is set.
     - **Supabase error**: any other error message → no redirect, error is surfaced (e.g. via `alert`).

4. **Recipe handling (`common.js`)**
   - Static `RECIPES` array and any functions that:
     - Find a recipe by ID.
     - Filter recipes by category or search text.
     - Render recipe data into cards or into the detail view.
   - White-box tests cover:
     - Searching by title, category, or ingredients.
     - Handling of no matches (empty result).
     - Correct mapping from a recipe object to DOM structure (e.g. title, image, tags).

5. **Favourites logic (`common.js`)**
   - Functions that add/remove recipes from the current user’s favourites.
   - Logic that decides whether a card’s favourite icon is in the “saved” state.
   - White-box tests ensure:
     - Adding a favourite:
       - Correct key is used (e.g. `rs_favs_username`).
       - Recipe ID is persisted and reloaded after refresh.
     - Removing a favourite:
       - Recipe ID is removed from the stored set.
       - UI updates correctly (icon changes, favourites list refreshes).
     - Logged-out user:
       - Favourites actions either prompt login or are safely disabled (no crash).

---

### Example White-box Test Cases (Conceptual)

These are conceptual examples of how the internal logic is tested (e.g. using a framework like Jest or manual browser-based testing):

1. **Supabase client available**
   - Arrange: Load the page with valid `ENV_SUPABASE_URL` and `ENV_SUPABASE_ANON_KEY`.
   - Act: Access `window.supabase` in the console.
   - Assert: `supabase` is defined and has `auth`, `from`, and `storage` properties.

2. **Session restore with logged-in user**
   - Arrange: Simulate that `supabase.auth.getUser()` returns a valid user object.
   - Act: Run the self-invoking session restore function in `common.js`.
   - Assert:
     - `RecipeSite.setUser` is called with the correct `name`.
     - UI elements (e.g. header) show the username.

3. **Login: existing user path**
   - Arrange: Mock `supabase.auth.signInWithPassword` to resolve with no error.
   - Act: Submit the login form with valid credentials.
   - Assert:
     - `signInWithPassword` is called once with the correct email and password.
     - No call to `signUp`.
     - Browser navigates to `recipes.html#favourites`.

4. **Login: new user path**
   - Arrange:
     - `signInWithPassword` returns an “invalid login” error.
     - `signUp` succeeds.
   - Act: Submit the login form with email + password.
   - Assert:
     - Both `signInWithPassword` and `signUp` are invoked.
     - User is set via `RecipeSite.setUser`.
     - Redirect happens as expected.

5. **Favourites: toggle behaviour**
   - Arrange: Start with an empty favourites list for user `test@example.com`.
   - Act:
     - Call the toggle function with recipe ID `r1`.
     - Call it again with `r1`.
   - Assert:
     - After first call: `r1` is present in favourites storage for that user.
     - After second call: `r1` is removed.
     - UI “star” icon matches the underlying state.

---

### Tools & Notes

- White-box testing can be done with:
  - A JavaScript test runner like **Jest**, or
  - Manual tests using the browser console and DevTools.
- The main focus is on:
  - **Branches** in the login logic (success / new user / failure).
  - **Branches** in session restore (user exists / no user / error).
  - **Branch coverage** in favourites logic (add / remove / unauthenticated).

By designing tests with full knowledge of the code paths inside `common.js`, `supabaseClient.js`, and the login script, the project follows a white-box approach rather than relying only on black-box UI testing.

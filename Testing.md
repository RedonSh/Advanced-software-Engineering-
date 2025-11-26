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
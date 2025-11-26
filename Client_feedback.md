# Delivered Solution & Client Feedback

This page summarises how our IT solution delivered “what is needed, on time and on budget” for each iteration, including demonstrations to our client (stakeholder) and key design choices for UI, database, and deployment.

---

<img width="1766" height="397" alt="image" src="https://github.com/user-attachments/assets/e10f515c-964d-4325-bbda-1eaf45f1e388" />



## Iteration 1 – Core Flow Delivered (Auth, Pantry, Recipe Generation)

### What we delivered (scope vs plan)

Planned priorities for Iteration 1 were:

- Priority 1 – Login Page (Auth & Profile)
- Priority 2 – Pantry Management
- Priority 3 – Recipe Generation

Within the iteration window (8/10/25 – 29/10/25), we delivered:

- A working Sign in / Auth flow (register and log in).
- A Pantry Management screen where users can add, edit, and remove items with quantity, unit and expiry.
- A basic Recipe Generator that shows recipes based on available pantry items and constraints.

All three planned priorities were implemented and tested before the iteration deadline, matching our estimated capacity (~53 “days” total velocity across the team for Iteration 1). This means Iteration 1 was effectively delivered **on time and within the planned “budget” of estimated effort**.

### Demonstration & client feedback

At the end of Iteration 1, we walked our stakeholder through:

1. Signing in and creating an account.
2. Adding items to the pantry.
3. Generating recipes from pantry items.

**Client feedback highlights:**

- Positive:  
  - Liked how the pantry and recipes are linked, and that it already feels like a real tool rather than just a prototype.  
  - Appreciated that expiry dates were included, as this aligns with reducing food waste.
- Suggestions for future iterations:  
  - Make it easier to plan shopping and share recipes with family.  
  - Show some basic nutrition information for health-conscious users.

This feedback directly informed the focus of Iteration 2 (Shopping List 2.0, Save & Share, Nutrition).

### UI, database & deployment choices

- **UI**:  
  - Clean, simple layout with clear navigation between Sign in, Discover/Generator**, and My Pantry.  
  - Iteration 1 prioritised clarity over visual complexity so users could quickly understand the main flow.
- **Database**:  
  - Chosen backend: Supabase (PostgreSQL + auth + RLS).  
  - In Iteration 1, we mainly focused on schema design and early integration, preparing for richer data use in Iteration 2.
- **Deployment**:  
  - Front end deployed via GitHub Pages at:  
   https://redonsh.github.io/Advanced-software-Engineering-/
  - This allowed our client to access and test the app live from any browser, even in early stages.

---

## Iteration 2 – Adding Real-World Value (Shopping List , Save & Share, Nutrition & Healthy Swap)

### What we delivered (scope vs plan)

Planned focus for Iteration 2 (30/10/25 – 20/11/25):

- Priority 6 – Shopping List → Shopping List 2.0
- Priority 5 – Save Favourite Recipes → Save & Share
- Priority 4 – Nutrition Facts → Nutrition summaries + health tags
- First functional version of Healthy Swap

Within the iteration, we delivered:

- **Smart Shopping List 2.0**:  
  - Deduplicates items based on pantry inventory.  
  - Normalises units and aggregates quantities.  
  - Groups items logically for real-world shopping.
- **Save & Share**:  
  - Save/Unsave for recipes and lists.  
  - Shareable, read-only deep links with expiry and RLS rules.
- **Nutrition & Healthy Swap (v1)**:  
  - Nutrition summaries and health tags on Recipe Details.  
  - Initial Healthy Swap suggestions integrated into the flow.

All features were implemented and demo-ready by 20/11/25, matching our estimated capacity (~53 “days” total work across the team over Iteration 2). This iteration was also delivered on time and within the planned effort budget.

### Demonstration & client feedback

In the Iteration 2 demo, we showed the stakeholder:

1. Creating a Smart Shopping List from selected recipes.
2. Checking how the list respects pantry items (no over-buying).
3. Saving favourite recipes, then finding them again in Favourites.
4. Sharing a recipe via a read-only link.
5. Viewing nutrition facts and seeing the first Healthy Swap suggestions.

**Client feedback highlights:**

- Positive:  
  - Very happy with Shopping List 2.0, especially the way it avoids duplicate items and unnecessary purchases.  
  - Liked the ability to share recipes easily with family and friends.  
  - Found nutrition summaries and tags helpful for choosing healthier meals.
- Suggestions for next iteration:  
  - Make AI swaps more transparent (“Why this swap?”).  
  - Allow quick feedback when a suggestion doesn’t suit them.
  - Emphasise trust and safety when using AI-generated suggestions.

This feedback shaped the AI & Trust scope in Iteration 3.

### UI, database & deployment choices

- **UI**:  
  - More mature shopping list screen with aggregated items and checkable states.  
  - Clear Save and Share actions, plus a Favourites view.  
  - Nutrition facts integrated into recipe cards and details without cluttering the UI.
- **Database**:  
  - Supabase now stores:
    - Saved lists and recipes.
    - Shared link metadata (tokens, expiry).  
    - Nutrition data for recipes and swaps.  
  - RLS policies introduced for read-only views via shared links.
- **Deployment**:  
  - Continuous deployment via GitHub: each iteration’s work pushed to the same GitHub Pages URL.  
  - Supabase environment updated in sync, allowing the stakeholder to feel the evolution between iterations.

---

## Iteration 3 – Trust, Safety & Reliability (AI & Trust + RLS Hardening)

### What we delivered (scope vs plan)

Planned focus for Iteration 3 (21/11/25 – 30/11/25):

- Priority 8 – AI & Trust
- Finalising backend endpoints and RLS hardening to support AI, Save & Share, and Swaps.

Within the iteration, we delivered:

- **AI explanations & transparency**:
  - “Why this swap?” text with simple reasons (e.g., lower sugar, more fibre, more protein).
  - Displayed nutritional deltas (e.g., change in calories/macros) for each swap.
- **Trust & feedback controls**:
  - Thumbs up/down for AI suggestions.
  - Options like “Not suitable for me” and “Allergy risk”.
- **Guardrails & error handling**:
  - Swaps filtered to respect stored dietary restrictions.
  - Clear messaging when AI fails or no suitable swap can be found.
- **Backend & RLS hardening**:
  - Completed remaining Supabase endpoints for Save, Share, and Swap flows.
  - Tightened RLS so shared links are strictly read-only and scoped by user and expiry.
  - Added basic logging for key actions (Save/Share/Swap) for debugging and trust.

We met the planned iteration velocity (~35 “days” of work) and completed the AI & Trust feature set within the iteration timeframe. A stretch goal (personalised re-ranking based on feedback) was started but deliberately moved to the backlog once we hit the time budget.

### Demonstration & client feedback

In the Iteration 3 demo, we guided the stakeholder through:

1. Triggering a Healthy Swap and seeing the “Why this swap?” explanation.
2. Reviewing the nutritional changes (calories/macros) for the swap.
3. Giving feedback via thumbs up/down and flagging a bad suggestion.
4. Observing how the system behaves when AI cannot return a good swap.

**Client feedback highlights:**

- Positive:  
  - Appreciated the honesty and transparency of the AI explanations.  
  - Felt more comfortable using AI suggestions knowing they can see the “why” and provide feedback.  
  - Liked that allergy/dietary restrictions are enforced before showing swaps.
- Suggestions beyond current scope:  
  - In the future, use feedback to personalise suggestions more deeply.  
  - Consider email or notification features when new relevant recipes are added.

Overall, the client agreed that the product now feels safer, more trustworthy, and closer to something that could be used in real life.

### UI, database & deployment choices

- **UI**:  
  - Added lightweight trust elements without overwhelming the user:
    - Explanation text and nutritional deltas near each swap.
    - Discrete feedback controls and safety messages.
  - Carefully designed error/empty states so the experience degrades gracefully when AI is unavailable.
- **Database**:  
  - Supabase now includes:
    - Additional tables/columns for logging feedback and AI calls (where applicable).
    - Refined RLS rules to tightly control access via shared links and user sessions.
- **Deployment**:  
  - The same GitHub Pages + Supabase setup was used, reinforcing a consistent deployment pipeline.  
  - Iteration 3 represents a stabilised, promotable version of the app suitable for showcasing on GitHub and to future stakeholders.

---

## How this GitHub page promotes the solution

This page is intended to:

- Demonstrate that each iteration delivered “what was needed, on time and on budget” according to our planning and velocity.  
- Show a clear record of:
  - What was implemented each iteration.
  - How the client reacted and how their feedback steered later work.
  - The thought process behind our UI, database and deployment decisions.
- Act as a high-level summary for tutors, markers, and potential future stakeholders who browse the repository.



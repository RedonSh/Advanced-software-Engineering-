
# cp3407-project-v2024 

## Team

1. Redon Shkreli
2. Sanjay Sabu  
3. Nathaniel Carl Peter
4. Tshewang Tobden
5. Minh Duy Nguyen


# Project planning BEFORE iteration-1, (see chapters 1-3)

<img width="1482" height="253" alt="image" src="https://github.com/user-attachments/assets/80d9e5f5-8933-42fd-8ced-5b0be1534414" />

<img width="1644" height="224" alt="image" src="https://github.com/user-attachments/assets/3197d362-9b26-4fad-8446-4bb79565c3f1" />

<img width="1591" height="495" alt="image" src="https://github.com/user-attachments/assets/5c83820f-b851-49ce-9003-a78b144ddda8" />
<img width="1762" height="545" alt="image" src="https://github.com/user-attachments/assets/ec821325-4dae-4d6a-84d5-33f1f62fd735" />


#### Week 1
 From the first week, after forming our team, we began searching for a stakeholder to develop a website. We found one and conducted an interview with him, during which he expressed interest in creating a recipe website. Based on the interview, we developed user stories that helped us identify key features such as a login page, pantry management system, shopping list, recipe suggestions based on available pantry items, an option to save favorite recipes, and features showing nutrition facts and personalized recommendations. 

#### Week 2
In the second week, we divided tasks among team members, assigning specific areas for each person to focus on. After that, we came together for a blue-sky brainstorming session to generate creative ideas and define the main features of our project. At the end of the session, we conducted a planning poker activity to estimate how many days each interface would take to complete and used these estimates to calculate the project’s velocity, which we recorded and planned to upload to GitHub.

**Blue-sky Brainstorming Ideas:**

* Combined shopping list and pantry
* AI-generated recipe recommendations
* Add and connect with friends
* Share recipes with friends
* Upload personal recipes
* Blog-style recipe posts
* Meal planner
* Expiry-date tracking
* Prioritize fruits and vegetables
* Barcode scanning for item identification
* Rating system for items

**Key Features - Estimates (Planning Poker) - Priority :**

* Login Page – 1 day - 1 ( Priority )
* Pantry Management – 3.6 days - 2 ( Priority )
* Shopping List – 3 days - 6 ( Priority )
* Recipe Generator – 5.6 days - 3 ( Priority )
* Save Favorite Recipes – 3.8 days - 5 ( Priority )
* Nutrition Facts – 2.8 days - 4 ( Priority )
* Upload Your Own Recipes – 3.2 days - 7 ( Priority )
* AI & Trust – 4 days - 8 ( Priority )
  

Total: 27 days


# Iteration 1, 8/10/25 - 29/10/25

#### Week 3 (8/10 – 13/10)

Iteration 1 officially started.

Defined all key user stories for Auth, Pantry Management, and Recipe Generation.

Set up GitHub repository, assigned tasks, and established workflow.

Front-end planning began — layout sketches for Home, Search, and Recipe Details screens.

Back-end research initiated: explored Supabase and general cloud service requirements.

#### Week 4 (14/10 – 20/10)

Continued UI implementation of Core Navigation and Home/Search pages.

Integrated basic recipe display from mock data.

Database setup research completed — decided to utilize Supabase for scalable backend.

GitHub commits verified (see timestamps).

Team meeting held to align design consistency and define the next sprint priorities.

#### Week 5 (21/10 – 27/10)

Completed and tested Recipe Details screen with clean UI and smooth transitions.

Added functionality for users to upload their own recipes.

Implemented Pantry Management module allowing add/edit/remove of ingredients.

Developed initial version of Smart Shopping List generator.

Back-end team finished Supabase and Cloud integration research and committed findings to GitHub.

Task 3 (Back End) marked completed – 27/10/25.

#### Week 6 (28/10 – 29/10)

Performed integration testing across front-end components and Supabase.

Resolved UI bugs, improved navigation flow, and finalized styling.

Verified data synchronization for user recipes, pantry items, and shopping lists.

Task 2 (Front End) marked completed – 29/10/25.

Iteration 1 officially closed — total estimated velocity achieved (~53 days of work).

Total: 21 days



# Iteration 2, 30/10 - 20/11

#### Week 7 (31/10 – 6/11)

Iteration 2 officially started.

Upgraded Smart Shopping List: deduped items by pantry inventory, normalized units, and aggregated quantities by store/aisle.

Added one-tap “Add to Cart” behavior (UI), with backend writes prepared.

Created Supabase schema for saved lists and shared links (tables + initial RLS scaffolding).

Instrumented analytics events: list_created, item_checked, list_shared_init.


#### Week 8 (7/11 – 13/11)
Implemented Save/Unsave for Recipes and Lists (auth-gated, optimistic UI).

Generated shareable deep links (read-only) with expirations; enforced RLS for anonymous view.

Added nutrition summaries (calories/macros) and health tags; surfaced tags in Search filters and Recipe Details.

Verified persistence to Supabase and logs for share events.


#### Week 9 (14/11 – 20/11)
Delivered Healthy Swap suggestions with inline chooser and real-time macro deltas.

Finalized loading/error states; performance pass on list generation and recipe detail renders.

Wrote unit tests (unit normalization, macro calc, swap scoring) and E2E flow tests (Search → Save → Generate List → Share → Open Link → Swap).

Got the database running (Supabase) and the backend is almost completed, with remaining endpoints stubbed and tracked for Iteration 3 kickoff.


Task 3 (Back End) marked completed – 20/11/25.



Total: 21 days

# Iteration 3, 21/11/25 - 30/11/25

#### Week 10 (21/11 - 30/11)
Iteration 3 officially started, focused on the AI & Trust user stories and finishing the remaining backend work.

Finalised the remaining Supabase endpoints for share read scopes, write operations for shopping list updates, and AI swap preview calls. Hardened Row-Level Security (RLS) so that shared links are strictly read-only and scoped by user and expiry token, and added logging around key flows (Save, Share, Swap) to support debugging and observability.

Implemented “Why this swap?” explanations that show the key nutritional changes (calories, protein, carbs, fats) and simple reasoning labels such as “Lower sugar” or “Higher fibre”. Updated the Recipe Detail and Swap UI to clearly distinguish estimated vs. verified values with tooltips and a short info message so users understand how accurate the data is.

Added Trust & Feedback UX on AI suggestions: quick thumbs up/down controls and options such as “Not suitable for me” and “Allergy risk”, plus guardrail messages encouraging users to check labels or medical advice. Also handled AI error states and timeouts more gracefully so that if an AI call fails, the app still shows a clear message instead of breaking the flow.

Started a stretch task on personalisation: wired feedback events (thumbs up/down) into analytics so future iterations can re-rank suggestions based on user preferences. Due to limited time in Iteration 3, only basic event tracking was completed; the actual personalised re-ranking logic was moved to the backlog.


Total: 10 days

# Actual iterations
1. Iteration 1: [(https://github.com/RedonSh/Advanced-software-Engineering-/blob/main/iteration_1.md](https://github.com/RedonSh/Advanced-software-Engineering-/blob/main/iteration_1.md)
2. Iteration 2: [(https://github.com/RedonSh/Advanced-software-Engineering-/blob/main/iteration_2.md](https://github.com/RedonSh/Advanced-software-Engineering-/blob/main/iteration_2.md)
3. Iteration 3: [(https://github.com/RedonSh/Advanced-software-Engineering-/blob/main/iteration_3.md](https://github.com/RedonSh/Advanced-software-Engineering-/blob/main/Iteration_3.md)



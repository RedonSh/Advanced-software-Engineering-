# Actual iteration-2 board, 31/10/25 – 20/11/25


# Checklist:


## GitHub entry timestamps
Refer to commit history within the iteration window (31/10/25 → 20/11/25), e.g., milestone tags and commits on 06/11/25, 13/11/25, and 20/11/25.


## Assumed Velocity
the number of people on our team × working days in our iteration × team’s first-pass velocity
5 × 15 × 0.7 = 53


## Number of developers
= 5 Developers


## Total estimated amount of work: YY days
53 (Amount of work in “days”)




## User stories or tasks (see chapter 4):


####  Shopping List 


As a user, I can create a shopping list from selected recipes, so that I know exactly what to buy.

As a user, I can see which ingredients I already have, so that I don’t buy unnecessary items.

As a user, I can optionally create a weekly meal plan, so that cooking is organized and waste is reduced.

#### Saving & Sharing


As a user, I can save my favorite recipes, so that I can access them later.

As a user, I can rate recipes (1–5) and leave comments, so that I can track what I liked.

As a user, I can share recipes or export them as PDF cards, so that friends or family can cook from them.

#### Healthy Swap / Nutrition


As a user, I can see suggested ingredient swaps to make recipes healthier, so that I can improve nutrition without extra effort.

As a user, I can view macros and calories per serving, so that I can track nutrition and meet my goals.

As a user, I want swaps to respect my dietary restrictions, so I can trust the app.


## In progress:


Task 3: Back end (final endpoints & RLS hardening)
Contributors: Tshewang Tobden, Sanjay Sabu
Date Started: 14/11/25
Status: Database (Supabase) running; backend almost completed. Remaining endpoints (share read scopes, write ops for list updates) stubbed and queued for Iteration 3 kickoff.




## Completed:


#### Task 4: Shopping List 2.0
Date Completed: 06/11/25
Details: Upgraded Smart Shopping List to respect pantry quantities, normalize units, and aggregate by aisle/store; added “one-tap Add to Cart” UI and analytics events (list_created, item_checked, list_shared_init).
Developers: Redon Shkreli, Minh Duy Nguyen


#### Task 5: Save & Share + Nutrition
Date Completed: 13/11/25
Details: Implemented Save/Unsave for recipes and lists (auth-gated, optimistic UI); created shareable deep links (read-only, expiring) with RLS enforcement; added nutrition summaries (calories/macros) and health tags surfaced in Search and Recipe Details.
Developers: Redon Shkreli, Minh Duy Nguyen (FE) • Tshewang Tobden, Sanjay Sabu (BE)


#### Task 6: Healthy Swap & E2E
Date Completed: 20/11/25
Details: Delivered Healthy Swap suggestions with inline chooser and real-time macro deltas; finalized loading/error states; performance pass on list generation and recipe renders; unit tests (unit normalization, macro calc, swap scoring) and E2E flow (Search → Save → Generate List → Share → Open Link → Swap).
Developers: Team




### Burn Down for iteration-2:


31/10/25 – 2 weeks left (14 days remaining)


07/11/25 – 1 week left (7 days remaining)


14/11/25 – 3 days left (final testing, BE endpoints, and polishing)


20/11/25 – 0 days left (iteration completed; database running and backend almost completed)


Actual Velocity: ~53 “days” of estimated work delivered across 5 developers.




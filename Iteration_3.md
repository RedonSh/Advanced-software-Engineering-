Actual iteration-3 board, 21/11/25 – 30/11/25
Checklist:
GitHub entry timestamps

Refer to commit history within the iteration window (21/11/25 → 30/11/25), e.g., feature branches and milestone commits around 23/11/25, 27/11/25, and 30/11/25.

Assumed Velocity

the number of people on our team × working days in our iteration × team’s first-pass velocity
5 × 10 × 0.7 = 35

Number of developers

= 5 Developers

Total estimated amount of work: YY days

35 (Amount of work in “days”)

User stories or tasks (see chapter 4):
AI & Trust

As a user, I can trust AI-generated swaps and recipes if the app shows nutritional impact and clear explanations, so that I feel confident using the suggestions.

As a user, I can see why a suggestion was made (e.g., “lower saturated fat” or “more protein”), so that the AI feels transparent instead of random.

As a user, I can give quick feedback (thumbs up/down, “not suitable for me”), so that the AI improves over time and avoids repeating bad suggestions.

As a user, I can clearly see when values are estimated vs. verified, so that I don’t misinterpret approximate nutrition data as exact.

In progress:

Task 10: Personalisation & Learning Loop (Stretch)
Contributors: Team
Date Started: 28/11/25
Status: Basic feedback loop (thumbs up/down events) wired to analytics, but not yet feeding into model re-ranking. Marked as stretch and partially completed; remaining work moved to product backlog for future iterations.

Completed:
Task 7: Back End Finalisation & RLS Hardening

Date Completed: 24/11/25
Details: Completed all remaining Supabase endpoints for share read scopes, write operations for list updates, and AI-swap preview calls. Tightened Row-Level Security (RLS) so that links are strictly read-only and scoped by user and expiry tokens. Added logging around key flows (Save, Share, Swap) to support observability and incident debugging.
Developers: Tshewang Tobden, Sanjay Sabu

Task 8: AI Explainability & Nutrition Transparency

Date Completed: 27/11/25
Details: Added “Why this swap?” explanations with key nutritional deltas (calories, protein, carbs, fats) and simple reasoning labels (e.g., “Lower sugar”, “Higher fibre”). Updated Recipe Detail and Swap UI to highlight estimated vs. verified values, including tooltips and an info banner. Ensured all AI-generated text is clearly labelled and can be dismissed if the user prefers a simpler view.
Developers: Redon Shkreli, Sanjay , Tshewang Tobden 

Task 9: Trust & Feedback UX + Guardrails

Date Completed: 30/11/25
Details: Implemented quick feedback controls (thumbs up/down, “Not suitable for me”, “Allergy risk”) on AI suggestions. Added safety guardrails such as “Check labels and medical advice” disclaimers, plus validation that swaps respect stored dietary restrictions before being shown. Final pass on empty/error states for AI calls (timeouts, no swap found) so the app fails gracefully and maintains user trust.
Developers: Team

Burn Down for iteration-3:

21/11/25 – 10 days left (planning, AI & Trust stories refined, Task 7/8/9 broken down and estimated)

25/11/25 – 5 days left (core BE endpoints done; first version of AI explanations and trust UI working end-to-end in staging)

28/11/25 – 2 days left (feedback controls added; polishing copy, edge cases, and RLS checks; stretch personalisation work started)

30/11/25 – 0 days left (iteration completed; AI explainability and trust features released; remaining stretch items moved to backlog)

Actual Velocity: ~35 “days” of estimated work delivered across 5 developers, closely matching the assumed velocity for the 10-day iteration.

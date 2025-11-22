# User stories – Iteration 3 (AI & Trust + Backend/RLS Hardening)

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

### Iteration 3 focus

By the end of Iteration 2, all higher-priority features (1–7) had been implemented in some form.  
**Iteration 3 (21/11/25 – 30/11/25)** was therefore focused on:

- **Priority 8 – AI & Trust**
  - Making AI-generated swaps more transparent and trustworthy.
  - Allowing users to quickly give feedback.
  - Adding guardrails and clear labelling (estimated vs verified).
- Finalising **backend endpoints and RLS hardening** that support these flows.

No new major “business” features were added; instead, the emphasis was on **trust, safety, and reliability** around the existing AI and sharing features.

---

## Estimation

Initial planning estimate for:

- **AI & Trust** – **4 days** – Priority 8

In reality, Iteration 3 combined:

- AI & Trust (explanations, feedback, guardrails).
- Remaining Supabase work (endpoints + RLS + logging).
- Final polish on error states and E2E flows.

Total planned capacity for Iteration 3 was:

- **Assumed velocity:** 35 “days” (5 developers × 10 working days × 0.7).

The AI & Trust feature itself fits within the original **4-day** estimate, but the iteration also included extra work for:

- Observability/logging for Save, Share, and Swap flows.
- Graceful handling of AI failures/timeouts.

---

## Assumptions (Iteration 3 specific)

- Core features (Auth, Pantry, Recipe Generation, Shopping List 2.0, Save & Share, Nutrition & Healthy Swap) are already functional from Iteration 1–2.
- Users now rely on AI suggestions and shared links more often, so:
  - They need **clear explanations** to build trust.
  - They need **safety messages and guardrails**.
  - They should be able to say “this suggestion is not good for me” easily.
- Any remaining backend issues (RLS gaps, missing endpoints) must be addressed now to avoid security/privacy risks.

---

## Description

You need to keep all versions here so that your instructor/marker can see your changes easily.  
In a real project, your older versions could be viewed via commits.

### Description-v1 (before Iteration 3)

The app can:

- Let users log in and manage their pantry.
- Generate recipes and build a smart shopping list.
- Save and share recipes and lists via read-only links.
- Show basic nutrition information and suggest some healthier swaps.

However:

- AI suggestions are not fully explained.
- Users cannot easily give structured feedback on AI swaps.
- Guardrails and RLS (Row-Level Security) rules still need tightening and auditing.

### Description-v2 (after Iteration 3)

After Iteration 3, the app:

- Provides **AI explanations** for swaps:
  - “Why this swap?” text with key nutritional deltas (e.g., calories, protein, carbs, fats).
  - Simple reasoning labels like **“Lower sugar”**, **“Higher fibre”**, **“More protein”**.
- Clearly separates **estimated vs verified** nutrition values:
  - Labels and tooltips indicate when values are approximations.
  - Info messages remind users that nutrition data is guidance, not medical advice.
- Adds **Trust & Feedback controls**:
  - Quick **thumbs up/down** for AI suggestions.
  - Extra options like **“Not suitable for me”** and **“Allergy risk”**.
- Implements **guardrails and error handling**:
  - Swaps are only shown if they respect stored dietary restrictions.
  - AI timeouts and errors show friendly messages instead of breaking the flow.
- Finalises **backend & RLS**:
  - All Supabase endpoints required by Save, Share, and Swap are complete.
  - RLS rules enforce strict, read-only shared links with user- and expiry-based scoping.
  - Logging is added for key actions (Save, Share, Swap) to support debugging and audits.

A stretch task on **personalised re-ranking** (using feedback to adjust future suggestions) was started but not completed; it has been moved to the backlog.

---

## Tasks – Iteration 3 User Stories (see chapter 4)

### AI Explanations & Transparency (Priority 8 – AI & Trust)

- As a user, I can **see why an AI swap was suggested** (e.g., “lower saturated fat”, “more protein”), so that the AI feels transparent instead of random.  
- As a user, I can see **how a swap changes nutrition** (calories and macros), so that I understand the trade-off and can make an informed choice.  
- As a user, I want the app to clearly **label estimated values vs verified ones**, so that I don’t treat approximate numbers as exact.

### Trust, Feedback & Guardrails (Priority 8 – AI & Trust)

- As a user, I can give **quick feedback** on AI suggestions (thumbs up/down), so that the system can improve over time.  
- As a user, I can flag a suggestion as **“Not suitable for me”** or **“Allergy risk”**, so that the app avoids repeating dangerous or irrelevant swaps.  
- As a user, I want the app to **respect my stored dietary restrictions** when generating swaps, so that I only see suggestions I can actually use.  
- As a user, I want to see **safety messages** reminding me to check packaging labels and medical advice, so that I don’t rely solely on the app for health-critical decisions.

### Backend Finalisation & RLS Hardening (Supporting AI & Trust)

- As a developer/stakeholder, I want all **Supabase endpoints** for Save, Share, and Swap flows to be complete and consistent, so that the app behaves reliably in production.  
- As a user, I want **shared links** to be **strictly read-only** and automatically expired, so that my recipes and lists cannot be edited by others or exposed longer than intended.  
- As a developer/stakeholder, I want **logging and monitoring** around AI calls, Save, Share, and Swap actions, so that issues can be diagnosed and trust incidents can be investigated.

---

# UI Design (Iteration 3)

Iteration 3 introduces new UI elements around **AI & Trust**:

- **“Why this swap?” section:**
  - Appears under or beside a suggested swap.
  - Shows a short explanation plus a small nutrition change summary (e.g., “–80 kcal, +5g protein, –10g sugar”).
- **Feedback controls:**
  - Thumbs up/down icons beside AI suggestions.
  - Optional dropdown or menu with “Not suitable for me” / “Allergy risk”.
- **Trust & safety messaging:**
  - Small info banner or tooltip explaining:
    - Values may be estimates.
    - Users should check labels and personal health requirements.
- **Error/empty states:**
  - Friendly messages when:
    - No good swap can be found.
    - AI call times out or fails.
  - Ensures the page still works even if AI is temporarily unavailable.

*(Insert screenshots of these Iteration 3 UI elements for marking.)*

---

# Completed (Iteration 3)

Evidence/screenshots to include:

- Example of a **Healthy Swap** with:
  - The original ingredient.
  - The suggested swap.
  - A visible **“Why this swap?”** explanation and nutritional deltas.
- The **feedback UI** (thumbs up/down and “Not suitable for me” / “Allergy risk”).
- A **safety/guardrail message** about checking labels/medical advice.
- Developer/console or logs screenshot (if allowed) showing:
  - RLS rules in place.
  - Logging of Save/Share/Swap actions.
- Any screenshot demonstrating **error handling**:
  - A clear message when AI fails or no swap is possible.

Note: A stretch task on personalised re-ranking of AI suggestions based on feedback was **started but not completed** in Iteration 3 and has been moved to the product backlog.

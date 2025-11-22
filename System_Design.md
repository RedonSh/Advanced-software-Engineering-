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

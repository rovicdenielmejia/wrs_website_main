# Easy-to-Understand: Database Integration

This page explains **how the WRS website connects to a database** to store employer and job seeker accounts. No heavy jargon — just the flow and where things live.

---

## What Gets Stored in the Database?

| Who            | Table       | What we save (examples)                          |
|----------------|-------------|--------------------------------------------------|
| **Employers**  | `employers` | Email, secure password, company name, contact   |
| **Job seekers**| `candidates`| Email, secure password, full name, phone, resume|

Passwords are **never** stored as plain text. They are hashed (scrambled) on the server before saving.

---

## The Big Picture (3 Parts)

```
  ┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
  │   BROWSER       │         │   VERCEL        │         │   DATABASE      │
  │   (Your site)   │  ───►   │   (API routes)  │  ───►   │   (Neon/Postgres)│
  │                 │  fetch   │                 │  SQL    │                 │
  │  Register form  │         │  /api/auth/...   │         │  employers      │
  │  Login form     │  ◄───   │  (Node.js)       │  ◄───   │  candidates     │
  └─────────────────┘  JSON   └─────────────────┘         └─────────────────┘
```

1. **Browser** — User fills the register or login form. Your JavaScript sends the data to the API.
2. **Vercel (API)** — Server code runs only on Vercel. It checks the data, hashes passwords, and talks to the database.
3. **Database** — Postgres (e.g. Neon) holds the tables. It stores and returns rows (e.g. “this email exists”, “password matches”).

---

## Step-by-Step: What Happens When Someone Registers?

1. User opens **Employer Register** or **Job Seeker Register** and submits the form.
2. **`js/auth.js`** runs in the browser. It calls `registerEmployerWithApi(data)` or `registerCandidateWithApi(data)`.
3. That function sends a **POST** request to:
   - `https://your-site.vercel.app/api/auth/register/employer`  
   - or `.../api/auth/register/candidate`  
   with JSON: email, password, name, company (employer) or fullName, phone (candidate).
4. **Vercel** runs the matching API file:
   - `api/auth/register/employer.js` or  
   - `api/auth/register/candidate.js`
5. The API:
   - Reads `DATABASE_URL` (set by Vercel when you add Neon).
   - Connects to Postgres using **`api/lib/db.js`** (Neon serverless driver).
   - Hashes the password with **`api/lib/auth.js`** (scrypt).
   - Inserts a new row into `employers` or `candidates`.
6. The API responds with `{ success: true, user }` (no password). The browser saves the user in the session and redirects (e.g. to dashboard).
7. If the API fails (no database or network error), the same forms **fall back to localStorage** so the site still works in demo mode.

---

## Step-by-Step: What Happens When Someone Logs In?

1. User opens **Employer Login** or **Job Seeker Login** and submits email + password.
2. **`js/auth.js`** calls `loginWithApi(email, password, role)`.
3. Browser sends **POST** to `https://your-site.vercel.app/api/auth/login` with `{ email, password, role: "employer" or "candidate" }`.
4. **`api/auth/login.js`** runs on Vercel:
   - Connects to the database.
   - Finds the row by email in `employers` or `candidates`.
   - Verifies the password using the stored salt and hash.
5. API returns `{ success: true, user }` or `{ success: false, error }`. Browser sets the session and redirects, or shows an error.
6. If the API is unavailable, login falls back to **localStorage** (demo accounts).

---

## Where Everything Lives in the Project

| Purpose                    | File or folder |
|---------------------------|----------------|
| Database table definitions| `sql/schema.sql` |
| Connect to Postgres       | `api/lib/db.js` |
| Hash/verify passwords     | `api/lib/auth.js` |
| Register employer         | `api/auth/register/employer.js` |
| Register candidate        | `api/auth/register/candidate.js` |
| Login                     | `api/auth/login.js` |
| Frontend: call API + fallback | `js/auth.js` |
| Employer register form    | `employer/employer-register.html` |
| Candidate register form   | `candidate/candidate-register.html` |
| Employer login form       | `employer/employer-login.html` |
| Candidate login form      | `candidate/candidate-login.html` |

---

## How to Turn the Database “On”

1. **Add a database**  
   In the Vercel project: **Storage / Integrations** → Marketplace → **Neon** (or another Postgres). Connect it to your project. Vercel will set **`DATABASE_URL`**.

2. **Create the tables**  
   In Neon’s SQL editor, paste and run the contents of **`sql/schema.sql`**. You only do this once per database.

3. **Deploy**  
   Push your code. Vercel runs `npm install` (so `@neondatabase/serverless` is there) and exposes `/api/auth/...`. The site will use the database when users register or log in on the **deployed** URL (same origin).

---

## Quick Reference: API Endpoints

| Method | URL (relative)              | When it’s used        |
|--------|-----------------------------|------------------------|
| POST   | `/api/auth/register/employer`  | Employer sign-up      |
| POST   | `/api/auth/register/candidate` | Job seeker sign-up    |
| POST   | `/api/auth/login`              | Employer or candidate login |

All expect **JSON** in the body and return **JSON**. Passwords are hashed on the server only.

---

## Summary

- **Database** = Postgres (e.g. Neon), with tables **employers** and **candidates**.
- **Integration** = Browser → Vercel API routes → Postgres. API lives in `api/`, frontend in `js/auth.js` and the register/login HTML pages.
- **Security** = Passwords hashed with scrypt; `DATABASE_URL` only on the server.
- **Fallback** = If the API or database isn’t available, the site still works using **localStorage** (demo mode).

For setup details (Neon, env vars, troubleshooting), see **`docs/DATABASE_SETUP.md`**.

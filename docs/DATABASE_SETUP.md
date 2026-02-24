# WRS Database Setup (Vercel + Postgres)

> **Easy overview first?** See [DATABASE_INTEGRATION.md](DATABASE_INTEGRATION.md) for a simple explanation of how the database connects to the site.

This project stores **employer** and **job seeker (candidate)** accounts in a Postgres database when deployed on Vercel. Locally or without a database, auth falls back to `localStorage` (demo mode).

## One database for the whole website

The website uses **a single database** for all account data:

- **One `DATABASE_URL`** — Set in your Vercel project (e.g. via Neon). Every API route uses this same connection.
- **One Postgres instance** — The same Neon (or other) database holds both `employers` and `candidates` tables. There are no separate databases for different parts of the site.
- **Same database in production and local** — To use the same database when developing locally, pull the env from Vercel and run the dev server:
  1. `vercel login` (if needed), then `vercel env pull .env.development.local`
  2. `vercel dev` — this loads `.env.development.local` and your API routes will use the same `DATABASE_URL` as production.

## Get started with Neon (WRS project)

This project uses **Neon** for Postgres:

| | |
|---|---|
| **Neon org** | `org-blue-salad-15517518` |
| **Neon project** | `curly-shadow-26743275` |
| **Console** | [Neon Console → Projects](https://console.neon.tech/app/org-blue-salad-15517518/projects) |
| **REST API URL** (read-write, no RLS) | `https://ep-purple-sea-a1ziurg2.apirest.ap-southeast-1.aws.neon.tech/neondb/rest/v1` |

The WRS app uses **`DATABASE_URL`** (Postgres connection string from Neon’s **Connection string**) with `@neondatabase/serverless`, not the REST API URL above. The REST URL is for PostgREST-style access (e.g. other tools or future REST clients); keep any API key for it in env only and never in git.

**Steps:**

1. **Open Neon**  
   Go to [Neon Console](https://console.neon.tech) and select org **org-blue-salad-15517518** and project **curly-shadow-26743275**.

2. **Create a branch/database** (if needed)  
   In the project, use the default branch or create one. Note the connection string (e.g. from **Connection details** or **Dashboard**).

3. **Run the schema**  
   Either:
   - **From the project:** Run `vercel env pull .env.development.local` (after linking Neon to Vercel), then `npm run db:schema` to apply **`sql/schema.sql`**.
   - **In Neon:** **SQL Editor** → paste the contents of **`sql/schema.sql`** from this repo → **Run**.  
   This creates the `employers` and `candidates` tables.

4. **Connect Vercel to this Neon project**  
   In [Vercel Marketplace](https://vercel.com/marketplace?category=storage&search=postgres) → **Neon** → **Add Integration** → choose your Vercel project. When prompted, link to the existing Neon project (**curly-shadow-26743275**) or allow Neon to inject `DATABASE_URL` for a new database in that project. Vercel will add `DATABASE_URL` to your project env.

5. **Redeploy**  
   Redeploy your Vercel app so the API routes use the new `DATABASE_URL`.

6. **Local dev (optional)**  
   Run `vercel env pull .env.development.local` in this repo, then `npm run dev` or `vercel dev` to use the same database locally.

## 1. Add a Postgres database to your Vercel project

1. Open your [Vercel Dashboard](https://vercel.com/dashboard) and select the **wiring-website-WRS** (or your project) project.
2. Go to **Storage** or **Integrations** and open the [Vercel Marketplace](https://vercel.com/marketplace?category=storage&search=postgres).
3. Install **Neon** (recommended) or another Postgres provider:
   - Click **Neon** → **Add Integration** → connect your Vercel project.
   - Create a new Neon database or link an existing one. Vercel will inject `DATABASE_URL` (and optionally `DATABASE_URL_UNPOOLED`) into your project.
4. Redeploy the project so the new env vars are available to API routes.

## 2. Run the schema (create tables)

1. In the Neon dashboard (or your provider’s SQL editor), open the SQL editor for your database.
2. Copy the contents of **`sql/schema.sql`** in this repo.
3. Run the script. It creates:
   - **`employers`** – company accounts (email, hashed password, company name, contact name, etc.)
   - **`candidates`** – job seeker accounts (email, hashed password, full name, phone, resume URL, etc.)
   - Indexes and optional `updated_at` triggers.

You only need to run the schema once per database.

## 3. Deploy

- Push to your Git branch; Vercel will deploy and run the API routes under `/api/auth/...`.
- Ensure the project has **Node.js 18+** and that `npm install` runs (so `@neondatabase/serverless` is installed).

## 4. Environment variables

After adding Neon (or another Postgres integration) via the Marketplace, Vercel should set:

| Variable         | Description                    |
|------------------|--------------------------------|
| `DATABASE_URL`   | Postgres connection string     |

If you use another provider, set `DATABASE_URL` manually in **Project → Settings → Environment Variables**.

## 5. API endpoints

| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST   | `/api/auth/register/employer`  | `{ companyName, contactName, email, password }` | Register employer |
| POST   | `/api/auth/register/candidate` | `{ fullName, email, password, phone?, resumeUrl? }` | Register job seeker |
| POST   | `/api/auth/login`              | `{ email, password, role: "employer" \| "candidate" }` | Login |

Responses are JSON: `{ success: true, user }` or `{ success: false, error }`. Passwords are hashed server-side (scrypt); they are never stored in plain text.

## 6. Frontend behavior

- **Employer / Candidate register and login forms** call the API first (`/api/auth/register/...`, `/api/auth/login`).
- If the request succeeds, the returned user is stored in the session (e.g. `localStorage` for the session payload) and the user is redirected as before.
- If the API is unavailable (e.g. no database, or network error), the app falls back to the existing **localStorage**-based auth so the site still works in demo mode.

## 7. Security notes

- Passwords are hashed on the server with **scrypt** (salt + hash stored in the database).
- Use **HTTPS** in production (Vercel provides this).
- For production, consider adding rate limiting, CSRF, and stricter session handling (e.g. HTTP-only cookies or short-lived tokens).

## 8. Files for database and dashboards

| Purpose | Path |
|--------|------|
| **Database** | |
| Schema (tables) | `sql/schema.sql` |
| DB connection | `api/lib/db.js` |
| Password hash/verify | `api/lib/auth.js` |
| **API (auth)** | |
| Register employer | `api/auth/register/employer.js` |
| Register candidate | `api/auth/register/candidate.js` |
| Login | `api/auth/login.js` |
| **Frontend** | |
| Auth (API + fallback) | `js/auth.js` |
| Employer dashboard | `employer/employer-dashboard.html` |
| Candidate dashboard | `candidate/candidate-dashboard.html` |
| Employer login/register | `employer/employer-login.html`, `employer/employer-register.html` |
| Candidate login/register | `candidate/candidate-login.html`, `candidate/candidate-register.html` |
| **Config** | |
| Env (local) | `.env.development.local` (from `vercel env pull`; do not commit) |
| Example env | `.env.example` |

## 9. Troubleshooting

- **"DATABASE_URL is not set"**  
  Add the Postgres integration (e.g. Neon) to the Vercel project and redeploy, or set `DATABASE_URL` in Environment Variables.

- **Tables don’t exist**  
  Run `sql/schema.sql` in your Neon (or provider) SQL editor.

- **Registration/Login still use localStorage**  
  Ensure you’re on the same origin as the deployed site (e.g. `https://your-app.vercel.app`) so `/api/...` requests hit your Vercel functions. Local file opening (`file://`) may not call the API correctly; use `vercel dev` or deploy to test.

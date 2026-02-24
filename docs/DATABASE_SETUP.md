# WRS Database Setup (Vercel + Postgres)

> **Easy overview first?** See [DATABASE_INTEGRATION.md](DATABASE_INTEGRATION.md) for a simple explanation of how the database connects to the site.

This project stores **employer** and **job seeker (candidate)** accounts in a Postgres database when deployed on Vercel. Locally or without a database, auth falls back to `localStorage` (demo mode).

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

## 8. Troubleshooting

- **"DATABASE_URL is not set"**  
  Add the Postgres integration (e.g. Neon) to the Vercel project and redeploy, or set `DATABASE_URL` in Environment Variables.

- **Tables don’t exist**  
  Run `sql/schema.sql` in your Neon (or provider) SQL editor.

- **Registration/Login still use localStorage**  
  Ensure you’re on the same origin as the deployed site (e.g. `https://your-app.vercel.app`) so `/api/...` requests hit your Vercel functions. Local file opening (`file://`) may not call the API correctly; use `vercel dev` or deploy to test.

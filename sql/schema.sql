-- WRS Accounts Database Schema (Vercel / Neon Postgres)
-- Run this in your Neon SQL editor after connecting the database to Vercel.

-- Employers (company accounts)
CREATE TABLE IF NOT EXISTS employers (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  company_name  TEXT NOT NULL,
  contact_name  TEXT NOT NULL,
  verified      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_employers_email ON employers(email);

-- Candidates (job seekers)
CREATE TABLE IF NOT EXISTS candidates (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  full_name     TEXT NOT NULL,
  phone         TEXT DEFAULT '',
  resume_url    TEXT DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);

-- Optional: updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS employers_updated ON employers;
CREATE TRIGGER employers_updated
  BEFORE UPDATE ON employers
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

DROP TRIGGER IF EXISTS candidates_updated ON candidates;
CREATE TRIGGER candidates_updated
  BEFORE UPDATE ON candidates
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

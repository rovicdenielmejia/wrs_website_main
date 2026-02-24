import { neon } from '@neondatabase/serverless';

let sql = null;

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Add a Postgres database (e.g. Neon) in Vercel project settings.');
  }
  if (!sql) sql = neon(process.env.DATABASE_URL);
  return sql;
}

export { getDb };

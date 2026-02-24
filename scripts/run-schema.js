/**
 * Run sql/schema.sql against the database.
 * Requires DATABASE_URL (e.g. from .env.development.local after vercel env pull).
 * Usage: node scripts/run-schema.js
 */
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Pool } from '@neondatabase/serverless';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.development.local if present
const envPath = join(__dirname, '..', '.env.development.local');
if (existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set. Run: vercel env pull .env.development.local');
  process.exit(1);
}

const schemaPath = join(__dirname, '..', 'sql', 'schema.sql');
const fullSql = readFileSync(schemaPath, 'utf8');

// Split into statements (keep $$...$$ blocks intact)
const statements = [];
let current = '';
let inDollar = false;
let i = 0;
while (i < fullSql.length) {
  if (!inDollar && fullSql.slice(i, i + 2) === '$$') {
    inDollar = true;
    current += '$$';
    i += 2;
    continue;
  }
  if (inDollar && fullSql.slice(i, i + 2) === '$$') {
    inDollar = false;
    current += '$$';
    i += 2;
    continue;
  }
  if (!inDollar && fullSql[i] === ';') {
    const stmt = current.replace(/^\s*--[^\n]*\n/gm, '').trim();
    if (stmt) statements.push(stmt);
    current = '';
    i++;
    continue;
  }
  current += fullSql[i];
  i++;
}
if (current.trim()) {
  const stmt = current.replace(/^\s*--[^\n]*\n/gm, '').trim();
  if (stmt) statements.push(stmt);
}

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  console.log('Running schema against Neon...');
  for (let j = 0; j < statements.length; j++) {
    const stmt = statements[j];
    if (!stmt) continue;
    try {
      await pool.query(stmt);
      const preview = stmt.slice(0, 50).replace(/\s+/g, ' ');
      console.log(`  OK: ${preview}...`);
    } catch (err) {
      if (err.code === '42710') console.log('  SKIP (already exists):', stmt.slice(0, 40) + '...');
      else throw err;
    }
  }
  await pool.end();
  console.log('Schema applied successfully.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

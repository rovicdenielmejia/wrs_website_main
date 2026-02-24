import { getDb } from '../lib/db.js';
import { verifyPassword } from '../lib/auth.js';

export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { email, password, role } = req.body || {};
  if (!email || !password || !role) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: email, password, role (employer|candidate).',
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const sql = getDb();

    if (role === 'employer') {
      const rows = await sql`
        SELECT id, email, password_hash, password_salt, company_name, contact_name, verified
        FROM employers WHERE email = ${normalizedEmail} LIMIT 1
      `;
      const row = rows[0];
      if (!row || !verifyPassword(password, row.password_salt, row.password_hash)) {
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }
      const user = {
        id: row.id,
        email: row.email,
        companyName: row.company_name,
        contactName: row.contact_name,
        role: 'employer',
        verified: row.verified,
      };
      return res.status(200).json({ success: true, user });
    }

    if (role === 'candidate') {
      const rows = await sql`
        SELECT id, email, password_hash, password_salt, full_name, phone, resume_url
        FROM candidates WHERE email = ${normalizedEmail} LIMIT 1
      `;
      const row = rows[0];
      if (!row || !verifyPassword(password, row.password_salt, row.password_hash)) {
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }
      const user = {
        id: row.id,
        email: row.email,
        fullName: row.full_name,
        phone: row.phone || '',
        resumeUrl: row.resume_url || '',
        role: 'candidate',
      };
      return res.status(200).json({ success: true, user });
    }

    return res.status(400).json({ success: false, error: 'Invalid role. Use employer or candidate.' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: 'Login failed. Please try again.' });
  }
}

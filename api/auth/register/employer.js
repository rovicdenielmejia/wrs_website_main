import { getDb } from '../../lib/db.js';
import { hashPassword, randomId } from '../../lib/auth.js';

export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { companyName, contactName, email, password } = req.body || {};
  if (!email || !password || !companyName || !contactName) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: companyName, contactName, email, password.',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
  }

  try {
    const sql = getDb();
    const { salt, hash } = hashPassword(password);
    const id = randomId('emp');

    await sql`
      INSERT INTO employers (id, email, password_hash, password_salt, company_name, contact_name)
      VALUES (${id}, ${email.trim().toLowerCase()}, ${hash}, ${salt}, ${companyName.trim()}, ${contactName.trim()})
    `;

    const user = {
      id,
      email: email.trim().toLowerCase(),
      companyName: companyName.trim(),
      contactName: contactName.trim(),
      role: 'employer',
      verified: false,
    };
    return res.status(201).json({ success: true, user });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
    }
    console.error('Employer register error:', err);
    return res.status(500).json({ success: false, error: 'Registration failed. Please try again.' });
  }
}

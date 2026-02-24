import { getDb } from '../../lib/db.js';
import { hashPassword, randomId } from '../../lib/auth.js';

export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { fullName, email, password, phone, resumeUrl } = req.body || {};
  if (!email || !password || !fullName) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: fullName, email, password.',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
  }

  try {
    const sql = getDb();
    const { salt, hash } = hashPassword(password);
    const id = randomId('cand');

    await sql`
      INSERT INTO candidates (id, email, password_hash, password_salt, full_name, phone, resume_url)
      VALUES (${id}, ${email.trim().toLowerCase()}, ${hash}, ${salt}, ${fullName.trim()}, ${(phone || '').trim()}, ${(resumeUrl || '').trim()})
    `;

    const user = {
      id,
      email: email.trim().toLowerCase(),
      fullName: fullName.trim(),
      phone: (phone || '').trim(),
      resumeUrl: (resumeUrl || '').trim(),
      role: 'candidate',
    };
    return res.status(201).json({ success: true, user });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
    }
    console.error('Candidate register error:', err);
    return res.status(500).json({ success: false, error: 'Registration failed. Please try again.' });
  }
}

import crypto from 'crypto';

const SALT_LEN = 16;
const KEY_LEN = 64;

export function hashPassword(password, salt) {
  const s = salt || crypto.randomBytes(SALT_LEN).toString('hex');
  const hash = crypto.scryptSync(password, s, KEY_LEN).toString('hex');
  return { salt: s, hash };
}

export function verifyPassword(password, salt, storedHash) {
  const { hash } = hashPassword(password, salt);
  return hash === storedHash;
}

export function randomId(prefix) {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

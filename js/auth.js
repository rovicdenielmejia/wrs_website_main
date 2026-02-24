/**
 * WRS Authentication System
 * Role-based access: Admin | Recruiter | Employer | Candidate
 * Uses Vercel API + Postgres when available; falls back to localStorage (demo/dev).
 * GDPR + Philippines Data Privacy Act compliant patterns.
 */

function apiBase() {
  if (typeof window === 'undefined') return '';
  return window.location.origin || '';
}

const AUTH_KEYS = {
    SESSION: 'wrs_session',
    USERS: 'wrs_users',
    EMPLOYERS: 'wrs_employers',
    CANDIDATES: 'wrs_candidates',
};

const ROLES = { ADMIN: 'admin', RECRUITER: 'recruiter', EMPLOYER: 'employer', CANDIDATE: 'candidate' };

function initAuth() {
    if (!localStorage.getItem(AUTH_KEYS.USERS)) {
        localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify([
            { email: 'admin@wrs.com', password: hashPassword('admin123'), role: ROLES.ADMIN }
        ]));
    }
}

function hashPassword(pass) {
    return btoa(unescape(encodeURIComponent(pass + '_wrs_salt')));
}

function verifyPassword(pass, hash) {
    return hashPassword(pass) === hash;
}

function getSession() {
    try {
        const s = localStorage.getItem(AUTH_KEYS.SESSION);
        return s ? JSON.parse(s) : null;
    } catch {
        return null;
    }
}

function setSession(user) {
    const session = {
        email: user.email,
        role: user.role,
        name: user.name || user.fullName || user.companyName || user.contactName || 'User',
        id: user.id,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    };
    localStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(session));
    return session;
}

function clearSession() {
    localStorage.removeItem(AUTH_KEYS.SESSION);
}

function isAuthenticated() {
    const s = getSession();
    return s && s.expiresAt > Date.now();
}

function requireRole(allowedRoles, redirectUrl) {
    if (!Array.isArray(allowedRoles)) allowedRoles = [allowedRoles];
    const s = getSession();
    if (!s || s.expiresAt <= Date.now()) {
        if (redirectUrl) window.location.href = redirectUrl;
        return false;
    }
    if (!allowedRoles.includes(s.role)) {
        if (redirectUrl) window.location.href = redirectUrl;
        return false;
    }
    return s;
}

function login(email, password, role) {
    initAuth();
    const employers = JSON.parse(localStorage.getItem(AUTH_KEYS.EMPLOYERS) || '[]');
    const candidates = JSON.parse(localStorage.getItem(AUTH_KEYS.CANDIDATES) || '[]');
    const users = JSON.parse(localStorage.getItem(AUTH_KEYS.USERS) || '[]');

    let user = null;

    if (role === ROLES.EMPLOYER) {
        user = employers.find(e => e.email === email && verifyPassword(password, e.password));
        if (user) user.role = ROLES.EMPLOYER;
    } else if (role === ROLES.CANDIDATE) {
        user = candidates.find(c => c.email === email && verifyPassword(password, c.password));
        if (user) user.role = ROLES.CANDIDATE;
    } else {
        user = users.find(u => u.email === email && verifyPassword(password, u.password));
        if (user) user.role = user.role || ROLES.ADMIN;
    }

    if (user) {
        setSession(user);
        return { success: true, user };
    }
    return { success: false, error: 'Invalid email or password.' };
}

async function loginWithApi(email, password, role) {
    const base = apiBase();
    if (!base) return login(email, password, role);
    try {
        const res = await fetch(`${base}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role }),
        });
        const data = await res.json();
        if (data.success && data.user) {
            setSession(data.user);
            return { success: true, user: data.user };
        }
        return { success: false, error: data.error || 'Invalid email or password.' };
    } catch (_) {
        return login(email, password, role);
    }
}

function registerEmployer(data) {
    const employers = JSON.parse(localStorage.getItem(AUTH_KEYS.EMPLOYERS) || '[]');
    if (employers.some(e => e.email === data.email)) {
        return { success: false, error: 'An account with this email already exists.' };
    }
    const id = 'emp_' + Date.now();
    const employer = {
        id,
        email: data.email,
        password: hashPassword(data.password),
        companyName: data.companyName,
        contactName: data.contactName,
        role: ROLES.EMPLOYER,
        verified: false
    };
    employers.push(employer);
    localStorage.setItem(AUTH_KEYS.EMPLOYERS, JSON.stringify(employers));
    setSession(employer);
    return { success: true, user: employer };
}

async function registerEmployerWithApi(data) {
    const base = apiBase();
    if (!base) return registerEmployer(data);
    try {
        const res = await fetch(`${base}/api/auth/register/employer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                companyName: data.companyName,
                contactName: data.contactName,
                email: data.email,
                password: data.password,
            }),
        });
        const result = await res.json();
        if (result.success && result.user) {
            setSession(result.user);
            return { success: true, user: result.user };
        }
        return { success: false, error: result.error || 'Registration failed.' };
    } catch (_) {
        return registerEmployer(data);
    }
}

function registerCandidate(data) {
    const candidates = JSON.parse(localStorage.getItem(AUTH_KEYS.CANDIDATES) || '[]');
    if (candidates.some(c => c.email === data.email)) {
        return { success: false, error: 'An account with this email already exists.' };
    }
    const id = 'cand_' + Date.now();
    const candidate = {
        id,
        email: data.email,
        password: hashPassword(data.password),
        fullName: data.fullName,
        phone: data.phone || '',
        resumeUrl: data.resumeUrl || '',
        role: ROLES.CANDIDATE
    };
    candidates.push(candidate);
    localStorage.setItem(AUTH_KEYS.CANDIDATES, JSON.stringify(candidates));
    setSession(candidate);
    return { success: true, user: candidate };
}

async function registerCandidateWithApi(data) {
    const base = apiBase();
    if (!base) return registerCandidate(data);
    try {
        const res = await fetch(`${base}/api/auth/register/candidate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: data.fullName,
                email: data.email,
                phone: data.phone || '',
                resumeUrl: data.resumeUrl || '',
                password: data.password,
            }),
        });
        const result = await res.json();
        if (result.success && result.user) {
            setSession(result.user);
            return { success: true, user: result.user };
        }
        return { success: false, error: result.error || 'Registration failed.' };
    } catch (_) {
        return registerCandidate(data);
    }
}

function logout() {
    clearSession();
    window.location.href = '../home.html';
}

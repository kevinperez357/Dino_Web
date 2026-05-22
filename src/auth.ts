// Autenticación: usa el backend (POST /api/login, /api/register) si está
// disponible. Si no, cae a credenciales locales para modo estático/demo.

const API_BASE = 'http://localhost:3000/api';
const STORAGE_KEY = 'dino-session';

export interface Session {
  email: string;
  nombre: string;
  usuario_id?: number;
  loggedAt: number;
}

const LOCAL_USERS: Record<string, { password: string; nombre: string }> = {
  'admin@dino.com': { password: 'admin123', nombre: 'Administrador' },
  'invitado@dino.com': { password: 'invitado', nombre: 'Invitado' },
};

export function getSession(): Session | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as Session; }
  catch { return null; }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

function saveSession(session: Session): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export async function login(email: string, password: string): Promise<Session> {
  const trimmedEmail = email.trim().toLowerCase();

  // 1) Intentar contra el backend
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: trimmedEmail, password }),
    });
    if (res.ok) {
      const data = await res.json();
      const session: Session = {
        email: data.email,
        nombre: data.nombre,
        usuario_id: data.usuario_id,
        loggedAt: Date.now(),
      };
      saveSession(session);
      return session;
    }
    if (res.status === 401) {
      throw new Error('Email o contraseña incorrectos');
    }
    // Si el backend respondió con otro error, lo propagamos
    const err = await res.json().catch(() => ({ error: 'Error del servidor' }));
    throw new Error(err.error || 'Error del servidor');
  } catch (e) {
    const msg = (e as Error).message;
    // Si el backend no está disponible (CORS / red), fallback local
    if (msg === 'Failed to fetch' || msg.toLowerCase().includes('networkerror')) {
      return loginLocal(trimmedEmail, password);
    }
    throw e;
  }
}

async function loginLocal(email: string, password: string): Promise<Session> {
  await new Promise(r => setTimeout(r, 200));
  const user = LOCAL_USERS[email];
  if (!user || user.password !== password) {
    throw new Error('Email o contraseña incorrectos (modo offline)');
  }
  const session: Session = {
    email,
    nombre: user.nombre,
    loggedAt: Date.now(),
  };
  saveSession(session);
  return session;
}

export async function register(email: string, password: string, nombre: string): Promise<void> {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim().toLowerCase(), password, nombre }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error en registro' }));
    throw new Error(err.error || 'Error en registro');
  }
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}

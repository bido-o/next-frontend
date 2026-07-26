import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { refreshToken as refreshTokenApi, type AuthResponse } from '@/lib/api/auth';
import { AUTH_ROUTES, COOKIE_MAX_AGE, COOKIE_NAMES, SESSION_END_ROUTE } from '@/lib/constants';
import { isExpired } from './jwt';

const baseOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

/* ─────────────── citire ─────────────── */

export async function getSession(): Promise<AuthResponse | null> {
  const store = await cookies();
  const accessToken = store.get(COOKIE_NAMES.ACCESS)?.value;
  const refreshToken = store.get(COOKIE_NAMES.REFRESH)?.value;
  
  if (!accessToken || !refreshToken) return null;
  
  return { accessToken, refreshToken };
}

/* ─────────────── scriere ─────────────── */

export async function setSession({ accessToken, refreshToken }: AuthResponse) {
  const store = await cookies();
  store.set(COOKIE_NAMES.ACCESS, accessToken, { ...baseOptions, maxAge: COOKIE_MAX_AGE.ACCESS });
  store.set(COOKIE_NAMES.REFRESH, refreshToken, { ...baseOptions, maxAge: COOKIE_MAX_AGE.REFRESH });
}

/* ─────────────── stergere ─────────────── */

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAMES.ACCESS);
  store.delete(COOKIE_NAMES.REFRESH);
}

/**
 * Închide o sesiune moartă și redirecționează la login, ștergând cookie-urile.
 *
 * Din Server Actions putem scrie cookie-uri → le ștergem aici și mergem direct
 * la login (un singur hop). Din Server Components scrierea e interzisă în timpul
 * randării → `clearSession` aruncă, iar noi ocolim prin Route Handler-ul de logout,
 * care are un context HTTP unde poate șterge cookie-urile.
 */
export async function endSession(): Promise<never> {
  let cleared = false;
  try {
    await clearSession();
    cleared = true;
  } catch {
    // Server Component: cookie-urile nu pot fi scrise în timpul randării.
  }
  redirect(cleared ? AUTH_ROUTES.EMAIL : SESSION_END_ROUTE);
}

/* ─────────────── refresh ─────────────── */

/**
 * Returnează un access token valid, refresh-uind automat dacă e expirat.
 *
 * poate fi apelată DOAR din Server Actions sau Route Handlers
 * interzis în Server Components).
 *
 * Returnează `null` dacă nu există sesiune sau refresh-ul a eșuat.
 */
export async function getValidAccessToken(): Promise<string | null> {
  const session = await getSession();
  if (!session) return null;

  if (!isExpired(session.accessToken)) {
    return session.accessToken;
  }

  try {
    const tokens = await refreshTokenApi(session.refreshToken);
    await setSession(tokens);
    return tokens.accessToken;
  } catch {
    await clearSession();
    return null;
  }
}

/**
 * Asigură că există un access token valid; altfel redirect la /auth/email.
 * Returnează tokenul valid.
 * Server Actions / Route Handlers
 */
export async function requireAccessToken(): Promise<string> {
  const token = await getValidAccessToken();
  if (!token) redirect(AUTH_ROUTES.EMAIL); // nu există sesiune validă → intrarea unificată login/register
  return token;
}

/**
 * Pentru Server Components: verifică doar existența sesiunii (fără refresh).
 * Dacă access-ul s-a expirat dar refresh-ul există, redirect — Server Components nu pot modifica cookies.
 */
export async function requireSession(): Promise<AuthResponse> {
  const session = await getSession();
  if (!session) redirect(AUTH_ROUTES.EMAIL); // nu există sesiune → intrarea unificată login/register
  return session;
}

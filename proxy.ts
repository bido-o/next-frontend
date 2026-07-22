import { NextResponse, type NextRequest } from 'next/server';

import { API_BASE, API_PATHS, COOKIE_NAMES, COOKIE_MAX_AGE } from '@/lib/constants';

// Verificare de expirare compatibilă cu Edge runtime (atob, nu Buffer).
function isExpired(token: string, skewSeconds = 30): boolean {
  try {
    const [, payload] = token.split('.');
    if (!payload) return true;
    
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const { exp } = JSON.parse(json) as { exp: number };
    return exp * 1000 < Date.now() + skewSeconds * 1000;
  } catch {
    return true;
  }
}

/**
 * Reîmprospătează automat access token-ul expirat înainte ca cererea să ajungă
 * la Server Components (care nu pot scrie cookies în timpul randării).
 *
 * Dacă access-ul e expirat dar refresh-ul e valid, apelează auth service,
 * setează cookie-urile noi și redirecționează la aceeași adresă — astfel
 * request-ul următor ajunge la pagină cu un token proaspăt.
 *
 */
export async function proxy(req: NextRequest) {
  const access = req.cookies.get(COOKIE_NAMES.ACCESS)?.value;
  const refresh = req.cookies.get(COOKIE_NAMES.REFRESH)?.value;

  // Fără refresh, sau access încă valid → nimic de făcut.
  if (!refresh || (access && !isExpired(access))) {
    return NextResponse.next();
  }

  try {
    const res = await fetch(`${API_BASE}${API_PATHS.REFRESH_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ refreshToken: refresh }),
    });
    if (!res.ok) return NextResponse.next(); // refresh eșuat → requireSession va redirecționa

    const tokens = (await res.json()) as { accessToken: string; refreshToken: string };

    const response = NextResponse.redirect(req.url);
    const base = {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    };
    
    response.cookies.set(COOKIE_NAMES.ACCESS, tokens.accessToken, {
      ...base,
      maxAge: COOKIE_MAX_AGE.ACCESS,
    });
    response.cookies.set(COOKIE_NAMES.REFRESH, tokens.refreshToken, {
      ...base,
      maxAge: COOKIE_MAX_AGE.REFRESH,
    });
    return response;
  } catch {
    return NextResponse.next();
  }
}

// Rulează doar pe paginile protejate care randează date din API.
export const config = {
  matcher: ['/', '/requests/:path*'],
};

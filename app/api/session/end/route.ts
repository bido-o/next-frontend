import { NextResponse, type NextRequest } from 'next/server';

import { AUTH_ROUTES, COOKIE_NAMES } from '@/lib/constants';

/**
 * Închide sesiunea și redirecționează la login.
 *
 * Există pentru că Server Components nu pot scrie cookie-uri în timpul randării.
 * pt suspendarea unui user
 */
export function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL(AUTH_ROUTES.EMAIL, req.url));
  res.cookies.delete(COOKIE_NAMES.ACCESS);
  res.cookies.delete(COOKIE_NAMES.REFRESH);
  return res;
}

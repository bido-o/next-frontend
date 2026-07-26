import type { AccountRole } from '@/lib/constants';

export type JwtPayload = {
  sub: string;
  email: string;
  role: AccountRole;
  exp: number;
  iat: number;
};

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split('.'); 
    if (!payload) return null;

    const json = Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function isExpired(token: string, defaultSeconds = 30): boolean {
  const payload = decodeJwt(token);
  if (!payload) return true;
  return payload.exp * 1000 < Date.now() + defaultSeconds * 1000; //consideră tokenul expirat cu 30 secunde înainte de expirarea reală
}
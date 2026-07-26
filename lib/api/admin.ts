import { apiFetch } from './client';
import { API_PATHS } from '@/lib/constants';

/**
 * Confirmă la backend că sesiunea curentă chiar e de admin.
 *
 * Frontend-ul nu poate valida semnătura JWT, deci nu se poate încrede în rolul citit din token.
 * Gateway-ul validează semnătura, auth service verifică rolul:
 *   200 → admin · 403 → autentificat dar nu admin · 401 → token respins.
 */
export function verifyAdmin(accessToken: string) {
  return apiFetch<void>(API_PATHS.ADMIN_ME, { accessToken });
}

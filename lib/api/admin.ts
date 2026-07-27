import { apiFetch } from './client';
import { API_PATHS } from '@/lib/constants';
import type { AdminUserListDto } from '@/types/admin';

/**
 * Conturile gestionabile (client + furnizor); adminii nu apar în listă.
 *
 * Endpoint-ul cere ADMIN, iar gateway-ul validează semnătura tokenului — deci
 * cererea e și verificarea de autorizare: un 403 înseamnă „nu ești admin”.
 */
export function listUsers(accessToken: string) {
  return apiFetch<AdminUserListDto[]>(API_PATHS.ADMIN_USERS, { accessToken });
}

/** Suspendă sau reactivează un cont. */
export function setUserSuspension(userId: number, suspend: boolean, accessToken: string) {
  const action = suspend ? 'suspend' : 'unsuspend';
  return apiFetch<void>(`${API_PATHS.ADMIN_USERS}/${userId}/${action}`, {
    method: 'POST',
    accessToken,
  });
}

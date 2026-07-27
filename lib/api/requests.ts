import { apiFetch } from './client';
import { API_PATHS } from '@/lib/constants';
import type { CreateRequestInput, RequestResponse } from '@/types/request';

export function createRequest(input: CreateRequestInput, accessToken: string) {
  return apiFetch<RequestResponse>(API_PATHS.REQUESTS, {
    method: 'POST',
    body: input,
    accessToken,
  });
}

export function getRequest(id: number, accessToken: string) {
  return apiFetch<RequestResponse>(`${API_PATHS.REQUESTS}/${id}`, { accessToken });
}

// Listează cererile utilizatorului curent. Gateway-ul filtrează automat
// după clientId din JWT, deci clientul primește doar propriile cereri.
export function listRequests(accessToken: string) {
  return apiFetch<RequestResponse[]>(API_PATHS.REQUESTS, { accessToken });
}

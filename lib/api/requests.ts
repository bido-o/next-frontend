import { apiFetch } from './client';
import { API_PATHS, type LocationCity } from '@/lib/constants';

// Oglindește CreateRequestDto din bidding-service
export type CreateRequestInput = {
  eventTypeId: number;
  nrPersons: number;
  budgetTotal: number;
  budgetFlexible: boolean;
  eventDate: string; 
  locationCity?: LocationCity;
  locationAddress?: string;
  message?: string;
  deliveryIncluded: boolean;
  expiresAt?: string; 
};

export type RequestStatus = 'OPEN' | 'CLOSED' | 'EXPIRED' | 'CANCELLED';

export type RequestResponse = {
  id: number;
  nrPersons: number;
  budgetTotal: number;
  budgetFlexible: boolean;
  eventDate: string;
  locationCity: LocationCity | null;
  locationAddress: string | null;
  message: string | null;
  deliveryIncluded: boolean;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  status: RequestStatus;
  clientId: number;
  eventTypeId: number;
  eventTypeName: string;
};

// Oglindește RequestPublicDto din bidding-service — proiecția pentru furnizori.
// Omite intenționat clientId, locationAddress și updatedAt (date sensibile).
export type RequestPublicResponse = {
  id: number;
  nrPersons: number;
  budgetTotal: number;
  budgetFlexible: boolean;
  eventDate: string;
  locationCity: LocationCity | null;
  message: string | null;
  deliveryIncluded: boolean;
  createdAt: string;
  expiresAt: string | null;
  status: RequestStatus;
  eventTypeId: number;
  eventTypeName: string;
};

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

// Listează cererile deschise disponibile pentru furnizori (proiecție publică).
export function listAvailableRequests(accessToken: string) {
  return apiFetch<RequestPublicResponse[]>(`${API_PATHS.REQUESTS}/public`, { accessToken });
}

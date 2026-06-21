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

export type RequestResponse = {
  id: number;
  nrPersons: number | null;
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
  status: 'OPEN' | 'CLOSED' | 'EXPIRED' | 'CANCELLED';
  clientId: number;
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

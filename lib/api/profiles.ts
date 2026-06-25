import { apiFetch } from './client';
import { API_PATHS } from '@/lib/constants';

export type ClientProfileInput = {
  firstName: string;
  lastName: string;
};

export type SupplierProfileInput = {
  companyName: string;
};

export type ClientProfile = {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  companyName: string | null;
  cui: string | null;
  billingAddress: string | null;
};

export type SupplierProfile = {
  id: number;
  companyName: string;
  creditBalance: number | null;
  minOrder: number | null;
  avgRating: number | null;
  acceptsOnlinePayments: boolean | null;
  hasLegalInfo: boolean | null;
  totalOffersWon: number | null;
  totalDisputesLost: number | null;
  totalOffersSubmitted: number | null;
};

export function createClientProfile(input: ClientProfileInput, accessToken: string) {
  return apiFetch(API_PATHS.CLIENT_PROFILES, {
    method: 'POST',
    body: input,
    accessToken,
  });
}

export function createSupplierProfile(input: SupplierProfileInput, accessToken: string) {
  return apiFetch(API_PATHS.SUPPLIER_PROFILES, {
    method: 'POST',
    body: input,
    accessToken,
  });
}

// GET
export function getClientProfile(accessToken: string) {
  return apiFetch<ClientProfile>(API_PATHS.CLIENT_PROFILES, { accessToken });
}

export function getSupplierProfile(accessToken: string) {
  return apiFetch<SupplierProfile>(API_PATHS.SUPPLIER_PROFILES, { accessToken });
}

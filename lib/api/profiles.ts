import { apiFetch } from './client';
import { API_PATHS } from '@/lib/constants';

export type ClientProfileInput = {
  firstName: string;
  lastName: string;
};

export type SupplierProfileInput = {
  companyName: string;
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

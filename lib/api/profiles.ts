import { apiFetch } from './client';
import { API_PATHS } from '@/lib/constants';
import type {
  ClientProfile,
  ClientProfileInput,
  SupplierProfile,
  SupplierProfileInput,
} from '@/types/profile';

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

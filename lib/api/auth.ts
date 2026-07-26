import { apiFetch } from './client';
import { API_PATHS, type SignupRole } from '@/lib/constants';

export type AuthResponse = { accessToken: string; refreshToken: string };

export function requestOtp(email: string, role?: SignupRole) {
  return apiFetch<string>(API_PATHS.REQUEST_OTP, {
    method: 'POST',
    body: { email, role },
  });
}

export function verifyOtp(email: string, otpCode: string) {
  return apiFetch<AuthResponse>(API_PATHS.VERIFY_OTP, {
    method: 'POST',
    body: { email, otpCode },
  });
}

export function refreshToken(refreshToken: string) {
  return apiFetch<AuthResponse>(API_PATHS.REFRESH_TOKEN, {
    method: 'POST',
    body: { refreshToken },
  });
}
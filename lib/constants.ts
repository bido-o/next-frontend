export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export const COOKIE_NAMES = {
  ACCESS: 'bido_access',
  REFRESH: 'bido_refresh',
  FLOW: 'bido_flow',
} as const;

export const COOKIE_MAX_AGE = {
  ACCESS: 60 * 15,            // 15 min
  REFRESH: 60 * 60 * 24 * 30, // 30 zile
  FLOW: 60 * 10,              // 10 min
} as const;

export const ROLES = {
  CLIENT: 'CLIENT',
  SUPPLIER: 'SUPPLIER',
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

export const API_PATHS = {
  REQUEST_OTP: '/api/auth/request-otp',
  VERIFY_OTP: '/api/auth/verify-otp',
  REFRESH_TOKEN: '/api/auth/refresh-token',
  CLIENT_PROFILES: '/api/client-profiles',
  SUPPLIER_PROFILES: '/api/supplier-profiles',
} as const;

export const AUTH_ROUTES = {
  ROLE: '/auth/select-role',
  EMAIL: '/auth/email',
  VERIFY: '/auth/verify-code',
  PROFILE: '/auth/profile',
} as const;
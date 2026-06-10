export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

// ─────────── Auth&Profile — auth form ───────────

export const COOKIE_NAMES = {
  ACCESS: 'bido_access',
  REFRESH: 'bido_refresh',
  FLOW: 'bido_flow',
  REQUEST_FLOW: 'bido_request_flow',
} as const;

export const COOKIE_MAX_AGE = {
  ACCESS: 60 * 15,            // 15 min
  REFRESH: 60 * 60 * 24 * 30, // 30 zile
  FLOW: 60 * 10,              // 10 min
  REQUEST_FLOW: 60 * 20,      // 20 min 
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
  REQUESTS: '/api/requests',
  EVENT_TYPES: '/api/event-types',
} as const;

export const AUTH_ROUTES = {
  ROLE: '/auth/select-role',
  EMAIL: '/auth/email',
  VERIFY: '/auth/verify-code',
  PROFILE: '/auth/profile',
} as const;

// ─────────── Bidding — request form ───────────

export const REQUEST_ROUTES = {
  TYPE: '/requests/new/type',
  WHEN: '/requests/new/when',
  BUDGET: '/requests/new/budget',
  DONE: '/requests/new/done',
} as const;


export const LOCATION_CITIES = [
  { value: 'BUCURESTI', label: 'București' },
  { value: 'CLUJ', label: 'Cluj-Napoca' },
] as const;
export type LocationCity = (typeof LOCATION_CITIES)[number]['value'];

// Opțiuni pentru cât timp rămâne deschisă cererea (expires_at).
export const EXPIRY_OPTIONS = [
  { value: 24, label: '24h' },
  { value: 48, label: '48h' },
  { value: 72, label: '72h' },
  { value: 168, label: '1 săpt.' },
] as const;
export const DEFAULT_EXPIRY_HOURS = 48;

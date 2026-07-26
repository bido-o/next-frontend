export const API_BASE = process.env.API_URL ?? 'http://localhost:8080';

// ─────────── Auth&Profile — auth form ───────────

export const COOKIE_NAMES = {
  ACCESS: 'bido_access',
  REFRESH: 'bido_refresh',
  AUTH_FLOW: 'bido_auth_flow',
  REQUEST_FLOW: 'bido_request_flow',
} as const;

export const COOKIE_MAX_AGE = {
  ACCESS: 60 * 15,            // 15 min
  REFRESH: 60 * 60 * 24 * 30, // 30 zile
  AUTH_FLOW: 60 * 10,         // 10 min
  REQUEST_FLOW: 60 * 20,      // 20 min 
} as const;

// Toate rolurile pe care le poate avea un cont, așa cum vin în JWT.
// Oglindește enum-ul UserRole din auth service.
export const ROLES = {
  CLIENT: 'CLIENT',
  SUPPLIER: 'SUPPLIER',
  ADMIN: 'ADMIN',
} as const;

export type AccountRole = (typeof ROLES)[keyof typeof ROLES];

// Submulțimea care poate fi ALEASĂ la înregistrare. ADMIN lipsește intenționat
export const SIGNUP_ROLES = [ROLES.CLIENT, ROLES.SUPPLIER] as const;

export type SignupRole = (typeof SIGNUP_ROLES)[number];

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
  ROLE: '/auth/role',
  EMAIL: '/auth/email',
  VERIFY: '/auth/verify',
  PROFILE: '/auth/profile',
} as const;

export const ADMIN_ROUTE = '/admin';

// Route Handler intern de logout: șterge cookie-urile de sesiune și redirect la login.
// Folosit de Server Components, care nu pot scrie cookie-uri în timpul randării.
export const SESSION_END_ROUTE = '/api/session/end';

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

// ─────────── Dashboard ───────────

// Etichetă + ton de culoare pentru fiecare status de cerere.
// `tone` se mapează la clase Tailwind în componenta StatusBadge.
export const REQUEST_STATUS_META = {
  OPEN: { label: 'Așteaptă oferte', tone: 'green' },
  CLOSED: { label: 'Finalizată', tone: 'blue' },
  EXPIRED: { label: 'Expirată', tone: 'neutral' },
  CANCELLED: { label: 'Anulată', tone: 'neutral' },
} as const;

import type { ROLES, SIGNUP_ROLES } from '@/lib/constants';

/**
 * Toate rolurile pe care le poate avea un cont, așa cum vin în JWT.
 * Oglindește enum-ul UserRole din auth service.
 */
export type AccountRole = (typeof ROLES)[keyof typeof ROLES];

/** Submulțimea care poate fi ALEASĂ la înregistrare. ADMIN lipsește intenționat. */
export type SignupRole = (typeof SIGNUP_ROLES)[number];

/** Perechea de tokeni emisă de auth service. */
export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

/**
 * Claim-urile din access token. Sunt doar decodate în frontend (fără verificarea
 * semnăturii) → bune pentru UI
 */
export type JwtPayload = {
  sub: string;
  email: string;
  role: AccountRole;
  exp: number;
  iat: number;
};

/** Pașii flow-ului de autentificare. */
export type AuthFlowStep = 'role' | 'email' | 'verify' | 'profile';

/** Starea acumulată între pașii de autentificare, persistată într-un cookie httpOnly. */
export type AuthFlowState = {
  role?: SignupRole;
  email?: string;
  otpSentAt?: number; // timestamp (ms) când a fost trimis ultimul cod OTP
  completedSteps: AuthFlowStep[];
};

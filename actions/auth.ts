'use server';

import { redirect } from 'next/navigation';

import {
  requestOtp as requestOtpApi,
  verifyOtp as verifyOtpApi,
  type AuthResponse,
} from '@/lib/api/auth';
import {
  createClientProfile,
  createSupplierProfile,
  getClientProfile,
  getSupplierProfile,
} from '@/lib/api/profiles';
import { ApiError } from '@/lib/api/client';
import {
  clearFlowState,
  getFlowState,
  markStepCompleted,
  updateFlowState,
} from '@/lib/auth/auth-flow';
import { decodeJwt } from '@/lib/auth/jwt';
import { requireAccessToken, setSession } from '@/lib/auth/session';
import { AUTH_ROUTES, ROLES, type Role } from '@/lib/constants';
import {
  clientProfileSchema,
  emailSchema,
  otpSchema,
  roleSchema,
  supplierProfileSchema,
} from '@/lib/validation/auth-schemas';
import { apiErrorMessage, handleApiError, zodToFieldErrors } from './helpers';
import type { ActionState } from './types';

// Verifică dacă userul are deja profil (GET → true, 404 → false)
async function profileExists(role: Role | undefined, accessToken: string): Promise<boolean> {
  try {
    if (role === ROLES.SUPPLIER) {
      await getSupplierProfile(accessToken);
    } else {
      await getClientProfile(accessToken);
    }
    return true;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
}

// Pasul 1 — email. Detectează user nou (400 ROLE_MISSING) vs existent (OTP trimis direct)
export async function requestOtp(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = emailSchema.safeParse({ email: formData.get('email') });
  if (!parsed.success) {
    return { status: 'error', message: 'Verifică emailul.', fieldErrors: zodToFieldErrors(parsed.error) };
  }

  let isNewUser = false;
  try {
    await requestOtpApi(parsed.data.email); // fără rol
  } catch (err) {
    if (err instanceof ApiError && err.code === 'ROLE_MISSING') {
      isNewUser = true; // user nou — are nevoie de rol
    } else {
      return { status: 'error', message: apiErrorMessage(err) };
    }
  }

  // User existent → OTP deja trimis, marcăm momentul pentru countdown.
  await markStepCompleted('email', {
    email: parsed.data.email,
    otpSentAt: isNewUser ? undefined : Date.now(),
  });
  redirect(isNewUser ? AUTH_ROUTES.ROLE : AUTH_ROUTES.VERIFY);
}

// Pasul intermediar (doar useri noi) — alege rol, creează userul și trimite OTP
export async function selectRole(_: ActionState, formData: FormData): Promise<ActionState> {
  const flow = await getFlowState();
  if (!flow.email) redirect(AUTH_ROUTES.EMAIL);

  const parsed = roleSchema.safeParse({ role: formData.get('role') });
  if (!parsed.success) {
    return { status: 'error', message: 'Alege un rol.', fieldErrors: zodToFieldErrors(parsed.error) };
  }

  try {
    await requestOtpApi(flow.email, parsed.data.role); // creează user + trimite OTP
  } catch (err) {
    return { status: 'error', message: apiErrorMessage(err) };
  }

  await markStepCompleted('role', { role: parsed.data.role, otpSentAt: Date.now() });
  redirect(AUTH_ROUTES.VERIFY);
}

// Retrimite codul OTP (user existent în DB la acest pas) și actualizează momentul trimiterii
export async function resendOtp(): Promise<{ otpSentAt: number } | { error: string }> {
  const flow = await getFlowState();
  if (!flow.email) redirect(AUTH_ROUTES.EMAIL);

  const now = Date.now();
  try {
    await requestOtpApi(flow.email); // user deja există → OTP trimis (rolul e ignorat)
  } catch (err) {
    return { error: apiErrorMessage(err) };
  }

  await updateFlowState({ otpSentAt: now });
  return { otpSentAt: now };
}

// Pasul OTP — verifică codul, apoi decide destinația după existența profilului
export async function verifyOtp(_: ActionState, formData: FormData): Promise<ActionState> {
  const flow = await getFlowState();
  if (!flow.email) redirect(AUTH_ROUTES.EMAIL);

  const parsed = otpSchema.safeParse({ otpCode: formData.get('otpCode') });
  if (!parsed.success) {
    return { status: 'error', message: 'Cod invalid.', fieldErrors: zodToFieldErrors(parsed.error) };
  }

  let tokens: AuthResponse;
  try {
    tokens = await verifyOtpApi(flow.email, parsed.data.otpCode);
    await setSession(tokens);
  } catch (err) {
    return { status: 'error', message: apiErrorMessage(err, { 401: 'Cod incorect sau expirat.' }) };
  }

  const role = decodeJwt(tokens.accessToken)?.role;
  if (await profileExists(role, tokens.accessToken)) {
    await clearFlowState();
    redirect('/'); // user existent cu profil → homepage
  }

  await markStepCompleted('verify');
  redirect(AUTH_ROUTES.PROFILE); // user fără profil → completează profilul
}

// Pasul 4 - CLIENT — creează profil, redirect la homepage
export async function completeClientProfile(_: ActionState, formData: FormData): Promise<ActionState> {
  const accessToken = await requireAccessToken();

  const parsed = clientProfileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: 'error', message: 'Verifică datele.', fieldErrors: zodToFieldErrors(parsed.error) };
  }

  try {
    await createClientProfile(parsed.data, accessToken);
  } catch (err) {
    return handleApiError(err);
  }

  await clearFlowState();
  redirect('/');
}

// Pasul 4 - SUPPLIER — creează profil, redirect la homepage
export async function completeSupplierProfile(_: ActionState, formData: FormData): Promise<ActionState> {
  const accessToken = await requireAccessToken();

  const parsed = supplierProfileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: 'error', message: 'Verifică datele.', fieldErrors: zodToFieldErrors(parsed.error) };
  }

  try {
    await createSupplierProfile(parsed.data, accessToken);
  } catch (err) {
    return handleApiError(err);
  }

  await clearFlowState();
  redirect('/');
}

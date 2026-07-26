import 'server-only';

import { z } from 'zod';

import { ApiError, SessionExpiredError } from '@/lib/api/client';
import { endSession } from '@/lib/auth/session';
import type { ActionState } from './types';

// Convertește erorile Zod într-un format simplu { câmp: [mesaje] }.
export function zodToFieldErrors(err: z.ZodError): Record<string, string[]> {
  const flat = z.flattenError(err);
  return Object.fromEntries(
    Object.entries(flat.fieldErrors).map(([k, v]) => [k, (v as string[] | undefined) ?? []]),
  );
}

/**
 * Transformă o eroare de API într-un mesaj prietenos pentru user.
 *
 * `statusMessages` permite fiecărui domeniu (auth, requests) să dea mesaje
 * proprii pentru anumite status-uri — restul cad pe comportamentul comun:
 * 429 generic, apoi mesajul de la backend, apoi un fallback generic.
 */
export function apiErrorMessage(
  err: unknown,
  statusMessages: Record<number, string> = {},
): string {
  const generic = 'A apărut o eroare. Reîncearcă.';

  if (err instanceof ApiError) {
    if (statusMessages[err.status]) return statusMessages[err.status];
    if (err.status === 429) return 'Prea multe încercări. Așteaptă câteva minute.';
    return err.message || generic;
  }

  return generic;
}

/**
 * Tratează o eroare dintr-un Server Action autentificat:
 * - sesiune moartă (401 pe cerere cu token) → închide sesiunea + redirect la login (nu revine);
 * - orice altă eroare → ActionState de eroare cu mesaj prietenos.
 */
export async function handleApiError(
  err: unknown,
  statusMessages: Record<number, string> = {},
): Promise<ActionState> {
  if (err instanceof SessionExpiredError) await endSession(); // redirect — nu revine
  return { status: 'error', message: apiErrorMessage(err, statusMessages) };
}

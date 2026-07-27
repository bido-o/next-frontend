'use server';

import { revalidatePath } from 'next/cache';

import { setUserSuspension } from '@/lib/api/admin';
import { requireAccessToken } from '@/lib/auth/session';
import { ADMIN_ROUTE } from '@/lib/constants';
import { handleApiError } from './helpers';
import type { ActionState } from './action-types';

// 401 nu apare aici: pe cerere autentificată e tratat ca sesiune moartă (logout).
const ADMIN_ERROR_MESSAGES: Record<number, string> = {
  403: 'Doar administratorii pot suspenda conturi.',
  404: 'Utilizatorul nu a fost găsit.',
};

/** Suspendă/reactivează un cont, apoi reîmprospătează lista. */
export async function toggleUserSuspension(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const accessToken = await requireAccessToken();

  const userId = Number(formData.get('userId'));
  if (!Number.isInteger(userId) || userId <= 0) {
    return { status: 'error', message: 'Utilizator invalid.' };
  }
  const suspend = formData.get('suspend') === 'true';

  try {
    await setUserSuspension(userId, suspend, accessToken);
  } catch (err) {
    return handleApiError(err, ADMIN_ERROR_MESSAGES);
  }

  revalidatePath(ADMIN_ROUTE);
  return { status: 'idle' };
}

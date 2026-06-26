'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import { ApiError } from '@/lib/api/client';
import { createOffer } from '@/lib/api/offers';
import { requireAccessToken } from '@/lib/auth/session';
import { createOfferSchema } from '@/lib/validation/offer-schemas';
import type { ActionState } from './offer-types';

function zodToFieldErrors(err: z.ZodError): Record<string, string[]> {
  const flat = z.flattenError(err);
  return Object.fromEntries(
    Object.entries(flat.fieldErrors).map(([k, v]) => [k, (v as string[] | undefined) ?? []]),
  );
}

function apiErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 429) return 'Prea multe încercări. Așteaptă câteva minute.';
    if (err.status === 401) return 'Sesiune expirată. Autentifică-te din nou.';
    if (err.status === 403) return 'Doar furnizorii pot trimite oferte.';
    if (err.status === 409) return 'Ai trimis deja o ofertă pentru această cerere.';
    if (err.status === 422 || err.status === 400)
      return 'Cererea nu mai acceptă oferte sau datele nu sunt valide.';
    return 'A apărut o eroare. Reîncearcă.';
  }
  return 'A apărut o eroare. Reîncearcă.';
}

export async function submitOffer(_: ActionState, formData: FormData): Promise<ActionState> {
  const accessToken = await requireAccessToken();

  const parsed = createOfferSchema.safeParse({
    requestId: formData.get('requestId'),
    totalPrice: formData.get('totalPrice'),
    upfrontPayment: formData.get('upfrontPayment'),
    description: formData.get('description'),
    onlinePaymentAvailable: formData.get('onlinePaymentAvailable'),
  });
  if (!parsed.success) {
    return { status: 'error', message: 'Verifică datele ofertei.', fieldErrors: zodToFieldErrors(parsed.error) };
  }

  try {
    await createOffer(
      parsed.data.requestId,
      {
        totalPrice: parsed.data.totalPrice,
        upfrontPayment: parsed.data.upfrontPayment,
        description: parsed.data.description,
        onlinePaymentAvailable: parsed.data.onlinePaymentAvailable,
      },
      accessToken,
    );
  } catch (err) {
    return { status: 'error', message: apiErrorMessage(err) };
  }

  redirect('/supplier/offers');
}

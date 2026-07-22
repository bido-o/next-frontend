'use server';

import { redirect } from 'next/navigation';

import { createRequest } from '@/lib/api/requests';
import { requireAccessToken } from '@/lib/auth/session';
import {
  clearRequestFlow,
  getRequestFlow,
  markRequestStep,
} from '@/lib/bidding/request-flow';
import { REQUEST_ROUTES } from '@/lib/constants';
import {
  budgetStepSchema,
  eventTypeStepSchema,
  whenStepSchema,
} from '@/lib/validation/request-schemas';
import { apiErrorMessage, zodToFieldErrors } from './helpers';
import type { ActionState } from './types';

// Mesaje specifice fluxului de cereri pentru fiecare status de eroare.
const REQUEST_ERROR_MESSAGES: Record<number, string> = {
  401: 'Sesiune expirată. Autentifică-te din nou.',
  403: 'Doar clienții pot publica cereri.',
  400: 'Datele introduse nu sunt valide. Verifică și reîncearcă.',
};

// Pas 1 — tip eveniment + număr persoane
export async function saveEventType(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = eventTypeStepSchema.safeParse({
    eventTypeId: formData.get('eventTypeId'),
    nrPersons: formData.get('nrPersons'),
  });
  if (!parsed.success) {
    return { status: 'error', message: 'Verifică selecția.', fieldErrors: zodToFieldErrors(parsed.error) };
  }

  const eventTypeName = formData.get('eventTypeName');
  await markRequestStep('type', {
    eventTypeId: parsed.data.eventTypeId,
    eventTypeName: typeof eventTypeName === 'string' ? eventTypeName : undefined,
    nrPersons: parsed.data.nrPersons,
  });
  redirect(REQUEST_ROUTES.WHEN);
}

// Pas 2 — când + unde
export async function saveWhen(_: ActionState, formData: FormData): Promise<ActionState> {
  const flow = await getRequestFlow();
  if (!flow.eventTypeId) redirect(REQUEST_ROUTES.TYPE);

  const parsed = whenStepSchema.safeParse({
    eventDate: formData.get('eventDate'),
    eventTime: formData.get('eventTime'),
    locationCity: formData.get('locationCity'),
    locationAddress: formData.get('locationAddress'),
    deliveryIncluded: formData.get('deliveryIncluded'),
  });
  if (!parsed.success) {
    return { status: 'error', message: 'Verifică data și locația.', fieldErrors: zodToFieldErrors(parsed.error) };
  }

  const eventDate = new Date(`${parsed.data.eventDate}T${parsed.data.eventTime}`);
  if (Number.isNaN(eventDate.getTime())) {
    return { status: 'error', message: 'Data introdusă nu este validă.', fieldErrors: { eventDate: ['Dată invalidă.'] } };
  }
  if (eventDate.getTime() <= Date.now()) {
    return { status: 'error', message: 'Data evenimentului trebuie să fie în viitor.', fieldErrors: { eventDate: ['Alege o dată viitoare.'] } };
  }

  await markRequestStep('when', {
    eventDate: eventDate.toISOString(),
    locationCity: parsed.data.locationCity,
    locationAddress: parsed.data.locationAddress,
    deliveryIncluded: parsed.data.deliveryIncluded,
  });
  redirect(REQUEST_ROUTES.BUDGET);
}

// Pas 3 — buget + detalii → POST atomic al cererii complete
export async function publishRequest(_: ActionState, formData: FormData): Promise<ActionState> {
  const accessToken = await requireAccessToken();

  const flow = await getRequestFlow();
  if (!flow.eventTypeId) redirect(REQUEST_ROUTES.TYPE);
  if (!flow.nrPersons) redirect(REQUEST_ROUTES.TYPE);
  if (!flow.eventDate) redirect(REQUEST_ROUTES.WHEN);

  const parsed = budgetStepSchema.safeParse({
    budgetTotal: formData.get('budgetTotal'),
    budgetFlexible: formData.get('budgetFlexible'),
    message: formData.get('message'),
    expiresInHours: formData.get('expiresInHours'),
  });
  if (!parsed.success) {
    return { status: 'error', message: 'Verifică bugetul.', fieldErrors: zodToFieldErrors(parsed.error) };
  }

  const expiresAt = new Date(Date.now() + parsed.data.expiresInHours * 3600 * 1000).toISOString();

  let createdId: number;
  try {
    const created = await createRequest(
      {
        eventTypeId: flow.eventTypeId,
        nrPersons: flow.nrPersons,
        budgetTotal: parsed.data.budgetTotal,
        budgetFlexible: parsed.data.budgetFlexible,
        eventDate: flow.eventDate,
        locationCity: flow.locationCity,
        locationAddress: flow.locationAddress,
        message: parsed.data.message,
        deliveryIncluded: flow.deliveryIncluded ?? false,
        expiresAt,
      },
      accessToken,
    );
    createdId = created.id;
  } catch (err) {
    return { status: 'error', message: apiErrorMessage(err, REQUEST_ERROR_MESSAGES) };
  }

  await clearRequestFlow();
  redirect(`${REQUEST_ROUTES.DONE}?id=${createdId}`);
}

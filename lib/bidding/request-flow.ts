import { cookies } from 'next/headers';
import {
  COOKIE_NAMES,
  COOKIE_MAX_AGE,
  type LocationCity,
} from '@/lib/constants';

export type RequestStep = 'type' | 'when' | 'budget';

/**
 * Datele acumulate de-a lungul pașilor de creare a unei cereri.
 * Persistate într-un cookie httpOnly între pași; un singur POST se face la final
 * (operația de creare e atomică).
 */
export type RequestFlowState = {
  // pas 1 — tip + persoane
  eventTypeId?: number;
  eventTypeName?: string; // doar pentru afișare (recapitulare/succes)
  nrPersons?: number;

  // pas 2 — când + unde
  eventDate?: string; 
  locationCity?: LocationCity;
  locationAddress?: string;
  deliveryIncluded?: boolean;

  // pas 3 — buget + detalii
  budgetTotal?: number;
  budgetFlexible?: boolean;
  message?: string;
  expiresInHours?: number;

  completedSteps: RequestStep[];
};

const opts = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: COOKIE_MAX_AGE.REQUEST_FLOW,
};

export async function getRequestFlow(): Promise<RequestFlowState> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAMES.REQUEST_FLOW)?.value;
  if (!raw) return { completedSteps: [] };

  try {
    return JSON.parse(raw) as RequestFlowState;
  } catch {
    return { completedSteps: [] };
  }
}

export async function updateRequestFlow(patch: Partial<RequestFlowState>) {
  const current = await getRequestFlow();
  const merged: RequestFlowState = {
    ...current,
    ...patch,
    completedSteps: Array.from(
      new Set([...(current.completedSteps ?? []), ...(patch.completedSteps ?? [])]),
    ),
  };

  const store = await cookies();
  store.set(COOKIE_NAMES.REQUEST_FLOW, JSON.stringify(merged), opts);
  return merged;
}

export async function markRequestStep(step: RequestStep, patch: Partial<RequestFlowState> = {}) {
  return updateRequestFlow({ ...patch, completedSteps: [step] });
}

export async function clearRequestFlow() {
  const store = await cookies();
  store.delete(COOKIE_NAMES.REQUEST_FLOW);
}

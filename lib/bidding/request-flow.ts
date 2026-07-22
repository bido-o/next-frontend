import { COOKIE_NAMES, COOKIE_MAX_AGE, type LocationCity } from '@/lib/constants';
import { createFlowState } from '@/lib/create-flow-state';

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

const flow = createFlowState<RequestStep, RequestFlowState>(
  COOKIE_NAMES.REQUEST_FLOW,
  COOKIE_MAX_AGE.REQUEST_FLOW,
);

export const getRequestFlow = flow.get;
export const updateRequestFlow = flow.update;
export const markRequestStep = flow.mark;
export const clearRequestFlow = flow.clear;
